"""
Explainability Engine for Oltasez.

Translates structural, lexical, and statistical URL features
into clear, transparent, and user-friendly Turkish explanations.
"""

from typing import List, Dict, Any, Optional
from app.core.url_utils import (
    RISKY_TLDS,
    PHISHING_KEYWORDS,
    URL_LENGTH_WARN_THRESHOLD,
    SUBDOMAIN_COUNT_WARN_THRESHOLD,
    SUBDOMAIN_COUNT_HIGH_THRESHOLD,
    DIGIT_RATIO_WARN_THRESHOLD,
    SPECIAL_CHARS_WARN_THRESHOLD,
    HYPHEN_COUNT_WARN_THRESHOLD,
    ENTROPY_HIGH_THRESHOLD
)

def generate_explanations(
    features: Dict[str, Any],
    url: str,
    status: str,
    risk_score: int,
    ml_probability: Optional[float] = None,
    model_name: Optional[str] = None
) -> List[str]:
    """
    Generates deterministic, user-friendly Turkish explanations based on URL features.
    """
    reasons: List[str] = []
    url_lower = url.lower()
    hostname = features.get("_hostname", "").lower()

    # 1. IP Address usage
    if features.get("has_ip_address"):
        reasons.append(
            "Alan adı yerine doğrudan ham IP adresi kullanılmış. Güvenilir ve kurumsal siteler her zaman tescilli alan adları (domain) tercih eder."
        )

    # 2. Protocol Security (HTTPS vs HTTP)
    if not features.get("uses_https"):
        reasons.append(
            "Bağlantı şifresiz HTTP protokolü kullanıyor. Modern web standartlarında güvenli siteler verileri HTTPS ile şifreler."
        )

    # 3. Punycode / Homograph Lookalike Attack
    if features.get("has_punycode"):
        reasons.append(
            "Punycode ('xn--') formatı tespit edildi. Bilinen popüler markaların harflerini taklit eden aldatıcı benzer alan adı (homograf) riski taşır."
        )

    # 4. Risky / Abuse-prone TLDs
    matched_tld = next((tld for tld in RISKY_TLDS if hostname.endswith(tld)), None)
    if matched_tld:
        reasons.append(
            f"Oltalama saldırılarında ve sahte kampanyalarda sıkça istismar edilen bir alan adı uzantısı ({matched_tld}) tespit edildi."
        )

    # 5. Suspicious Subdomain Depth
    subdomain_count = features.get("subdomain_count", 0)
    if subdomain_count >= SUBDOMAIN_COUNT_HIGH_THRESHOLD:
        reasons.append(
            f"Adres çok sayıda alt alan adı katmanı ({subdomain_count} adet) içeriyor. Bu yöntem gerçek alan adını gizlemek amacıyla kullanılabilir."
        )
    elif subdomain_count == SUBDOMAIN_COUNT_WARN_THRESHOLD:
        reasons.append(
            "Birden fazla alt alan adı katmanı tespit edildi. Alan adının asıl sahibini gizleme eğiliminde olabilir."
        )

    # 6. Deceptive Keywords
    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in url_lower]
    if found_keywords:
        sample_words = ", ".join(found_keywords[:3])
        reasons.append(
            f"URL içinde kullanıcıyı giriş yapmaya veya hesap doğrulamaya zorlayan kelimeler ({sample_words}) bulundu."
        )

    # 7. High Character Entropy
    entropy = features.get("entropy", 0.0)
    if entropy >= ENTROPY_HIGH_THRESHOLD:
        reasons.append(
            f"URL yapısında anormal düzeyde karakter karmaşıklığı ({entropy:.2f}) saptandı. Adres algoritmalar tarafından rastgele üretilmiş olabilir."
        )

    # 8. High Digit Ratio & Digit Count
    digit_ratio = features.get("digit_ratio", 0.0)
    digit_count = features.get("digit_count", 0)
    if digit_ratio >= DIGIT_RATIO_WARN_THRESHOLD and digit_count >= 6:
        reasons.append(
            f"Bağlantı içerisinde olağandışı rakam yoğunluğu (%{int(digit_ratio * 100)}) var. Güvenli bağlantılar genellikle okunabilir kelimeler barındırır."
        )

    # 9. Too Many Hyphens in Domain
    if hostname.count("-") >= HYPHEN_COUNT_WARN_THRESHOLD:
        reasons.append(
            "Alan adında birden fazla tire (-) işareti kullanılarak sahte veya taklit bir marka görünümü hedeflenmiş olabilir."
        )

    # 10. Excessive URL Length
    url_length = features.get("url_length", 0)
    if url_length >= URL_LENGTH_WARN_THRESHOLD:
        reasons.append(
            f"URL karakter uzunluğu ({url_length} karakter) standartların oldukça üzerinde. Şüpheli parametreleri gizleme amacı taşıyabilir."
        )

    # 11. Too many special characters
    special_char_count = features.get("special_char_count", 0)
    if special_char_count >= SPECIAL_CHARS_WARN_THRESHOLD and len(reasons) < 4:
        reasons.append(
            f"URL yapısında yoğun miktarda özel karakter ({special_char_count} adet) ve yönlendirme parametresi bulundu."
        )

    # 12. ML Model Prediction context
    if ml_probability is not None and model_name:
        ml_score = int(ml_probability * 100)
        if ml_score >= 60:
            reasons.insert(
                0,
                f"Yapay zekâ modeli ({model_name}), bu URL'nin yapısal özniteliklerini %{ml_score} oranında bilinen phishing saldırı desenleriyle uyumlu buldu."
            )
        elif ml_score <= 25 and status == "Güvenli":
            reasons.insert(
                0,
                f"Yapay zekâ modeli ({model_name}), adresin genel özniteliklerini düşük risk (%{ml_score}) kategorisinde değerlendirdi."
            )

    # If URL is clean and safe, provide positive reassuring reasons
    if not reasons or status == "Güvenli":
        clean_reasons = []
        if features.get("uses_https"):
            clean_reasons.append("Standart ve güvenli HTTPS şifreleme protokolü kullanılmaktadır.")
        if not features.get("has_ip_address"):
            clean_reasons.append("Ham IP adresi yerine meşru alan adı (DNS) mimarisi tespit edildi.")
        if features.get("subdomain_count", 0) <= 1:
            clean_reasons.append("Alt alan adı derinliği ve hiyerarşisi olağan sınırlar içerisindedir.")
        clean_reasons.append("URL yapısında aldatıcı anahtar kelime veya yüksek entropili rastgele karakter deseni saptanmadı.")
        return clean_reasons[:4]

    return reasons[:5]
