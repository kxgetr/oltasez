"""
ContentSafetyEngine
Evaluates:
- Profanity and insults (including Turkish character variations and leetspeak masking)
- Aggressive or threatening titles / subject lines
- Extreme artificial urgency and psychological coercion
- Clickbait sensationalism
- Context-aware preservation (avoiding false positives from quotes, news reports or discussions)
"""

import re
import uuid
from typing import Dict, Any, List, Optional, Set
from app.detection.schemas import V1AnalysisResult

# Common Turkish leetspeak / masking character replacements
CHAR_SUBSTITUTIONS = {
    '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i', '|': 'i',
    '0': 'o', '5': 's', '$': 's', '7': 't', '8': 'b', 'v': 'u'
}

BASE_OFFENSIVE_WORDS = [
    "amk", "aq", "orospu", "pic", "piç", "sikik", "siktir", "yarrak",
    "gotveren", "götveren", "ibne", "kahpe", "pezevenk", "serefsiz",
    "şerefsiz", "haysiyetsiz", "salak", "gerizekali", "gerizekalı", "aptal",
    "dangalak", "ahmak", "kopek soyu", "it herif", "lanet", "bok"
]

# Words that could be mistaken if matched as pure substring (e.g. 'salak' vs 'otlak')
# We enforce word boundaries or token normalization.

CLICKBAIT_PATTERNS = [
    re.compile(r"şok şok|inanılmaz|gözlerinize inanamayacaksınız|bunu kimse bilmiyor", re.IGNORECASE),
    re.compile(r"dünyayı sarsan|akılalmaz|tıklayın görün|bunu mutlaka okuyun", re.IGNORECASE),
    re.compile(r"milyonlarca kişiyi ilgilendiriyor|büyük vurgun|flaş gelişme", re.IGNORECASE)
]

AGGRESSIVE_TITLE_PATTERNS = [
    re.compile(r"derhal|son uyar[ıi]|icra davas[ıi]|haciz i[sş]lemi|hapse|savc[ıi]l[ıi]k", re.IGNORECASE),
    re.compile(r"hesab[ıi]n[ıi]z kapat[ıi]lacak|son 1 saat|cezaland[ıi]r[ıi]lacaks[ıi]n[ıi]z", re.IGNORECASE)
]

QUOTED_CONTEXT_PATTERN = re.compile(r"[\"'\u201c\u201d\u00ab\u00bb](.*?)[\"'\u201c\u201d\u00ab\u00bb]")

def normalize_text_masking(text: str) -> str:
    """Replaces common leet masking symbols with their Latin equivalent."""
    t = text.lower()
    for char, replacement in CHAR_SUBSTITUTIONS.items():
        t = t.replace(char, replacement)
    return t

