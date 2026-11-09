"""
URLDetectionEngine
Analyzes URLs strictly without sending any outbound network requests or web scraping.
Includes registered domain analysis, homograph/punycode detection, IP detection,
entropy calculation, and safe official institution spoofing checks (avoiding naive substring verification).
"""

import math
import re
import uuid
from typing import Dict, Any, List, Optional, Tuple
from urllib.parse import urlparse
from collections import Counter

from app.detection.schemas import V1AnalysisResult
from app.detection.known_institutions import OFFICIAL_INSTITUTION_DOMAINS

# Precompiled regex patterns
IPV4_REGEX = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)
IPV6_REGEX = re.compile(r"^\[?[0-9a-fA-F:]+\]?$")

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".work", ".click", ".buzz", ".fit", ".gq",
    ".cf", ".ga", ".ml", ".cc", ".tk", ".loan", ".rest", ".guru", ".cfd", ".sbs"
}

# Deceptive security / auth keywords
PHISHING_PATH_KEYWORDS = [
    "verify", "login", "account", "update", "banking", "secure",
    "password", "fatura", "onay", "dogrulama", "giris", "guvenlik",
    "free", "gift", "odul", "kart", "destek", "auth", "signin",
    "checkpoint", "wallet", "recovery", "borc-ode", "ceza-ode"
]

COMMON_MULTI_PART_TLDS = {
    "com.tr", "gov.tr", "edu.tr", "org.tr", "net.tr", "bel.tr",
    "av.tr", "co.uk", "gov.uk", "org.uk", "com.au", "net.au"
}

def extract_registered_domain(hostname: str) -> Tuple[str, str, str]:
    """
    Extracts (subdomains, root_domain, public_suffix) accurately without naive split.
    e.g., 'sub.turkiye.gov.tr' -> ('sub', 'turkiye', 'gov.tr') -> registered_domain: 'turkiye.gov.tr'
    """
    if not hostname:
        return "", "", ""

    host_clean = hostname.lower().strip().split(":")[0].strip("[]")
    parts = host_clean.split(".")

    if len(parts) >= 3:
        potential_two_part_tld = f"{parts[-2]}.{parts[-1]}"
        if potential_two_part_tld in COMMON_MULTI_PART_TLDS:
            public_suffix = potential_two_part_tld
            root_domain = parts[-3]
            subdomains = ".".join(parts[:-3])
            registered_domain = f"{root_domain}.{public_suffix}"
            return subdomains, registered_domain, public_suffix

    if len(parts) >= 2:
        public_suffix = parts[-1]
        root_domain = parts[-2]
        subdomains = ".".join(parts[:-2])
        registered_domain = f"{root_domain}.{public_suffix}"
        return subdomains, registered_domain, public_suffix

    return "", host_clean, ""


