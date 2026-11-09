from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional, Dict, Any
from app.core.url_utils import validate_url, normalize_url

# ==============================================================================
# ENUMS & SUB-SCHEMAS
# ==============================================================================

RiskStatus = Literal["Güvenli", "Şüpheli", "Oltalama Riski"]

class TopicItem(BaseModel):
    """Identified context/topic in the content (e.g. HGS, Fatura, Kargo)."""
    topic_id: str
    label: str
    matched_terms: List[str]

class ManipulationIndicators(BaseModel):
    """Urgency, panic, threat, and payment demand indicators."""
    has_urgency: bool
    urgency_terms: List[str]
    has_payment_demand: bool
    payment_terms: List[str]

class ContentSafetyReport(BaseModel):
    """Separate content safety evaluation (profanity, insults, abusive language)."""
    is_safe: bool
    has_offensive_language: bool
    offensive_count: int
    details: str

class FeatureSummary(BaseModel):
    """Comprehensive real URL-extracted features."""
    url_length: int = Field(..., description="URL toplam karakter uzunluğu")
    domain_length: int = Field(..., description="Alan adı (hostname) karakter uzunluğu")
    path_length: int = Field(..., description="URL yol (path) karakter uzunluğu")
    subdomain_count: int = Field(..., description="Alt alan adı (subdomain) sayısı")
    dot_count: int = Field(..., description="Nokta (.) karakteri sayısı")
    digit_count: int = Field(..., description="Toplam rakam karakteri sayısı")
    digit_ratio: float = Field(..., description="Rakamların URL uzunluğuna oranı")
    hyphen_count: int = Field(..., description="Tire (-) karakteri sayısı")
    special_char_count: int = Field(..., description="Özel karakter sayısı (@, ?, =, &, -, vb.)")
    has_ip_address: bool = Field(..., description="Alan adı yerine IP adresi kullanılmış mı?")
    uses_https: bool = Field(..., description="HTTPS güvenli protokolü kullanılıyor mu?")
    query_param_count: int = Field(..., description="Sorgu parametresi sayısı")
    entropy: float = Field(..., description="URL Shannon entropi değeri (rastlantısallık)")
    has_punycode: bool = Field(..., description="Punycode (IDN homograf saldırısı) barındırıyor mu?")

# ==============================================================================
# 1. URL ANALİZ MODELLERİ
# ==============================================================================

class URLAnalysisRequest(BaseModel):
    """Payload sent by client to analyze a single URL."""
    url: str = Field(
        ...,
        description="Analiz edilecek web sitesi adresi (URL)",
        examples=["https://hgs-ceza-sorgulama-onay.xyz/odeme"],
        min_length=3,
        max_length=2048
    )

    @field_validator("url")
    @classmethod
    def check_url_format(cls, value: str) -> str:
        is_valid, error_msg = validate_url(value)
        if not is_valid:
            raise ValueError(error_msg)
        return normalize_url(value)

class URLAnalysisResponse(BaseModel):
    """Structured analysis response for a URL."""
    url: str
    status: RiskStatus
    risk_score: int = Field(..., ge=0, le=100)
    reasons: List[str]
    detected_topics: List[TopicItem] = Field(default_factory=list)
    features: FeatureSummary
    ai_score_explanation: str = Field(
        default="Deterministik leksikal kural motoru devrededir. Gerçek ML modeli hazır olmadıkça varsayımsal AI skoru üretilmez."
    )

# ==============================================================================
# 2. SMS / MESAJ ANALİZ MODELLERİ
# ==============================================================================

class SMSAnalysisRequest(BaseModel):
    """Payload for SMS/Message scam analysis."""
    sender: Optional[str] = Field(None, description="Mesaj başlığı / gönderen bilgisi (örn: B001, HGS, PTT)", max_length=100)
    message: str = Field(..., description="Analiz edilecek SMS veya mesaj metni", min_length=3, max_length=4000)

class SMSAnalysisResponse(BaseModel):
    """Scam & Phishing evaluation for SMS."""
    status: RiskStatus
    risk_score: int = Field(..., ge=0, le=100)
    summary: str
    reasons: List[str]
    detected_topics: List[TopicItem]
    manipulation: ManipulationIndicators
    content_safety: ContentSafetyReport
    extracted_urls: List[str]
    url_analysis: Optional[URLAnalysisResponse] = None
    ai_score_explanation: str

# ==============================================================================
# 3. BAŞLIK VE METİN İÇERİK ANALİZ MODELLERİ
# ==============================================================================

class TextAnalysisRequest(BaseModel):
    """Payload for generic Title and Body text analysis."""
    title: Optional[str] = Field(None, description="E-posta, ilan veya duyuru başlığı", max_length=300)
    content: str = Field(..., description="İncelenecek gövde metni", min_length=5, max_length=15000)

class TextAnalysisResponse(BaseModel):
    """Detailed content, fraud pattern, and safety assessment."""
    status: RiskStatus
    risk_score: int = Field(..., ge=0, le=100)
    summary: str
    reasons: List[str]
    detected_topics: List[TopicItem]
    manipulation: ManipulationIndicators
    content_safety: ContentSafetyReport
    extracted_urls: List[str]
    ai_score_explanation: str

# ==============================================================================
# SİSTEM SAĞLIK MODELİ
# ==============================================================================

class HealthResponse(BaseModel):
    """System health check model."""
    status: str
    version: str
    model_loaded: bool
    model_name: Optional[str] = None
    modes_supported: List[str] = Field(
        default_factory=lambda: ["url_analysis", "sms_analysis", "text_analysis"]
    )
