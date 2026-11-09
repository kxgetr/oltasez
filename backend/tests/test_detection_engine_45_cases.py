"""
Comprehensive Suite of 45 Synthetic & Real-world Test Cases for Oltasez Detection Engine.
Validates:
- URLDetectionEngine (real official vs deceptive domains, punycode, entropy, IP)
- ScamTextEngine (HGS, bills, cargo, bank impersonation, urgency, credential harvesting)
- ContentSafetyEngine (profanity, masked characters, quotes, aggressive titles, clickbait)
- Critical architectural rules:
    - Legit official domains produce low risk.
    - Mentions of 'HGS' or 'fatura' without scam elements DO NOT produce high risk.
    - Profanity flags content safety without corrupting fraud risk.
    - Unknown returned when input is missing or ambiguous.
"""

import pytest
from app.detection.url_engine import URLDetectionEngine
from app.detection.scam_text_engine import ScamTextEngine
from app.detection.content_safety_engine import ContentSafetyEngine
from app.detection.schemas import V1AnalysisResult

url_engine = URLDetectionEngine()
scam_engine = ScamTextEngine()
safety_engine = ContentSafetyEngine()

# ==============================================================================
# SECTION 1: URLDetectionEngine Tests (15 cases)
# ==============================================================================

def test_url_empty_returns_unknown():
    res = url_engine.analyze("")
    assert res.risk_level == "unknown"
    assert res.risk_score is None

def test_url_whitespace_returns_unknown():
    res = url_engine.analyze("   ")
    assert res.risk_level == "unknown"
    assert res.risk_score is None

def test_url_official_turkiye_gov_tr_is_low():
    res = url_engine.analyze("https://www.turkiye.gov.tr/hizmetler")
    assert res.risk_level == "low"
    assert res.risk_score == 0
    assert any("official_turkiye_gov" in c for c in res.detected_categories)

def test_url_official_kgm_gov_tr_is_low():
    res = url_engine.analyze("https://kgm.gov.tr/Sayfalar/KGM/SiteTr/Root/Otoyollar.aspx")
    assert res.risk_level == "low"
    assert res.risk_score == 0
    assert any("official_kgm_hgs" in c for c in res.detected_categories)

def test_url_official_ptt_gov_tr_is_low():
    res = url_engine.analyze("https://gonderitakip.ptt.gov.tr")
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_url_official_gib_gov_tr_is_low():
    res = url_engine.analyze("https://dijital.gib.gov.tr/portal/login")
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_url_official_bank_garanti_is_low():
    res = url_engine.analyze("https://garantibbva.com.tr/bireysel")
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_url_official_bank_isbank_is_low():
    res = url_engine.analyze("https://isbank.com.tr/internet-subesi")
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_url_spoofed_turkiye_gov_phishing():
    # Subdomain or domain impersonation attempt
    res = url_engine.analyze("https://turkiye-gov-tr.ceza-odeme.cc/giris")
    assert res.risk_level == "high"
    assert res.risk_score >= 60
    assert "brand_impersonation" in res.content_flags

def test_url_spoofed_garanti_bank_phishing():
    res = url_engine.analyze("http://garantibbva-guvenlik-onay.top/login")
    assert res.risk_level == "high"
    assert res.risk_score >= 60
    assert any("impersonation_garanti" in c for c in res.detected_categories)

def test_url_raw_ip_address_is_high():
    res = url_engine.analyze("http://192.168.1.100/admin/login")
    assert res.risk_score >= 45
    assert "raw_ip_address" in res.content_flags

def test_url_punycode_homograph():
    res = url_engine.analyze("https://xn--e-devlet-t8a.com/odeme")
    assert "punycode_homograph" in res.detected_categories
    assert res.risk_score >= 35

def test_url_risky_tld_and_phish_path():
    res = url_engine.analyze("http://hesap-guncelleme.xyz/verify-account")
    assert res.risk_score >= 50
    assert "high_risk_tld" in res.content_flags

def test_url_credential_at_sign_spoof():
    res = url_engine.analyze("https://turkiye.gov.tr@attacker-site.com/fake")
    assert "credential_url_spoof" in res.content_flags
    assert res.risk_score >= 40

def test_url_regular_benign_domain():
    res = url_engine.analyze("https://blog.medium.com/engineering-practices")
    assert res.risk_level == "low"
    assert res.risk_score < 30

# ==============================================================================
# SECTION 2: ScamTextEngine Tests (15 cases)
# ==============================================================================

def test_scam_empty_returns_unknown():
    res = scam_engine.analyze("")
    assert res.risk_level == "unknown"
    assert res.risk_score is None

