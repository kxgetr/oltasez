"""Unit tests for URL validation and normalization."""
import pytest
from app.core.url_utils import validate_url, normalize_url, is_ip_address

def test_normalize_url():
    assert normalize_url("google.com") == "https://google.com"
    assert normalize_url("http://google.com") == "http://google.com"
    assert normalize_url("https://google.com") == "https://google.com"
    assert normalize_url("  github.com/explore  ") == "https://github.com/explore"

def test_validate_valid_urls():
    valid_urls = [
        "https://www.turkiye.gov.tr",
        "http://example.com/login",
        "sub.domain.co.uk/path?q=1",
        "https://192.168.1.1/admin",
        "http://[2001:db8::1]/index.html",
    ]
    for url in valid_urls:
        is_valid, msg = validate_url(url)
        assert is_valid is True, f"Failed for {url}: {msg}"
        assert msg == ""

def test_validate_invalid_urls():
    invalid_urls = [
        "",
        "   ",
        "notadomain",
        "http://",
        "https://",
        "http:///no-host",
    ]
    for url in invalid_urls:
        is_valid, msg = validate_url(url)
        assert is_valid is False, f"Expected invalid for {url}"
        assert len(msg) > 0

def test_is_ip_address():
    assert is_ip_address("192.168.1.1") is True
    assert is_ip_address("10.0.0.1") is True
    assert is_ip_address("255.255.255.255") is True
    assert is_ip_address("999.999.999.999") is False  # Invalid octet
    assert is_ip_address("example.com") is False
    assert is_ip_address("192.168.1.1.com") is False
    assert is_ip_address("[2001:db8::1]") is True
