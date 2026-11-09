"""
Future Isolated SSRF-Protected Web Fetcher Specification and Guard.
Used when and if full page scraping is added in a separate sandboxed microservice.

Mitigations:
- Protocol whitelist (Only HTTP/HTTPS)
- Forbidden IP ranges (Loopback, Private RFC1918, Link-local, Cloud Metadata 169.254.169.254)
- DNS Rebinding protection (Resolves DNS before connection, pins resolved IP)
- Redirect-time re-validation
- Strict execution boundaries: Zero javascript execution, non-executable sandbox
- Hard limits: 5s timeout, 1 MB max response size
"""

import ipaddress
import socket
from typing import Tuple
from urllib.parse import urlparse

ALLOWED_SCHEMES = {"http", "https"}
MAX_REDIRECTS = 3
MAX_RESPONSE_BYTES = 1024 * 1024  # 1 MB
REQUEST_TIMEOUT_SECONDS = 5.0

# Cloud metadata IP & loopback / private IP subnets
FORBIDDEN_SUBNETS = [
    ipaddress.ip_network("127.0.0.0/8"),       # IPv4 loopback
    ipaddress.ip_network("10.0.0.0/8"),        # RFC 1918 private
    ipaddress.ip_network("172.16.0.0/12"),     # RFC 1918 private
    ipaddress.ip_network("192.168.0.0/16"),    # RFC 1918 private
    ipaddress.ip_network("169.254.0.0/16"),    # Link-local / AWS & GCP Metadata (169.254.169.254)
    ipaddress.ip_network("100.64.0.0/10"),     # Carrier-grade NAT
    ipaddress.ip_network("0.0.0.0/8"),         # Broadcast / this host
    ipaddress.ip_network("::1/128"),           # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),          # IPv6 unique local
    ipaddress.ip_network("fe80::/10"),         # IPv6 link-local
]

class SSRFSecurityException(Exception):
    """Raised when an outbound URL violates SSRF protection boundaries."""
    pass

def is_ip_forbidden(ip_str: str) -> bool:
    """Checks whether an IP address belongs to internal, loopback, or cloud metadata networks."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return any(ip in subnet for subnet in FORBIDDEN_SUBNETS)
    except ValueError:
        return True

def validate_url_for_safe_outbound_fetch(url_str: str) -> Tuple[bool, str, str]:
    """
    Validates URL before any outbound connection is established.
    Resolves hostname to IP to counter DNS rebinding attacks.

    Returns:
        (is_safe: bool, resolved_ip: str, error_message: str)
    """
    if not url_str or not url_str.strip():
        return False, "", "URL boş olamaz."

    try:
        parsed = urlparse(url_str.strip())
    except Exception as exc:
        return False, "", f"Geçersiz URL yapısı: {str(exc)}"

    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        return False, "", f"İzin verilmeyen protokol '{parsed.scheme}'. Yalnızca http ve https desteklenir."

    hostname = parsed.hostname
    if not hostname:
        return False, "", "URL geçerli bir ana makine içermiyor."

    # Direct IP check
    if hostname.replace(".", "").isdigit():
        if is_ip_forbidden(hostname):
            return False, hostname, f"Erişimi yasaklı dahili IP adresi veya bulut metadata servisi ({hostname})."
        return True, hostname, ""

    # DNS Resolution for Rebinding Defense
    try:
        # Resolve to all A/AAAA records
        addr_info = socket.getaddrinfo(hostname, None)
        resolved_ips = set(item[4][0] for item in addr_info)
        
        for ip in resolved_ips:
            if is_ip_forbidden(ip):
                return False, ip, f"DNS sorgusu yasaklı dahili/özel IP adresine çözümlendi ({ip}). Rebinding engellendi."

        primary_ip = list(resolved_ips)[0]
        return True, primary_ip, ""
    except socket.gaierror as exc:
        return False, "", f"DNS çözümleme başarısız: {str(exc)}"
    except Exception as exc:
        return False, "", f"Güvenlik denetimi hatası: {str(exc)}"
