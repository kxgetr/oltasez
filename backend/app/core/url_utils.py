import math
import re
from urllib.parse import urlparse
from typing import Tuple
from collections import Counter

# ==============================================================================
# CONSTANTS & CYBERSECURITY HEURISTICS
# ==============================================================================

IPV4_PATTERN = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}"
    r"(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)
IPV6_PATTERN = re.compile(r"^\[?[0-9a-fA-F:]+\]?$")

SPECIAL_CHARS = set("@?!=+&_%~#$,;:/*-")

# Top-level domains statistically abused in phishing campaigns
RISKY_TLDS = {
    ".xyz", ".top", ".work", ".click", ".buzz", ".fit", 
    ".gq", ".cf", ".ga", ".ml", ".cc", ".tk", ".loan"
}

# Deceptive keywords often found in phishing paths, subdomains, and queries
PHISHING_KEYWORDS = [
    "verify", "login", "account", "update", "banking", "secure",
    "password", "fatura", "onay", "dogrulama", "giris", "guvenlik",
    "free", "gift", "odul", "kart", "destek", "auth", "signin",
    "checkpoint", "wallet", "recovery"
]

# Standard thresholds for explainability and risk scoring
URL_LENGTH_WARN_THRESHOLD = 90
DOMAIN_LENGTH_WARN_THRESHOLD = 30
SUBDOMAIN_COUNT_WARN_THRESHOLD = 2
SUBDOMAIN_COUNT_HIGH_THRESHOLD = 3
DIGIT_RATIO_WARN_THRESHOLD = 0.18
SPECIAL_CHARS_WARN_THRESHOLD = 5
HYPHEN_COUNT_WARN_THRESHOLD = 2
ENTROPY_HIGH_THRESHOLD = 4.45

# ==============================================================================
# CORE URL UTILITY FUNCTIONS
# ==============================================================================

def normalize_url(raw_url: str) -> str:
    """
    Trims whitespace and ensures the URL includes an http:// or https:// scheme.
    Defaults to https:// when no protocol is provided.
    """
    cleaned = (raw_url or "").strip()
    if not (cleaned.startswith("http://") or cleaned.startswith("https://")):
        return f"https://{cleaned}"
    return cleaned

def is_ip_address(hostname: str) -> bool:
    """
    Determines whether a hostname string represents a raw IPv4 or IPv6 address.
    """
    if not hostname:
        return False
    clean_host = hostname.strip().strip("[]").split(":")[0]
    if IPV4_PATTERN.match(clean_host):
        return True
    if ":" in clean_host and IPV6_PATTERN.match(hostname.strip()):
        return True
    return False

def validate_url(url: str) -> Tuple[bool, str]:
    """
    Validates URL syntax, length, and minimum hostname structure.
    Returns:
        (is_valid: bool, error_message: str)
    """
    if not url or not url.strip():
        return False, "URL alanı boş bırakılamaz."

    normalized = normalize_url(url)
    if len(normalized) > 2048:
        return False, "URL uzunluğu 2048 karakter sınırını aşamaz."

    try:
        parsed = urlparse(normalized)
        hostname = parsed.hostname
        if not hostname:
            return False, "Geçerli bir ana makine / alan adı (hostname) bulunamadı."
        if "." not in hostname and not is_ip_address(hostname):
            return False, "Alan adı geçerli bir uzantı (TLD) veya IP adresi içermelidir (örn: site.com)."
        return True, ""
    except Exception as exc:
        return False, f"URL ayrıştırılamadı: {str(exc)}"

def calculate_shannon_entropy(text: str) -> float:
    """
    Calculates the Shannon entropy (information randomness) of a given string.
    High entropy indicates random character generation commonly seen in phishing URLs.
    """
    if not text:
        return 0.0
    length = len(text)
    counts = Counter(text)
    entropy = -sum((count / length) * math.log2(count / length) for count in counts.values())
    return round(entropy, 4)