def test_scam_hgs_legitimate_notification_is_low():
    """
    CRITICAL RULE: Mentioning HGS alone is NOT proof of phishing.
    """
    text = "HGS bakiye yukleme isleminiz tamamlanmistir. Yeni bakiyeniz 350 TL'dir."
    res = scam_engine.analyze(message=text, sender="HGS")
    assert "hgs_transit" in res.detected_categories
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_scam_utility_bill_legitimate_notification_is_low():
    """
    CRITICAL RULE: Mentioning 'fatura' alone is NOT proof of phishing.
    """
    text = "Sayin abonemiz, Kasim ayi elektrik faturaniz 420 TL olarak duzenlenmistir."
    res = scam_engine.analyze(message=text, sender="TEDAS")
    assert "utility_bill" in res.detected_categories
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_scam_cargo_legitimate_delivery_is_low():
    text = "Sayin musterimiz, kargonuz dagitima cikarilmistir. Kurye kodu: 4819."
    res = scam_engine.analyze(message=text, sender="YURTICI")
    assert "cargo_delivery" in res.detected_categories
    assert res.risk_level == "low"

def test_scam_hgs_fraud_with_urgency_and_phish_link():
    text = "Sayin surucu, odenmemis HGS cezaniz vardir. 24 saat icinde odeyiniz yoksa icra takibi baslatilacaktir: http://hgs-ceza-ode.cc"
    res = scam_engine.analyze(message=text, sender="+905559876543")
    assert "hgs_transit" in res.detected_categories
    assert res.risk_level == "high"
    assert res.risk_score >= 60
    assert "urgency_coercion" in res.content_flags

def test_scam_cargo_fraud_with_link():
    text = "Paketiniz teslim edilemedi. Adresinizi derhal guncelleyin: http://ptt-kargo-teslim.xyz/takip"
    res = scam_engine.analyze(message=text, sender="PTT-BILGI")
    assert "cargo_delivery" in res.detected_categories
    assert res.risk_level == "high"

def test_scam_bank_impersonation_account_threat():
    text = "Ziraat Bankasi hesabiniz guvenlik sebebiyle bloke konuldu. Blokenin kaldirilmasi icin: http://ziraat-onay.top"
    res = scam_engine.analyze(message=text, sender="ZIRAAT")
    assert "banking_gov" in res.detected_categories
    assert "account_threat" in res.detected_categories
    assert res.risk_level == "high"

def test_scam_reward_lottery_trap():
    text = "Tebrikler, buyuk cekilis sonrasi 50.000 TL nakit para odulu kazandiniz! Kart aidati iadesi icin tiklayin: http://odul-al.buzz"
    res = scam_engine.analyze(message=text)
    assert "reward_lottery" in res.detected_categories
    assert res.risk_level == "high"

def test_scam_credential_harvesting():
    text = "Lutfen kredi karti bilgilerinizi ve sifrenizi girerek hesabinizin guvenligini onaylayiniz."
    res = scam_engine.analyze(message=text)
    assert "credential_harvesting_attempt" in res.content_flags
    assert res.risk_score >= 35

def test_scam_urgent_payment_demand_without_link():
    text = "Odenmemis borcunuz sebebiyle icra takibi baslatildi. Derhal odeyiniz."
    res = scam_engine.analyze(message=text)
    assert "urgency_coercion" in res.content_flags
    assert res.risk_level == "medium"

def test_scam_multiple_categories_simultaneously():
    text = "Elektrik faturasi ve HGS otoyol borcunuz odenmedi. Haciz oncesi odeyin."
    res = scam_engine.analyze(message=text)
    assert "hgs_transit" in res.detected_categories
    assert "utility_bill" in res.detected_categories
    assert len(res.detected_categories) >= 2

def test_scam_legit_message_with_official_url():
    text = "HGS borcunuzu sorgulamak icin resmi sitemizi ziyaret edebilirsiniz: https://www.turkiye.gov.tr"
    res = scam_engine.analyze(message=text)
    assert res.risk_level == "low"
    assert res.risk_score <= 15

def test_scam_casual_conversation_is_low():
    text = "Selam kardesim, aksam hali saha macina gelecek misin?"
    res = scam_engine.analyze(message=text)
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_scam_title_and_message_combined():
    title = "Acil Duyuru: Banka Kartiniz Askida"
    body = "Hesabiniz kalici olarak kapatilacak. Hemen tiklayip giris yapiniz: http://guvenlik-dogrulama.cc"
    res = scam_engine.analyze(message=body, title=title)
    assert res.risk_level == "high"
    assert "account_threat" in res.detected_categories

