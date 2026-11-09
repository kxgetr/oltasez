from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional
from app.core.url_utils import validate_url, normalize_url

class URLAnalysisRequest(BaseModel):
    """Payload sent by client to analyze a URL."""
    url: str = Field(
        ...,
        description="Analiz edilecek web sitesi adresi (URL)",
        examples=["https://secure-login-verify.xyz/account?token=123"],
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

class URLAnalysisResponse(BaseModel):
    """Structured analysis response returned by the backend."""
    url: str = Field(..., description="Analiz edilen normalize URL")
    status: Literal["Güvenli", "Şüpheli", "Oltalama Riski"] = Field(
        ...,
        description="Güvenlik derecelendirmesi: Güvenli (0-34) | Şüpheli (35-64) | Oltalama Riski (65-100)"
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="0 (en güvenli) ile 100 (en tehlikeli) arası hesaplanan risk skoru"
    )
    reasons: List[str] = Field(
        default_factory=list,
        description="Belirlenen güvenlik durumunun gerekçeleri ve açıklamaları"
    )
    features: FeatureSummary = Field(
        ...,
        description="Çıkarılan gerçek matematiksel ve yapısal URL öznitelikleri"
    )

class HealthResponse(BaseModel):
    """System health response model."""
    status: str
    version: str
    model_loaded: bool
    model_name: Optional[str] = None
