import re
from typing import List, Dict, Any, Set, Tuple

# ==============================================================================
# 1. KONU TESPİT DESENLERİ (TOPIC / SCAM THEME)
# Not: Konunun tespit edilmesi tek başına dolandırıcılık kanıtı değildir!
# ==============================================================================

TOPIC_PATTERNS: Dict[str, Dict[str, Any]] = {
    "hgs_transit": {
        "label": "HGS / OGS / Geçiş Ücreti",
        "keywords": ["hgs", "ogs", "karayolları", "otoyol", "köprü geçiş", "kgm", "ihlal", "geçiş ücreti", "ceza borcu", "plaka borcu"]
    },
    "utility_bill": {
        "label": "Fatura (Elektrik / Su / Doğalgaz / İnternet)",
        "keywords": ["fatura", "elektrik faturası", "su faturası", "doğalgaz", "internet borcu", "türk telekom", "turkcell", "vodafone", "tedaş", "iski", "igdaş", "kesinti", "gecikme faizi", "son ödeme tarihi"]
    },
    "cargo_delivery": {
        "label": "Kargo Teslimatı & Paket",
        "keywords": ["kargo", "teslimat", "paketiniz", "ptt kargo", "yurtiçi kargo", "aras kargo", "mng", "sürat kargo", "adres güncelle", "gönderi kodu", "takip no", "dağıtıma çıktı", "alınmayan kargo"]
    },
    "banking_gov": {
        "label": "Banka & e-Devlet & Resmi Kurum",
        "keywords": ["e-devlet", "turkiye.gov", "adliye", "icra", "vergi dairesi", "gib", "sgk", "ziraat", "garanti", "iş bankası", "yapı kredi", "akbank", "vakıfbank", "halkbank", "papara", "paribu", "hesabınız askıya", "bloke konuldu"]
    },
    "reward_prize": {
        "label": "Ödül / Hediye / Çekiliş Vaadi",
        "keywords": ["tebrikler", "kazandınız", "çekiliş", "hediye çeki", "para ödülü", "aidat iadesi", "bonus", "ücretsiz airdrop", "şanslı numara", "talihli", "hediye paketi"]
    },
    "account_verification": {
        "label": "Hesap Doğrulama & Güvenlik Tuzağı",
        "keywords": ["hesabınızı doğrulayın", "giriş yapıldı", "şifre sıfırlama", "hesap güvenliği", "doğrulama kodu", "onaylayınız", "erişim kısıtlandı", "güvenlik uyarısı", "tek kullanımlık şifre", "hesap askıya"]
    }
}

# ==============================================================================
# 2. TEHDİT, ACİLİYET VE MANİPÜLASYON BELİRTEÇLERİ (URGENCY & PRESSURE)
# ==============================================================================

URGENCY_KEYWORDS = [
    "derhal", "acil", "hemen", "son gün", "son 24 saat", "son 12 saat", "gecikmeden",
    "icra takibi", "haciz", "yasal işlem", "savcılık", "ceza davası", "kolluk kuvveti",
    "iptal edilecek", "askıya alınacak", "silinecektir", "bloke edilecektir", "cezai işlem"
]

PAYMENT_DEMAND_KEYWORDS = [
    "ödemenizi yapın", "ücreti yatırın", "ödemek için tıklayın", "linke tıklayın",
    "kart aidatı", "teslimat ücreti", "gümrük vergisi", "harç bedeli", "komisyon"
]

# ==============================================================================
# 3. İÇERİK GÜVENLİĞİ: KÜFÜR, HAKARET VE SALDIRGAN DİL (PROFANITY & TOXICITY)
# Not: Küfür tek başına phishing kanıtı değildir!
# ==============================================================================

OFFENSIVE_KEYWORDS = [
    "amk", "aq", "orospu", "piç", "sikik", "siktir", "yarrak", "götveren", "ibne",
    "kahpe", "pezevenk", "şerefsiz", "haysiyetsiz", "salak", "gerizekalı", "aptal",
    "dangalak", "ahmak", "it herif", "köpek soyu"
]

URL_REGEX = re.compile(
    r"(?:https?://|www\.)[^\s/$.?#].[^\s]*",
    re.IGNORECASE
)

def extract_urls_from_text(text: str) -> List[str]:
    """Finds all URL strings in arbitrary text."""
    if not text:
        return []
    matches = URL_REGEX.findall(text)
    # Clean trailing punctuation commonly appended in sentences
    cleaned = []
    for m in matches:
        m_clean = m.rstrip(".,;:!?)'\"")
        if m_clean:
            cleaned.append(m_clean)
    return cleaned

def detect_topics(text: str) -> List[Dict[str, Any]]:
    """
    Identifies topics/themes discussed in the text without assuming malice.
    """
    text_lower = text.lower()
    detected = []

    for topic_id, info in TOPIC_PATTERNS.items():
        matched_words = [kw for kw in info["keywords"] if kw in text_lower]
        if matched_words:
            detected.append({
                "topic_id": topic_id,
                "label": info["label"],
                "matched_terms": matched_words[:4]
            })

    return detected

def analyze_urgency_and_manipulation(text: str) -> Dict[str, Any]:
    """
    Evaluates emotional manipulation, artificial urgency, and financial demands.
    """
    text_lower = text.lower()
    found_urgency = [w for w in URGENCY_KEYWORDS if w in text_lower]
    found_payment = [w for w in PAYMENT_DEMAND_KEYWORDS if w in text_lower]

    has_urgency = len(found_urgency) > 0
    has_payment_demand = len(found_payment) > 0

    return {
        "has_urgency": has_urgency,
        "urgency_terms": found_urgency[:4],
        "has_payment_demand": has_payment_demand,
        "payment_terms": found_payment[:4]
    }

def analyze_content_safety(text: str) -> Dict[str, Any]:
    """
    Checks for offensive, abusive, or profane language.
    Does NOT affect phishing risk directly, kept separate.
    """
    text_lower = text.lower()
    found_offensive = []

    # Word boundary aware search for profanity
    for word in OFFENSIVE_KEYWORDS:
        pattern = rf"(?:\b|_){re.escape(word)}(?:\b|_)"
        if re.search(pattern, text_lower):
            found_offensive.append(word)

    has_profanity = len(found_offensive) > 0

    return {
        "is_safe": not has_profanity,
        "has_offensive_language": has_profanity,
        "offensive_count": len(found_offensive),
        "details": "İçerikte saldırgan veya argo dil tespit edildi." if has_profanity else "İçerik dil kuralları ve nezaket açısından temiz."
    }
