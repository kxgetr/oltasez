from typing import List, Tuple, Dict, Any, Optional
from app.core.feature_extractor import extract_features
from app.core.model_loader import model_manager
from app.core.explainer import generate_explanations, RISKY_TLDS, PHISHING_KEYWORDS
from app.core.text_utils import (
    detect_topics,
    analyze_urgency_and_manipulation,
    analyze_content_safety,
    extract_urls_from_text
)
from app.schemas.analysis import (
    FeatureSummary,
    URLAnalysisResponse,
    SMSAnalysisResponse,
    TextAnalysisResponse,
    TopicItem,
    ManipulationIndicators,
    ContentSafetyReport,
    RiskStatus
)

def map_score_to_status(score: int) -> RiskStatus:
    """
    Standard risk mapping:
    - 0-34: Güvenli
    - 35-64: Şüpheli
    - 65-100: Oltalama Riski
    """
    if score <= 34:
        return "Güvenli"
    elif score <= 64:
        return "Şüpheli"
    else:
        return "Oltalama Riski"

# ==============================================================================
# 1. URL ANALİZİ
# ==============================================================================

def analyze_url_service(normalized_url: str) -> URLAnalysisResponse:
    """
    Analyzes a single URL purely based on lexical and structural features.
    No network requests or page scraping performed.
    """
    feats = extract_features(normalized_url)
    hostname = feats.get("_hostname", "").lower()
    url_lower = normalized_url.lower()

    # Topic detection on URL path and domain
    detected_topics_raw = detect_topics(normalized_url)
    detected_topics = [TopicItem(**t) for t in detected_topics_raw]

    penalty = 0
    if feats["has_ip_address"]:
        penalty += 45
    if not feats["uses_https"]:
        penalty += 20
    if feats["has_punycode"]:
        penalty += 35

    matched_tld = next((tld for tld in RISKY_TLDS if hostname.endswith(tld)), None)
    if matched_tld:
        penalty += 25

    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in url_lower]
    if found_keywords:
        penalty += min(len(found_keywords) * 12, 30)

    if feats["subdomain_count"] >= 3:
        penalty += 25
    elif feats["subdomain_count"] == 2:
        penalty += 10

    if feats["entropy"] > 4.6:
        penalty += 18
    if feats["url_length"] > 95:
        penalty += 15
    if feats["digit_ratio"] > 0.18:
        penalty += 15
    if hostname.count("-") >= 2:
        penalty += 15

    # ML Inference or Heuristic Fallback
    ml_prob, model_name = model_manager.predict(feats)

    if ml_prob is not None:
        ml_score = int(ml_prob * 100)
        combined_score = int(ml_score * 0.70 + penalty * 0.30)
        risk_score = min(max(combined_score, 0), 100)
        ai_explanation = f"Eğitilmiş makine öğrenimi modeli ({model_name}) ile %{ml_score} oltalama benzerliği ve leksikal öznitelikler birleştirilerek hesaplandı."
    else:
        # DO NOT produce fake AI scores! Explicitly state deterministic heuristics
        fallback_score = min(max(10 + penalty, 5), 98)
        risk_score = fallback_score
        ai_explanation = "Gerçek ML modeli henüz diskte bulunmadığı için uydurma AI skoru üretilmemiştir; puan tamamen matematiksel ve kural tabanlı yapısal belirteçlerle hesaplanmıştır."

    status = map_score_to_status(risk_score)

    reasons = generate_explanations(
        features=feats,
        url=normalized_url,
        status=status,
        risk_score=risk_score,
        ml_probability=ml_prob,
        model_name=model_name
    )

    # Contextual note if a topic was detected in the URL
    if detected_topics:
        topic_labels = ", ".join(t.label for t in detected_topics)
        reasons.append(f"Tespit Edilen Bağlam/Konu: {topic_labels}. (Not: Bir kurum veya hizmet adının URL'de geçmesi tek başına dolandırıcılık kanıtı değildir; ancak alan adı resmi kurumla uyuşmuyorsa taklit riski artar).")

    feats.pop("_hostname", None)
    feature_summary = FeatureSummary(**feats)

    return URLAnalysisResponse(
        url=normalized_url,
        status=status,
        risk_score=risk_score,
        reasons=reasons,
        detected_topics=detected_topics,
        features=feature_summary,
        ai_score_explanation=ai_explanation
    )

# ==============================================================================
# 2. SMS / MESAJ ANALİZİ
# ==============================================================================

