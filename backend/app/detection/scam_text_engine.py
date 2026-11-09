"""
ScamTextEngine
Turkish SMS, email, and notification message analysis.
Evaluates:
- Topics: HGS/highway debt, utility bills, cargo delivery, banking & e-Devlet, fake lotteries/giveaways
- Social engineering tactics: Account termination threat, urgent payment pressure, credential/card requests
- Explicitly separates Topic Classification from Fraud Risk
- Multiple categories can be detected simultaneously
- Extracts links and delegates structural analysis to URLDetectionEngine
"""

import re
import uuid
from typing import Dict, Any, List, Optional
from app.detection.schemas import V1AnalysisResult
from app.detection.url_engine import URLDetectionEngine
from app.detection.content_safety_engine import ContentSafetyEngine

# Topic Keywords
TOPIC_DEFINITIONS = {
    "hgs_transit": {
        "label": "HGS / Otoyol Borcu",
        "keywords": ["hgs", "ogs", "otoyol", "köprü geçiş", "kgm", "ihlal", "geçiş ücreti", "plaka borcu", "otoyol borcu"]
    },
    "utility_bill": {
        "label": "Fatura Ödeme (Elektrik / Su / Doğalgaz / İnternet)",
        "keywords": ["fatura", "elektrik faturası", "su faturası", "doğalgaz", "internet borcu", "türk telekom", "turkcell", "vodafone", "tedaş", "iski", "igdaş", "kesinti", "gecikme faizi", "son ödeme"]
    },
    "cargo_delivery": {
        "label": "Kargo Teslimatı ve Paket Takibi",
        "keywords": ["kargo", "teslimat", "paketiniz", "ptt", "yurtiçi", "aras kargo", "mng", "sürat kargo", "adres güncelle", "gönderi kodu", "takip no", "dağıtıma çıktı"]
    },
    "banking_gov": {
        "label": "Banka & e-Devlet & Resmî Kurum",
        "keywords": ["e-devlet", "turkiye.gov", "adliye", "icra", "vergi dairesi", "gib", "sgk", "ziraat", "garanti", "iş bankası", "yapı kredi", "akbank", "vakıfbank", "halkbank", "papara"]
    },
    "reward_lottery": {
        "label": "Sahte Kampanya, Çekiliş ve Ödül",
        "keywords": ["tebrikler", "kazandınız", "çekiliş", "hediye çeki", "para ödülü", "aidat iadesi", "bonus", "ücretsiz airdrop", "şanslı numara", "talihli", "hediye çeki"]
    },
    "account_threat": {
        "label": "Hesap Kapatma ve Güvenlik Tehdidi",
        "keywords": ["hesabınız kapatılacak", "hesabınız askıya alındı", "erişim kısıtlandı", "bloke konuldu", "hesabınızı doğrulayın", "güvenlik uyarısı", "yasal yaptırım"]
    }
}

# Fraud indicators
URGENCY_DEMAND_PATTERNS = [
    re.compile(r"derhal|acil|hemen|son gün|son 24 saat|son 12 saat|gecikmeden", re.IGNORECASE),
    re.compile(r"icra takibi|haciz|yasal i[sş]lem|savc[ıi]l[ıi]k|cezai i[sş]lem", re.IGNORECASE)
]

CREDENTIAL_DEMAND_PATTERNS = [
    re.compile(r"kart bilgileri|kredi kart[ıi]|şifreniz|cvv|kart numaras[ıi]|kimlik numaras[ıi]|tc kimlik", re.IGNORECASE),
    re.compile(r"bilgilerinizi do[gğ]rulay[ıi]n|giri[sş] yaparak onaylay[ıi]n|hesab[ıi]n[ıi]za eri[sş]in", re.IGNORECASE)
]

PAYMENT_DEMAND_PATTERNS = [
    re.compile(r"ödemenizi yap[ıi]n|ücreti yat[ıi]r[ıi]n|borcu ödeyin|linke t[ıi]klay[ıi]n|t[ıi]klayarak ödeyiniz", re.IGNORECASE)
]

URL_PATTERN = re.compile(r"(?:https?://|www\.)[^\s/$.?#].[^\s]*", re.IGNORECASE)

