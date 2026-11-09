"""
Package facade and unified factory for Oltasez Modular Detection Engine.
"""

from app.detection.url_engine import URLDetectionEngine
from app.detection.scam_text_engine import ScamTextEngine
from app.detection.content_safety_engine import ContentSafetyEngine
from app.detection.schemas import (
    V1AnalysisResult,
    V1URLRequest,
    V1MessageRequest,
    V1TitleRequest
)
from app.detection.ml_interface import BaseMLEngine

# Singleton engine instances
url_detection_engine = URLDetectionEngine()
scam_text_engine = ScamTextEngine()
content_safety_engine = ContentSafetyEngine()

__all__ = [
    "URLDetectionEngine",
    "ScamTextEngine",
    "ContentSafetyEngine",
    "V1AnalysisResult",
    "V1URLRequest",
    "V1MessageRequest",
    "V1TitleRequest",
    "BaseMLEngine",
    "url_detection_engine",
    "scam_text_engine",
    "content_safety_engine"
]