def test_scam_no_fake_ai_confidence():
    text = "Faturanizi odeyiniz."
    res = scam_engine.analyze(message=text)
    assert res.model_version.startswith("v1.0.0")
    assert res.confidence is not None

# ==============================================================================
# SECTION 3: ContentSafetyEngine Tests (15 cases)
# ==============================================================================

def test_safety_empty_returns_unknown():
    res = safety_engine.analyze("")
    assert res.risk_level == "unknown"
    assert res.risk_score is None

def test_safety_clean_text_is_low():
    text = "Gelecek hafta yeni urun lansmanimizi gerceklestirecegiz. Herkese basarilar dilerim."
    res = safety_engine.analyze(text)
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_safety_direct_profanity():
    text = "Sen tam bir salak ve serefsiz bir adamsin."
    res = safety_engine.analyze(text)
    assert "offensive_language" in res.detected_categories
    assert res.risk_score >= 60

def test_safety_masked_leetspeak_profanity():
    # Masking with numbers / symbols (e.g. s4l4k or $erefsiz)
    text = "Bunu yapan insan tam bir $erefsiz ve s4l4k."
    res = safety_engine.analyze(text)
    assert "offensive_language" in res.detected_categories
    assert res.risk_score >= 60

def test_safety_quoted_context_mitigation():
    # Quoted text should not trigger as severe a penalty
    text = 'Musteri temsilcisi raporda soyle yazmis: "Musteri telefonda salak dedi".'
    res = safety_engine.analyze(text)
    assert "quoted_offensive_language" in res.content_flags
    # Quoted insults are penalized less than direct insults
    assert res.risk_score < 60

def test_safety_aggressive_title_headline():
    title = "DERHAL MAHKEMEYE VERILECEKSINIZ VE HAPSE GIRECEKSINIZ"
    res = safety_engine.analyze(text="Bildirim detaylari asagidadir.", title=title)
    assert "aggressive_title" in res.detected_categories
    assert "threatening_headline" in res.content_flags

def test_safety_clickbait_detection():
    text = "Sok sok! Inanilmaz olay, gozlerinize inanamayacaksiniz! Dunyayi sarsan buyuk vurgun."
    res = safety_engine.analyze(text)
    assert "clickbait" in res.detected_categories
    assert "sensationalist_clickbait" in res.content_flags

def test_safety_extreme_urgency_panic():
    text = "Son 1 saat icinde yapmazsaniz aninda bloke edilecektir ve icra kapida."
    res = safety_engine.analyze(text)
    assert "extreme_urgency" in res.detected_categories

def test_safety_profanity_independent_from_phishing():
    """
    CRITICAL RULE: Profanity is NOT proof of phishing.
    When analyzed via scam_engine, profanity will flag content_flags,
    but will NOT turn a harmless message into a high risk phishing scam.
    """
    msg = "Lan salak adam, bugun kahve icmeye gelecek misin?"
    res = scam_engine.analyze(message=msg)
    assert "offensive_language" in res.content_flags
    # Because there are no phishing links, no urgency, no bank/hgs/card fraud:
    assert res.risk_level == "low"
    assert res.risk_score < 30

def test_safety_turkish_characters_variations():
    text = "Bize hakaret eden şerefsiz şahıs hakkında işlem yapıldı."
    res = safety_engine.analyze(text)
    assert "offensive_language" in res.detected_categories

def test_safety_word_boundary_no_false_positive():
    # Ensure words like 'otlak' don't trigger 'salak'
    text = "Koydeki buyuk otlak alani koruma altina alindi."
    res = safety_engine.analyze(text)
    assert "offensive_language" not in res.detected_categories

def test_safety_multiple_violations():
    title = "DERHAL ODEME YAPINIZ - SON UYARI"
    body = "Inanilmaz gelisme! Salak yerine konmak istemiyorsaniz tiklayin."
    res = safety_engine.analyze(text=body, title=title)
    assert len(res.detected_categories) >= 2
    assert res.risk_score >= 60

def test_safety_neutral_news_report():
    text = "Cumhurbaskanligi Iletisim Baskanligi dezenformasyon bultenini yayimladi."
    res = safety_engine.analyze(text)
    assert res.risk_level == "low"

def test_safety_polite_reminder():
    text = "Lutfen randevunuza 15 dakika once gelmeye ozen gosteriniz. Tesekkurler."
    res = safety_engine.analyze(text)
    assert res.risk_level == "low"
    assert res.risk_score == 0

def test_safety_evidence_list_not_empty():
    text = "Toplanti tutanaklari ektedir."
    res = safety_engine.analyze(text)
    assert len(res.evidence) > 0