class ScamTextEngine:
    """
    Turkish Scam Message and Email Engine.
    Carefully isolates topic tagging from fraud risk calculation.
    """

    ENGINE_VERSION = "v1.0.0-scam-text-engine"

    def __init__(self):
        self.url_engine = URLDetectionEngine()
        self.safety_engine = ContentSafetyEngine()

    def analyze(self, message: str, sender: Optional[str] = None, title: Optional[str] = None) -> V1AnalysisResult:
        analysis_id = str(uuid.uuid4())
        evidence: List[str] = []
        content_flags: List[str] = []
        detected_categories: List[str] = []
        limitations = [
            "Mesaj içindeki URL'ler ağ üzerinden taranmamış, leksikal özniteliklerle değerlendirilmiştir.",
            "Konu tespiti tek başına dolandırıcılık kanıtı sayılmaz; risk, baskı ve bağlantı analizine bağlıdır."
        ]

        full_text = f"{title or ''} {message or ''}".strip()
        if not full_text:
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="message",
                detected_categories=[],
                risk_level="unknown",
                risk_score=None,
                confidence=None,
                evidence=["Analiz edilecek mesaj metni boş veya tanımsız."],
                content_flags=["empty_input"],
                limitations=limitations,
                model_version=self.ENGINE_VERSION
            )

        text_lower = full_text.lower()

        # 1. Multi-topic Identification (Can match multiple simultaneously)
        for topic_key, topic_def in TOPIC_DEFINITIONS.items():
            matched_kws = [kw for kw in topic_def["keywords"] if kw in text_lower]
            if matched_kws:
                detected_categories.append(topic_key)
                evidence.append(f"Tespit Edilen Konu ({topic_def['label']}): {', '.join(matched_kws[:3])}")

        # 2. Urgency and Coercion Markers
        has_urgency = any(p.search(text_lower) for p in URGENCY_DEMAND_PATTERNS)
        if has_urgency:
            content_flags.append("urgency_coercion")
            evidence.append("Zaman baskısı, haciz veya cezai yaptırım tehdidi tespit edildi.")

        # 3. Credential or Payment Requests
        has_credential_demand = any(p.search(text_lower) for p in CREDENTIAL_DEMAND_PATTERNS)
        if has_credential_demand:
            content_flags.append("credential_harvesting_attempt")
            evidence.append("Kişisel veri, kimlik, şifre veya kart bilgisi doğrulama talebi mevcut.")

        has_payment_demand = any(p.search(text_lower) for p in PAYMENT_DEMAND_PATTERNS)
        if has_payment_demand:
            content_flags.append("payment_demand")
            evidence.append("Doğrudan para ödeme veya borç kapatma bağlantısı yönlendirmesi tespit edildi.")

        # 4. URL Extraction and Structural Link Evaluation
        raw_urls = URL_PATTERN.findall(full_text)
        embedded_url_results: List[V1AnalysisResult] = []
        has_high_risk_link = False
        has_official_link = False

        for raw_u in raw_urls:
            clean_u = raw_u.rstrip(".,;:!?)'\"")
            if clean_u:
                u_res = self.url_engine.analyze(clean_u)
                embedded_url_results.append(u_res)
                if u_res.risk_level == "high":
                    has_high_risk_link = True
                elif u_res.risk_level == "low" and any("official_" in c for c in u_res.detected_categories):
                    has_official_link = True

        # 5. Independent Content Safety Evaluation
        safety_res = self.safety_engine.analyze(message, title=title)
        for sf in safety_res.content_flags:
            if sf not in content_flags:
                content_flags.append(sf)

        # 6. Fraud Risk Score Computation
        # Crucial Rule: Topics (HGS, Fatura, PTT) DO NOT inflate risk on their own!
        risk_score = 0

        # High risk factors:
        if has_high_risk_link:
            risk_score += 60
            evidence.append("Mesaj içindeki bağlantı yüksek riskli/oltalama taklidi olarak değerlendirildi.")

        if has_credential_demand:
            risk_score += 35

        if has_urgency and has_payment_demand:
            risk_score += 30
        elif has_urgency:
            risk_score += 15
        elif has_payment_demand:
            risk_score += 15

        if "reward_lottery" in detected_categories and (raw_urls or has_credential_demand):
            risk_score += 60

        if "account_threat" in detected_categories and has_urgency:
            risk_score += 25

        # Mitigations (e.g. verified official domain link, or completely neutral informational text)
        if has_official_link and not has_credential_demand:
            risk_score = max(0, risk_score - 40)
            evidence.append("Mesaj resmî ve doğrulanmış kurum bağlantısına yönlendirmektedir.")

        if not raw_urls and not has_urgency and not has_credential_demand:
            # Neutral notification, e.g. "HGS bakiye yükleme tamamlandı"
            risk_score = 0
            evidence.append("Mesajda herhangi bir bağlantı, acil ödeme talebi veya kimlik avı tuzağı saptanmadı.")

        risk_score = min(max(risk_score, 0), 100)

        # Categorize risk level and calibrated confidence
        if risk_score >= 60:
            risk_level = "high"
            confidence = 0.90 if len(evidence) >= 2 else 0.75
        elif risk_score >= 30:
            risk_level = "medium"
            confidence = 0.78
        else:
            risk_level = "low"
            confidence = 0.85

        return V1AnalysisResult(
            analysis_id=analysis_id,
            input_type="message",
            detected_categories=detected_categories,
            risk_level=risk_level,
            risk_score=risk_score,
            confidence=confidence,
            evidence=evidence,
            content_flags=content_flags,
            limitations=limitations,
            model_version=self.ENGINE_VERSION,
            metadata={
                "extracted_url_count": len(embedded_url_results),
                "has_urgency": has_urgency,
                "has_credential_demand": has_credential_demand,
                "has_payment_demand": has_payment_demand,
                "sender": sender
            }
        )
