"""
FastAPI Endpoints for Detection Engine v1 API:
POST /api/v1/analyze/url
POST /api/v1/analyze/message
POST /api/v1/analyze/title
"""

from fastapi import APIRouter, status, HTTPException
from app.detection import (
    url_detection_engine,
    scam_text_engine,
    content_safety_engine,
    V1AnalysisResult,
    V1URLRequest,
    V1MessageRequest,
    V1TitleRequest
)

v1_router = APIRouter(prefix="/api/v1", tags=["Detection Engine v1"])

@v1_router.post(
    "/analyze/url",
    response_model=V1AnalysisResult,
    status_code=status.HTTP_200_OK,
    summary="Modular URL Detection Engine",
    description="Analyzes URLs lexically, structurally and against official institution roots without outbound network requests."
)
def analyze_url_v1(payload: V1URLRequest) -> V1AnalysisResult:
    try:
        return url_detection_engine.analyze(payload.url)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"URL analizi sırasında hata oluştu: {str(exc)}"
        )

@v1_router.post(
    "/analyze/message",
    response_model=V1AnalysisResult,
    status_code=status.HTTP_200_OK,
    summary="Modular Scam Message Engine (SMS / Chat)",
    description="Evaluates fraud tactics, psychological urgency, embedded links, and content safety with separated topic mapping."
)
def analyze_message_v1(payload: V1MessageRequest) -> V1AnalysisResult:
    try:
        return scam_text_engine.analyze(message=payload.message, sender=payload.sender)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Mesaj analizi sırasında hata oluştu: {str(exc)}"
        )

@v1_router.post(
    "/analyze/title",
    response_model=V1AnalysisResult,
    status_code=status.HTTP_200_OK,
    summary="Title and Headline Content Safety & Phishing Engine",
    description="Evaluates email titles, news headlines, and body text for aggressive tone, clickbait, and impersonation."
)
def analyze_title_v1(payload: V1TitleRequest) -> V1AnalysisResult:
    try:
        # Scam engine handles title + body; content safety flags are merged
        return scam_text_engine.analyze(message=payload.body or "", title=payload.title)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Başlık analizi sırasında hata oluştu: {str(exc)}"
        )
