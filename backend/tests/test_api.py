"""Unit tests for FastAPI endpoints and JSON response contracts."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_shape():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "version" in data
    assert "model_loaded" in data
    assert isinstance(data["model_loaded"], bool)
    assert "modes_supported" in data
    assert "url" in data["modes_supported"]
    assert "sms" in data["modes_supported"]
    assert "text" in data["modes_supported"]

def test_analyze_response_contract_and_types():
    payload = {"url": "https://www.turkiye.gov.tr/hizmetler"}
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Top-level keys
    assert data["url"] == "https://www.turkiye.gov.tr/hizmetler"
    assert data["status"] in ["Güvenli", "Şüpheli", "Oltalama Riski"]
    assert isinstance(data["risk_score"], int)
    assert 0 <= data["risk_score"] <= 100
    assert isinstance(data["reasons"], list)
    assert len(data["reasons"]) > 0

    # Features sub-dictionary contract
    f = data["features"]
    assert isinstance(f["url_length"], int)
    assert isinstance(f["domain_length"], int)
    assert isinstance(f["path_length"], int)
    assert isinstance(f["subdomain_count"], int)
    assert isinstance(f["dot_count"], int)
    assert isinstance(f["digit_count"], int)
    assert isinstance(f["digit_ratio"], float)
    assert isinstance(f["hyphen_count"], int)
    assert isinstance(f["special_char_count"], int)
    assert isinstance(f["has_ip_address"], bool)
    assert isinstance(f["uses_https"], bool)
    assert isinstance(f["query_param_count"], int)
    assert isinstance(f["entropy"], float)
    assert isinstance(f["has_punycode"], bool)

def test_analyze_validation_error_shape():
    response = client.post("/analyze", json={"url": "invalidurl"})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)
    assert len(data["detail"]) > 0

def test_sms_endpoint_contract():
    payload = {
        "message": "Sayin kullanici, HGS borcunuz vardir. Odeme icin: http://hgs-online-ceza.cc",
        "sender": "HGS-BILGI"
    }
    response = client.post("/analyze/sms", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["Güvenli", "Şüpheli", "Oltalama Riski"]
    assert "detected_topics" in data
    assert "manipulation" in data
    assert "content_safety" in data
    assert "ai_score_explanation" in data

def test_text_endpoint_contract():
    payload = {
        "title": "Fatura Bildirimi",
        "content": "Elektrik faturanız son ödeme tarihi geçmiştir."
    }
    response = client.post("/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["Güvenli", "Şüpheli", "Oltalama Riski"]
    assert "detected_topics" in data
    assert "manipulation" in data
