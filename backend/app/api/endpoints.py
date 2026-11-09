from fastapi import APIRouter, HTTPException, status
from app.schemas.analysis import URLAnalysisRequest, URLAnalysisResponse
from app.services.analyzer import analyze_url_pipeline

router = APIRouter(tags=["Analysis"])

@router.post(
    "/analyze",
    response_model=URLAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="URL Güvenlik ve Phishing Analizi",
    description="Girilen URL'den gerçek 14 öznitelik çıkarır, ML modelinden geçirir ve 0-100 risk skoru ile durum raporu üretir."
)
def analyze_url(payload: URLAnalysisRequest) -> URLAnalysisResponse:
    """
    Analyzes the provided URL using real feature extraction and ML inference.
    """
    try:
        result = analyze_url_pipeline(payload.url)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"URL analizi sırasında beklenmeyen bir hata oluştu: {str(exc)}"
        )
