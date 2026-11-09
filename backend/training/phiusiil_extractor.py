"""
UCI PhiUSIIL Phishing URL Dataset Ingestion & Feature Extractor.
Extracts purely lexical & structural features directly computable from raw URL strings without network requests.
"""

import math
import re
from typing import Dict, Any, List, Tuple
from collections import Counter
from urllib.parse import urlparse

IPV4_PATTERN = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)

MULTI_PART_TLDS = {
    "com.tr", "gov.tr", "edu.tr", "org.tr", "net.tr", "co.uk", "gov.uk", "org.uk", "com.au"
}

def calculate_shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    length = len(text)
    counts = Counter(text)
    return -sum((count / length) * math.log2(count / length) for count in counts.values())

def extract_registered_domain(hostname: str) -> str:
    """Extracts base registered domain to prevent domain leakage in cross-validation."""
    if not hostname:
        return ""
    clean = hostname.lower().split(":")[0].strip("[]")
    parts = clean.split(".")
    if len(parts) >= 3:
        two_part = f"{parts[-2]}.{parts[-1]}"
        if two_part in MULTI_PART_TLDS:
            return f"{parts[-3]}.{two_part}"
    if len(parts) >= 2:
        return f"{parts[-2]}.{parts[-1]}"
    return clean

def extract_url_features_pure(raw_url: str) -> Dict[str, Any]:
    """
    Extracts pure lexical features without any network connection.
    Features:
    1. url_length
    2. domain_length
    3. path_length
    4. subdomain_count
    5. dot_count
    6. digit_count
    7. digit_ratio
    8. hyphen_count
    9. special_char_count
    10. has_ip_address
    11. uses_https
    12. query_param_count
    13. entropy
    14. has_punycode
    """
    cleaned = (raw_url or "").strip()
    norm = cleaned if (cleaned.startswith("http://") or cleaned.startswith("https://")) else f"https://{cleaned}"
    
    try:
        parsed = urlparse(norm)
        hostname = parsed.hostname or ""
    except Exception:
        hostname = ""
        parsed = urlparse("https://invalid.local")

    path = parsed.path or ""
    query = parsed.query or ""
    
    reg_domain = extract_registered_domain(hostname)
    clean_host = hostname.strip("[]").split(":")[0]
    has_ip = bool(IPV4_PATTERN.match(clean_host))
    has_punycode = "xn--" in hostname.lower()
    
    dot_count = cleaned.count(".")
    hyphen_count = cleaned.count("-")
    digit_count = sum(c.isdigit() for c in cleaned)
    digit_ratio = round(digit_count / max(len(cleaned), 1), 4)
    special_chars = sum(1 for c in cleaned if c in "@?!=+&_%~#$,;:/*-")
    
    # Subdomain count
    subdomains = hostname.replace(reg_domain, "").strip(".")
    subdomain_count = len(subdomains.split(".")) if subdomains else 0
    query_param_count = len(query.split("&")) if query else 0
    entropy = round(calculate_shannon_entropy(cleaned), 4)
    
    return {
        "registered_domain": reg_domain,
        "url_length": len(cleaned),
        "domain_length": len(hostname),
        "path_length": len(path),
        "subdomain_count": subdomain_count,
        "dot_count": dot_count,
        "digit_count": digit_count,
        "digit_ratio": digit_ratio,
        "hyphen_count": hyphen_count,
        "special_char_count": special_chars,
        "has_ip_address": 1 if has_ip else 0,
        "uses_https": 1 if norm.startswith("https://") else 0,
        "query_param_count": query_param_count,
        "entropy": entropy,
        "has_punycode": 1 if has_punycode else 0
    }

FEATURE_COLUMNS = [
    "url_length", "domain_length", "path_length", "subdomain_count",
    "dot_count", "digit_count", "digit_ratio", "hyphen_count",
    "special_char_count", "has_ip_address", "uses_https",
    "query_param_count", "entropy", "has_punycode"
]
