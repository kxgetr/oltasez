"""Unit tests for user-friendly explainability engine."""
from app.core.feature_extractor import extract_features
from app.core.explainer import generate_explanations

def test_explain_legitimate_url():
    url = "https://turkiye.gov.tr"
    feats = extract_features(url)
    reasons = generate_explanations(feats, url, status="Güvenli", risk_score=10)
    
    assert len(reasons) > 0
    assert any("HTTPS" in r for r in reasons)
    assert any("DNS" in r or "ham IP" in r for r in reasons)
    # Shouldn't claim 100% certainty or false warnings
    assert not any("istismar edilen" in r for r in reasons)

def test_explain_ip_based_url():
    url = "http://192.168.1.1/login.php"
    feats = extract_features(url)
    reasons = generate_explanations(feats, url, status="Oltalama Riski", risk_score=85)
    
    # Must explain IP and HTTP clearly
    assert any("ham IP" in r for r in reasons)
    assert any("şifresiz HTTP" in r for r in reasons)

def test_explain_suspicious_subdomains_and_tld():
    url = "https://secure.login.verify.account.service.xyz/auth"
    feats = extract_features(url)
    reasons = generate_explanations(feats, url, status="Oltalama Riski", risk_score=78)
    
    assert any("alt alan adı" in r for r in reasons)
    assert any(".xyz" in r for r in reasons)
    assert any("kelimeler" in r for r in reasons)

def test_explain_entropy_and_punycode():
    url = "https://xn--e1afmkfd.com/q7w8e9r0t1y2u3i4o5p6"
    feats = extract_features(url)
    reasons = generate_explanations(feats, url, status="Şüpheli", risk_score=60)
    
    assert any("Punycode" in r or "homograf" in r for r in reasons)
    assert any("karakter karmaşıklığı" in r or "entropi" in r for r in reasons)