def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy for string randomness."""
    if not text:
        return 0.0
    length = len(text)
    counts = Counter(text)
    return -sum((count / length) * math.log2(count / length) for count in counts.values())


class URLDetectionEngine:
    """
    Modular, privacy-preserving, zero-network URL security detection engine.
    """

    ENGINE_VERSION = "v1.0.0-url-engine"

    def normalize_url(self, raw_url: str) -> str:
        """Trims whitespace and ensures URL starts with http:// or https://."""
        cleaned = (raw_url or "").strip()
        if not (cleaned.startswith("http://") or cleaned.startswith("https://")):
            return f"https://{cleaned}"
        return cleaned

    def analyze(self, raw_url: str) -> V1AnalysisResult:
        analysis_id = str(uuid.uuid4())
        evidence: List[str] = []
        content_flags: List[str] = []
        detected_categories: List[str] = []
        limitations = [
            "URL ağ üzerinden ziyaret edilmemiştir (Zero-Network/No-Scraping).",
            "Analiz tamamen leksikal, yapısal ve bilinen resmî alan adı taklit kurallarına dayanır."
        ]

        cleaned_input = (raw_url or "").strip()
        if not cleaned_input:
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="url",
                detected_categories=[],
                risk_level="unknown",
                risk_score=None,
                confidence=None,
                evidence=["URL dizgesi boş veya tanımsız."],
                content_flags=["empty_input"],
                limitations=limitations,
                model_version=self.ENGINE_VERSION
            )

        normalized = self.normalize_url(cleaned_input)

        try:
            parsed = urlparse(normalized)
            hostname = parsed.hostname or ""
        except Exception as exc:
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="url",
                detected_categories=["malformed_url"],
                risk_level="unknown",
                risk_score=None,
                confidence=None,
                evidence=[f"URL ayrıştırılamadı (Sözdizimi hatası): {str(exc)}"],
                content_flags=["malformed_syntax"],
                limitations=limitations,
                model_version=self.ENGINE_VERSION
            )

        if not hostname or ("." not in hostname and not IPV4_REGEX.match(hostname)):
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="url",
                detected_categories=["invalid_hostname"],
                risk_level="unknown",
                risk_score=None,
                confidence=None,
                evidence=["Geçerli bir ana makine veya TLD uzantısı bulunamadı."],
                content_flags=["invalid_domain"],
                limitations=limitations,
                model_version=self.ENGINE_VERSION
            )

        # 1. Feature Extraction
        is_ip = bool(IPV4_REGEX.match(hostname.strip("[]").split(":")[0]))
        has_punycode = "xn--" in hostname.lower()
        subdomains, reg_domain, tld = extract_registered_domain(hostname)
        entropy = calculate_entropy(hostname)
        url_len = len(normalized)
        domain_len = len(hostname)
        subdomain_count = len(subdomains.split(".")) if subdomains else 0
        path = parsed.path or ""
        query = parsed.query or ""
        full_path = f"{path}?{query}".lower()

        # Check suspicious TLD
        has_risky_tld = any(hostname.lower().endswith(t) for t in SUSPICIOUS_TLDS)

        # Check official institution impersonation
        # NOT naive substring! Checks whether registered domain matches official roots.
        impersonated_institutions: List[str] = []
        is_verified_official = False

        for inst_key, inst_info in OFFICIAL_INSTITUTION_DOMAINS.items():
            official_roots: Set[str] = inst_info["official_roots"]
            # Is this actually an official domain or subdomain?
            if reg_domain in official_roots:
                is_verified_official = True
                detected_categories.append(f"official_{inst_key}")
                evidence.append(f"Doğrulanmış resmî kurum alan adı: {inst_info['name']} ({reg_domain})")
                break

            # If not an official root, check if institution keywords appear in hostname or path
            inst_kw_found = [kw for kw in inst_info["institution_keywords"] if kw in hostname.lower() or kw in path.lower()]
            if inst_kw_found:
                impersonated_institutions.append(inst_info["name"])
                detected_categories.append(f"impersonation_{inst_key}")
                evidence.append(
                    f"Resmî kurum taklit şüphesi: '{inst_info['name']}' adına ait anahtar kelimeler ({', '.join(inst_kw_found)}) "
                    f"yetkisiz '{reg_domain}' alan adı altında tespit edildi."
                )

        # 2. Risk Calculation based on explainable heuristics
        score = 0
        if is_verified_official:
            # Verified official government/bank domain
            risk_level = "low"
            risk_score = 0
            confidence = 0.95
            evidence.append("Alan adı resmî kayıtlı kurum listesiyle tam eşleşti.")
            return V1AnalysisResult(
                analysis_id=analysis_id,
                input_type="url",
                detected_categories=detected_categories,
                risk_level=risk_level,
                risk_score=risk_score,
                confidence=confidence,
                evidence=evidence,
                content_flags=content_flags,
                limitations=limitations,
                model_version=self.ENGINE_VERSION,
                metadata={
                    "registered_domain": reg_domain,
                    "subdomains": subdomains,
                    "entropy": round(entropy, 2),
                    "is_official": True
                }
            )

        # Non-official domain evaluations:
        if impersonated_institutions:
            score += 55
            content_flags.append("brand_impersonation")

        if is_ip:
            score += 45
            detected_categories.append("ip_hosting")
            content_flags.append("raw_ip_address")
            evidence.append(f"Alan adı yerine doğrudan ham IP adresi ({hostname}) kullanılmış.")

        if has_punycode:
            score += 35
            detected_categories.append("punycode_homograph")
            content_flags.append("idn_homograph_attack")
            evidence.append("Homograf saldırısı veya Punycode ('xn--') kullanımı tespit edildi.")

        if has_risky_tld:
            score += 25
            detected_categories.append("suspicious_tld")
            content_flags.append("high_risk_tld")
            evidence.append(f"İstatistiki olarak oltalama amaçlı suistimal edilen TLD uzantısı ({tld}).")

        if subdomain_count >= 3:
            score += 20
            detected_categories.append("excessive_subdomains")
            evidence.append(f"Şüpheli derecede derin alt alan adı ({subdomain_count} seviye: {subdomains}).")

        if entropy >= 4.45:
            score += 15
            evidence.append(f"Yüksek karakter karmaşıklığı / Shannon entropisi ({entropy:.2f}).")

        if "@" in normalized:
            score += 35
            content_flags.append("credential_url_spoof")
            evidence.append("URL kimlik bilgisi gizleme ('@') karakteri içeriyor.")

        matched_phish_kw = [kw for kw in PHISHING_PATH_KEYWORDS if kw in full_path]
        if matched_phish_kw:
            score += min(len(matched_phish_kw) * 12, 30)
            detected_categories.append("phishing_keywords_in_path")
            evidence.append(f"Yanıltıcı URL yolu anahtar kelimeleri: {', '.join(matched_phish_kw[:4])}")

        if url_len > 100:
            score += 10
            evidence.append(f"Olağandışı URL uzunluğu ({url_len} karakter).")

        score = min(max(score, 0), 100)

        # Categorize risk level & confidence
        if score >= 60:
            risk_level = "high"
            confidence = 0.88 if len(evidence) >= 2 else 0.70
        elif score >= 30:
            risk_level = "medium"
            confidence = 0.75
        else:
            risk_level = "low"
            confidence = 0.82
            if not evidence:
                evidence.append("Belirgin bir anomali veya siber tehdit belirteci saptanmadı.")

        return V1AnalysisResult(
            analysis_id=analysis_id,
            input_type="url",
            detected_categories=detected_categories,
            risk_level=risk_level,
            risk_score=score,
            confidence=confidence,
            evidence=evidence,
            content_flags=content_flags,
            limitations=limitations,
            model_version=self.ENGINE_VERSION,
            metadata={
                "registered_domain": reg_domain,
                "subdomains": subdomains,
                "entropy": round(entropy, 2),
                "is_ip": is_ip,
                "has_punycode": has_punycode
            }
        )
