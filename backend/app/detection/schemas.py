"""
Modular Detection Engine Schemas & Result Contract (v1).
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class V1AnalysisResult(BaseModel):
    analysis_id: str = Field(description="Unique UUID for this analysis event")
    input_type: str = Field(description="Type of analysed payload: 'url', 'message', 'title'")
    detected_categories: List[str] = Field(default_factory=list, description="Categories / topics identified")
    risk_level: str = Field(description="Risk categorization: 'low', 'medium', 'high', 'unknown'")
    risk_score: Optional[int] = Field(default=None, description="Quantified risk integer (0-100) or null if unknown")
    confidence: Optional[float] = Field(default=None, description="Calibrated confidence score (0.0-1.0) or null")
    evidence: List[str] = Field(default_factory=list, description="Verifiable explainable findings")
    content_flags: List[str] = Field(default_factory=list, description="Safety and policy flags triggered")
    limitations: List[str] = Field(default_factory=list, description="Known analytical caveats and runtime limits")
    model_version: str = Field(default="v1.0.0-heuristic-rule-engine", description="Active engine or model revision")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Optional diagnostic details")

class V1URLRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="Target URL string")

class V1MessageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message text (SMS or chat)")
    sender: Optional[str] = Field(default=None, description="Sender header or phone number")

class V1TitleRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Email or headline title")
    body: Optional[str] = Field(default=None, description="Optional associated body text")
