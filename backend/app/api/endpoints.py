from fastapi import APIRouter, HTTPException, status
from app.schemas.analysis import (
    URLAnalysisRequest,
    URLAnalysisResponse,
    SMSAnalysisRequest,
    SMSAnalysisResponse,
    TextAnalysisRequest,
    TextAnalysisResponse
)
from app.services.analyzer import (
    analyze_url_service,
    analyze_sms_service,
    analyze_text_service
)

router = APIRouter(tags=["Analysis"])

# ==============================================================================
# 1. URL ANALİZİ (Geriye dönük uyumluluk için hem /analyze hem /analyze/url)
# ==============================================================================

@router.post(
    "/analyze",
    response_model=URLAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="URL Güvenlik ve Phishing Analizi",
    description="Girilen URL'den gerçek 14 öznitelik çıkarır, konu tespit eder ve ağ isteği yapmadan risk skoru üretir."
)
@router.post(
    "/analyze/url",
    response_model=URLAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="URL Güvenlik ve Phishing Analizi (Açık İsimli)",
    description="URL analizi için açık uç noktadır."
)
def analyze_url_endpoint(payload: URLAnalysisRequest) -> URLAnalysisResponse:
    try:
        return analyze_url_service(payload.url)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"URL analizi sırasında bir hata oluştu: {str(exc)}"
        )

# ==============================================================================
# 2. SMS VE DOLANDIRICILIK MESAJI ANALİZİ
# ==============================================================================

@router.post(
    "/analyze/sms",
    response_model=SMSAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="SMS ve Kısa Mesaj Dolandırıcılık Analizi",
    description="SMS içeriğindeki bağlantıları, konu taklitlerini, aciliyet manipülasyonunu ve saldırgan dili inceler."
)
def analyze_sms_endpoint(payload: SMSAnalysisRequest) -> SMSAnalysisResponse:
    try:
        return analyze_sms_service(message=payload.message, sender=payload.sender)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SMS analizi sırasında bir hata oluştu: {str(exc)}"
        )

# ==============================================================================
# 3. BAŞLIK VE METİN İÇERİK ANALİZİ
# ==============================================================================

@router.post(
    "/analyze/text",
    response_model=TextAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Başlık ve Metin Dolandırıcılık & İçerik Analizi",
    description="E-posta veya duyuru metinlerini konu, sahte ödeme, tehdit dili ve küfür/hakaret açılarından inceler."
)
def analyze_text_endpoint(payload: TextAnalysisRequest) -> TextAnalysisResponse:
    try:
        return analyze_text_service(content=payload.content, title=payload.title)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Metin analizi sırasında bir hata oluştu: {str(exc)}"
        )