def analyze_sms_service(message: str, sender: Optional[str] = None) -> SMSAnalysisResponse:
    """
    Analyzes an SMS or instant message for phishing, urgent manipulation, and content safety.
    """
    combined_text = f"{sender or ''} {message}".strip()

    # 1. Topic detection
    topics_raw = detect_topics(combined_text)
    detected_topics = [TopicItem(**t) for t in topics_raw]

    # 2. Urgency and Manipulation
    manipulation_raw = analyze_urgency_and_manipulation(combined_text)
    manipulation = ManipulationIndicators(**manipulation_raw)

    # 3. Content Safety (Separate from phishing)
    safety_raw = analyze_content_safety(combined_text)
    content_safety = ContentSafetyReport(**safety_raw)

    # 4. Extract URLs
    found_urls = extract_urls_from_text(message)

    # 5. Risk Score Computation
    score = 10
    reasons: List[str] = []

    # Does it have a link?
    url_result: Optional[URLAnalysisResponse] = None
    if found_urls:
        first_url = found_urls[0]
        try:
            url_result = analyze_url_service(first_url)
            score += int(url_result.risk_score * 0.5)
            reasons.append(f"Mesajda web bağlantısı tespit edildi ({first_url}). Bağlantı risk derecesi: {url_result.status} (%{url_result.risk_score}).")
        except Exception:
            score += 20
            reasons.append(f"Mesajda ayrıştırılamayan veya şüpheli biçimli bir bağlantı bulundu ({first_url}).")
    else:
        reasons.append("Mesaj içeriğinde herhangi bir harici web bağlantısı (URL) tespit edilmedi.")

    # Pressure & Urgency
    if manipulation.has_urgency:
        score += 25
        terms_str = ", ".join(manipulation.urgency_terms)
        reasons.append(f"Aciliyet ve baskı unsurları tespit edildi ({terms_str}). Kullanıcıyı düşünmeden harekete geçirmeye zorlama riski yüksek.")

    if manipulation.has_payment_demand:
        score += 20
        terms_str = ", ".join(manipulation.payment_terms)
        reasons.append(f"Ödeme veya para transferi talebi belirteçleri tespit edildi ({terms_str}).")

    # Topic context warning
    if detected_topics:
        topics_str = ", ".join(t.label for t in detected_topics)
        reasons.append(f"İlgili Konu Başlıkları: {topics_str}. (Önemli: Konunun HGS veya Fatura olması tek başına dolandırıcılık kanıtı değildir; aciliyet ve sahte bağlantı varlığı belirleyicidir).")

    # Content safety note (kept strictly separate)
    if content_safety.has_offensive_language:
        reasons.append("Uyarı: Mesajda argo, küfür veya kaba ifadeler saptandı. (Not: Saldırgan dil tek başına phishing kanıtı değildir ancak mesaj güvenilirliğini zedeler).")

    risk_score = min(max(score, 5), 98)
    status = map_score_to_status(risk_score)

    summary_text = (
        "Mesaj güvenli ve olağan bir bilgilendirme metnine benziyor." if status == "Güvenli"
        else "Mesajda dikkat edilmesi gereken şüpheli aciliyet veya ödeme belirteçleri var." if status == "Şüpheli"
        else "Mesaj, kullanıcıyı aldatmaya yönelik yüksek riskli dolandırıcılık / phishing karakteristiği taşımaktadır."
    )

    ai_explanation = "SMS analizinde kurallar, bağlam tespiti ve leksikal belirteçler şeffaf biçimde birleştirilmiştir; uydurma AI skoru verilmemiştir."

    return SMSAnalysisResponse(
        status=status,
        risk_score=risk_score,
        summary=summary_text,
        reasons=reasons,
        detected_topics=detected_topics,
        manipulation=manipulation,
        content_safety=content_safety,
        extracted_urls=found_urls,
        url_analysis=url_result,
        ai_score_explanation=ai_explanation
    )

# ==============================================================================
# 3. BAŞLIK VE METİN İÇERİK ANALİZİ
# ==============================================================================

def analyze_text_service(content: str, title: Optional[str] = None) -> TextAnalysisResponse:
    """
    Analyzes longer text blocks, email content, or social media posts.
    """
    full_text = f"{title or ''}\n{content}".strip()

    # 1. Topic identification
    topics_raw = detect_topics(full_text)
    detected_topics = [TopicItem(**t) for t in topics_raw]

    # 2. Manipulation indicators
    manipulation_raw = analyze_urgency_and_manipulation(full_text)
    manipulation = ManipulationIndicators(**manipulation_raw)

    # 3. Content Safety
    safety_raw = analyze_content_safety(full_text)
    content_safety = ContentSafetyReport(**safety_raw)

    # 4. URLs
    found_urls = extract_urls_from_text(content)

    score = 10
    reasons: List[str] = []

    if found_urls:
        score += min(len(found_urls) * 15, 30)
        reasons.append(f"Metin içerisinde {len(found_urls)} adet web bağlantısı bulundu.")

    if manipulation.has_urgency:
        score += 25
        reasons.append(f"Metinde panik, süre kısıtlaması veya yasal tehdit dili bulundu ({', '.join(manipulation.urgency_terms)}).")

    if manipulation.has_payment_demand:
        score += 20
        reasons.append(f"Doğrudan ödeme veya hesap numarası talebi tespit edildi ({', '.join(manipulation.payment_terms)}).")

    if detected_topics:
        topics_str = ", ".join(t.label for t in detected_topics)
        reasons.append(f"İşlenen Konular: {topics_str}. Kurumsal kimlik taklitlerine karşı gönderici adresini mutlaka teyit ediniz.")

    if content_safety.has_offensive_language:
        reasons.append("İçerik Güvenliği Uyarısı: Metinde hakaret veya saldırgan ifadeler tespit edildi.")

    if not reasons or (score <= 15 and not found_urls):
        reasons.append("Metin yapısında bilinen bir dolandırıcılık veya manipülasyon şablonuna rastlanmadı.")

    risk_score = min(max(score, 5), 95)
    status = map_score_to_status(risk_score)

    summary_text = (
        "İçerik temiz ve düşük riskli görünmektedir." if status == "Güvenli"
        else "İçerik bazı şüpheli unsurlar veya baskı dili barındırmaktadır." if status == "Şüpheli"
        else "İçerik yüksek riskli dolandırıcılık veya kimlik avı belirteçleri içermektedir."
    )

    ai_explanation = "Başlık ve metin analizi kural tabanlı doğal dil filtreleri ve bağlam çıkarımıyla şeffaf olarak çalışmaktadır."

    return TextAnalysisResponse(
        status=status,
        risk_score=risk_score,
        summary=summary_text,
        reasons=reasons,
        detected_topics=detected_topics,
        manipulation=manipulation,
        content_safety=content_safety,
        extracted_urls=found_urls,
        ai_score_explanation=ai_explanation
    )