class ContentSafetyEngine:
    """
    Independent content safety, toxicity, and communication tone assessment.
    Runs separately from fraud/phishing calculation.
    """

    ENGINE_VERSION = "v1.0.0-content-safety"

    def analyze(self, text: str, title: Optional[str] = None) -> V1AnalysisResult:
        analysis_id = str(uuid.uuid4())
        evidence: List[str] = []
        content_flags: List[str] = []
        detected_categories: List[str] = []
        limitations = [
            "İçerik güvenliği analizi argo, küfür ve manipülasyon dili üzerine odaklıdır.",
            "Bu değerlendirme doğrudan dolandırıcılık veya oltalama kararı vermez."
        ]

        full_content = f"{title or ''} {text or ''}".strip()
        if not full_content:
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="content_safety",
                detected_categories=[],
                risk_level="unknown",
                risk_score=None,
                confidence=None,
                evidence=["Analiz edilecek metin boş veya tanımsız."],
                content_flags=["empty_input"],
                limitations=limitations,
                model_version=self.ENGINE_VERSION
            )

        norm_content = normalize_text_masking(full_content)
        words_in_text = set(re.findall(r"\b[\wğüşöçıİĞÜŞÖÇ]+\b", norm_content))

        # 1. Profanity Detection (Exact token boundary & masked)
        matched_offensive: List[str] = []
        for bad_word in BASE_OFFENSIVE_WORDS:
            norm_bad = normalize_text_masking(bad_word)
            if " " in norm_bad:
                if norm_bad in norm_content:
                    matched_offensive.append(bad_word)
            else:
                if norm_bad in words_in_text:
                    matched_offensive.append(bad_word)

        # Context-aware: Check if bad word appears inside quotes (e.g. quote from someone else)
        is_quoted = False
        quotes = QUOTED_CONTEXT_PATTERN.findall(full_content)
        for quote in quotes:
            q_norm = normalize_text_masking(quote)
            if any(b in q_norm for b in matched_offensive):
                is_quoted = True
                break

        if matched_offensive:
            detected_categories.append("offensive_language")
            if is_quoted:
                content_flags.append("quoted_offensive_language")
                evidence.append(
                    f"Uygunsuz/hakaret içeren ifade alıntı içinde tespit edildi ({', '.join(matched_offensive[:3])}). "
                    f"Bağlam gereği risk seviyesi hafifletildi."
                )
            else:
                content_flags.append("offensive_language")
                evidence.append(f"Küfür, hakaret veya saldırgan dil tespit edildi: {', '.join(matched_offensive[:3])}")

        # 2. Aggressive / Threatening Title
        if title:
            norm_title = normalize_text_masking(title)
            matched_agg_titles = [p.pattern for p in AGGRESSIVE_TITLE_PATTERNS if p.search(norm_title)]
            if matched_agg_titles:
                detected_categories.append("aggressive_title")
                content_flags.append("threatening_headline")
                evidence.append("Başlıkta saldırgan, haciz veya cezai tehdit dili kullanılmış.")

        # 3. Clickbait / Sensationalism
        matched_clickbait = [p.pattern for p in CLICKBAIT_PATTERNS if p.search(norm_content)]
        if matched_clickbait:
            detected_categories.append("clickbait")
            content_flags.append("sensationalist_clickbait")
            evidence.append("Aşırı abartılı, merak uyandırıcı ve yanıltıcı sansasyonel dil (clickbait) tespit edildi.")

        # 4. Extreme urgency manipulation
        urgency_markers = [
            "derhal", "son 24 saat", "son 1 saat", "hapse gireceksiniz", "icra kapıda",
            "hemen yapmazsanız", "anında bloke", "yasal sorumluluk"
        ]
        found_urgency = [u for u in urgency_markers if u in norm_content]
        if found_urgency:
            detected_categories.append("extreme_urgency")
            content_flags.append("urgency_pressure")
            evidence.append(f"Zaman ve panik odaklı manipülatif dil: {', '.join(found_urgency[:3])}")

        # Safety Risk Score calculation (separate from scam risk)
        score = 0
        if "offensive_language" in detected_categories:
            score += 35 if is_quoted else 65
        if "aggressive_title" in detected_categories:
            score += 30
        if "extreme_urgency" in detected_categories:
            score += 25
        if "clickbait" in detected_categories:
            score += 15

        score = min(max(score, 0), 100)

        if score >= 60:
            risk_level = "high"
            confidence = 0.85
        elif score >= 25:
            risk_level = "medium"
            confidence = 0.75
        else:
            risk_level = "low"
            confidence = 0.90
            evidence.append("İçerikte nefret söylemi, küfür veya saldırgan tehdit unsuru bulunamadı.")

        return V1AnalysisResult(
            analysis_id=analysis_id,
            input_type="content_safety",
            detected_categories=detected_categories,
            risk_level=risk_level,
            risk_score=score,
            confidence=confidence,
            evidence=evidence,
            content_flags=content_flags,
            limitations=limitations,
            model_version=self.ENGINE_VERSION,
            metadata={
                "has_offensive": bool(matched_offensive),
                "is_quoted": is_quoted,
                "has_clickbait": bool(matched_clickbait)
            }
        )
