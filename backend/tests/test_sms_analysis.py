"""Unit tests for SMS fraud detection and heuristics."""
from app.services.analyzer import analyze_sms_service
from app.schemas.analysis import SMSAnalysisRequest


def test_hgs_topic_without_scam_is_safe():
    """
    Test the critical rule:
    Topic detection ('HGS') alone is NOT proof of fraud.
    An official or neutral informational text should not be marked phishing risk.
    """
    req = SMSAnalysisRequest(
        message="HGS bakiye yukleme isleminiz tamamlanmistir. Kalan bakiyeniz 150 TL.",
        sender="HGS-INFO"
    )
    res = analyze_sms_service(req)
    # Topic should be detected
    topic_keys = [t.key for t in res.detected_topics]
    assert "hgs_transit" in topic_keys
    # But risk should be Safe because no urgency, no link
    assert res.status == "Güvenli"
    assert res.risk_score < 30
    assert not res.manipulation.has_urgency
    assert not res.content_safety.has_offensive_language


def test_hgs_scam_with_urgency_and_link():
    """Fake HGS notification with artificial urgency and suspicious link."""
    req = SMSAnalysisRequest(
        message="Sayin Musterimiz, odenmemis HGS borcunuz nedeniyle icra takibi baslatilacaktir. Hemen odeyin: http://hgs-ceza-ode.cc/odeme",
        sender="+905551234567"
    )
    res = analyze_sms_service(req)
    topic_keys = [t.key for t in res.detected_topics]
    assert "hgs_transit" in topic_keys
    assert res.manipulation.has_urgency is True
    assert res.manipulation.has_financial_demand is True
    assert len(res.extracted_urls) == 1
    assert res.status in ["Şüpheli", "Oltalama Riski"]
    assert res.risk_score >= 50


def test_profanity_separation_from_fraud_risk():
    """
    Test the critical rule:
    Offensive language or profanity is NOT proof of phishing.
    Content safety should be flagged, but fraud risk must stay low if no scam patterns exist.
    """
    req = SMSAnalysisRequest(
        message="Lan salak adam, yarin saat 3te bulusalim.",
        sender="Ahmet"
    )
    res = analyze_sms_service(req)
    # Content safety must catch the offensive word
    assert res.content_safety.has_offensive_language is True
    assert len(res.content_safety.flagged_words) > 0
    # Phishing/fraud risk should NOT be inflated to 'Oltalama Riski'
    assert res.status == "Güvenli"
    assert res.risk_score < 30


def test_cargo_delivery_phishing():
    """Cargo delivery trap with fake update link."""
    req = SMSAnalysisRequest(
        message="Paketiniz adres yetersizligi nedeniyle teslim edilemedi. 24 saat icinde adresinizi guncelleyin: http://ptt-kargo-takip.xyz/bilgi",
        sender="PTT-BILGI"
    )
    res = analyze_sms_service(req)
    topic_keys = [t.key for t in res.detected_topics]
    assert "cargo_delivery" in topic_keys
    assert res.manipulation.has_urgency is True
    assert len(res.extracted_urls) == 1
    assert res.risk_score >= 50
