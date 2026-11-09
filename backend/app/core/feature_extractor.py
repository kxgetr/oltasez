"""
Robust and modular URL Feature Extraction module.
Extracts 14 lexical, structural, and statistical features.
"""

from urllib.parse import urlparse, parse_qs
from typing import Dict, Any
from app.core.url_utils import (
    normalize_url,
    is_ip_address,
    calculate_shannon_entropy,
    SPECIAL_CHARS
)

def extract_features(url: str) -> Dict[str, Any]:
    """
    Robustly extracts structural, lexical, and statistical features from a URL.
    Safely handles edge cases without raising unhandled exceptions.
    """
    normalized = normalize_url(url)

    try:
        parsed = urlparse(normalized)
    except Exception:
        parsed = urlparse("https://invalid-fallback.local")

    scheme = (parsed.scheme or "https").lower()
    netloc = parsed.netloc or ""
    # Strip port if present: hostname:8080 -> hostname
    hostname = netloc.split(":")[0].strip().lower() if netloc else ""
    path = parsed.path or ""
    query = parsed.query or ""

    # 1. Length features
    url_length = len(normalized)
    domain_length = len(hostname)
    path_length = len(path)

    # 2. Scheme & Host features
    uses_https = (scheme == "https")
    has_ip_address = is_ip_address(hostname)

    # 3. Subdomain count
    if has_ip_address or not hostname:
        subdomain_count = 0
    else:
        parts = hostname.split(".")
        # e.g., 'a.b.example.com' -> 4 parts -> 2 subdomains ('a', 'b')
        subdomain_count = max(0, len(parts) - 2)

    # 4. Punycode check (IDN homograph attack: e.g. xn--...)
    has_punycode = "xn--" in hostname

    # 5. Character counters
    dot_count = normalized.count(".")
    hyphen_count = normalized.count("-")
    digit_count = sum(c.isdigit() for c in normalized)
    digit_ratio = round(digit_count / url_length, 4) if url_length > 0 else 0.0
    special_char_count = sum(c in SPECIAL_CHARS for c in normalized)

    # 6. Query parameters
    if query:
        try:
            params = parse_qs(query, keep_blank_values=True)
            query_param_count = len(params)
        except Exception:
            query_param_count = query.count("=")
    else:
        query_param_count = 0

    # 7. Shannon entropy
    entropy = calculate_shannon_entropy(normalized)

    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "subdomain_count": subdomain_count,
        "dot_count": dot_count,
        "digit_count": digit_count,
        "digit_ratio": digit_ratio,
        "hyphen_count": hyphen_count,
        "special_char_count": special_char_count,
        "has_ip_address": has_ip_address,
        "uses_https": uses_https,
        "query_param_count": query_param_count,
        "entropy": entropy,
        "has_punycode": has_punycode,
        # Internal metadata helper for explainability
        "_hostname": hostname,
    }
