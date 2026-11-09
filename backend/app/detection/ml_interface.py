"""
Interface and Base Contract for Future ML Integrations.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseMLEngine(ABC):
    """
    Standard interface for machine learning models (scikit-learn, ONNX, PyTorch, etc.)
    Allows plug-and-play swapping without altering business rules.
    """

    @abstractmethod
    def load(self, model_path: str) -> bool:
        """Loads model weights or serialized bundle into memory."""
        pass

    @abstractmethod
    def predict_risk(self, features: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Returns structured prediction:
        {
            "risk_score": int (0-100),
            "confidence": float (0.0-1.0),
            "top_features": list
        }
        or None if model is unavailable or features cannot be evaluated.
        """
        pass

    @property
    @abstractmethod
    def is_ready(self) -> bool:
        """Whether model is actively loaded and calibrated."""
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        """Version tag of the loaded model."""
        pass
