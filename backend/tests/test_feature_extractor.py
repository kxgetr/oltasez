"""Unit tests for URL feature extraction module."""
import pytest
from app.core.feature_extractor import extract_features, calculate_shannon_entropy, is_ip_address

def test_legitimate_url_features():
    url = "https://www.turkiye.gov.tr/hizmetler"
    feats = extract_features(url)
    
    assert feats["uses_https"] is True
    assert feats["has_ip_address"] is False
    assert feats["has_punycode"] is False
    assert feats["domain_length"] == len("www.turkiye.gov.tr")
    assert feats["subdomain_count"] == 1  # 'www' is subdomain
    assert feats["digit_count"] == 0
    assert feats["digit_ratio"] == 0.0

def test_ip_based_phishing_url():
    url = "http://192.168.1.100/login/auth.php?token=987"
    feats = extract_features(url)
    
    assert feats["has_ip_address"] is True
    assert feats["uses_https"] is False
    assert feats["query_param_count"] == 1
    assert feats["digit_count"] > 10

def test_punycode_homograph_attack():
    url = "https://xn--pple-43d.com/secure-login"
    feats = extract_features(url)
    
    assert feats["has_punycode"] is True
    assert feats["hyphen_count"] >= 2

def test_shannon_entropy_calculation():
    # Repetitive string has low entropy
    low_ent = calculate_shannon_entropy("aaaaaaaaaa")
    # Highly random string has high entropy
    high_ent = calculate_shannon_entropy("q7w8e9r0t1y2u3i4o5p6")
    
    assert low_ent < 1.0
    assert high_ent > 3.5

def test_malformed_url_safety():
    # Should not raise exception
    feats = extract_features("://broken-url")
    assert isinstance(feats["url_length"], int)
    assert feats["url_length"] > 0
