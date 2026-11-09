"""Unit tests for Title and Body text analysis."""
from app.services.analyzer import analyze_text_service
from app.schemas.analysis import TextAnalysisRequest


def test_benign_text_analysis():
    req = TextAnalysisRequest(
        title="Haftalık Ekip Toplantısı Gündemi",
        content="Merhaba ekip, perşembe günü saat 10:00'da sprint planlama toplantımız yapılacaktır. Katılım zorunludur."
    )
    res = analyze_text_service(req)
    assert res.status == "Güvenli"
    assert res.risk_score < 30
    assert len(res.extracted_urls) == 0


def test_bank_impersonation_email_text():
    req = TextAnalysisRequest(
        title="Acil: Banka Hesabınız Güvenlik Nedeniyle Kısıtlandı",
        content="Sayın müşterimiz, Garanti BBVA hesabınızda şüpheli işlem tespit edilmiştir. Hesabınızın kalıcı olarak kapatılmaması için 1 saat içinde giriş yapıp doğrulayınız: http://garanti-guvenlik-dogrulama.top/giris"
    )
    res = analyze_text_service(req)
    topic_keys = [t.key for t in res.detected_topics]
    assert "banking_gov" in topic_keys or "account_verification" in topic_keys
    assert res.manipulation.has_urgency is True
    assert res.risk_score >= 50
    assert len(res.extracted_urls) == 1
    assert res.extracted_urls[0]["features"]["has_punycode"] is False


def test_no_fake_ai_confidence_flag():
    req = TextAnalysisRequest(
        title="Fatura Bilgilendirmesi",
        content="Doğalgaz faturanız ödenmiştir. Detaylar için web sitemizi ziyaret ediniz."
    )
    res = analyze_text_service(req)
    # Ensure transparency: ai_score_explanation states no model is fabricated
    assert "Kural ve sezgisel" in res.ai_score_explanation or "heuristic" in res.ai_score_explanation.lower()
