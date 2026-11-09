import os
import joblib
import numpy as np
from typing import Optional, Tuple, Dict, Any
from app.core.model_features import features_to_vector

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "phishing_model.joblib")

class ModelManager:
    """
    Singleton manager for loading, caching, and running ML inference.
    Guarantees stability even if the model artifact is missing or corrupt.
    """
    _instance: Optional["ModelManager"] = None
    _artifact: Optional[Dict[str, Any]] = None
    _is_loaded: bool = False
    _model_name: Optional[str] = None

    @classmethod
    def get_instance(cls) -> "ModelManager":
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def load_model(self) -> bool:
        """
        Loads the joblib artifact from disk.
        Called on application startup.
        """
        if not os.path.exists(MODEL_PATH):
            print(f"[!] Info: Model file '{MODEL_PATH}' not found. Backend will use fallback heuristic inference.")
            self._is_loaded = False
            self._artifact = None
            self._model_name = None
            return False

        try:
            self._artifact = joblib.load(MODEL_PATH)
            self._model_name = self._artifact.get("model_name", "Scikit-Learn Classifier")
            self._is_loaded = True
            print(f"[+] Successfully loaded ML model: {self._model_name} from {MODEL_PATH}")
            return True
        except Exception as exc:
            print(f"[!] Warning: Failed to load model file: {exc}. Using fallback heuristic engine.")
            self._is_loaded = False
            self._artifact = None
            self._model_name = None
            return False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    @property
    def model_name(self) -> Optional[str]:
        return self._model_name

    def predict(self, features_dict: dict) -> Tuple[Optional[float], Optional[str]]:
        """
        Runs ML prediction on extracted features.
        Returns (phishing_probability: 0.0-1.0, model_name).
        If model is unavailable or prediction fails, returns (None, None).
        """
        if not self._is_loaded or not self._artifact or "pipeline" not in self._artifact:
            return None, None

        pipeline = self._artifact["pipeline"]
        vector = features_to_vector(features_dict)
        X = np.array([vector])

        try:
            # 1. Primary: Use predict_proba for smooth risk score
            if hasattr(pipeline, "predict_proba"):
                probs = pipeline.predict_proba(X)
                # Class 1 is phishing
                phishing_prob = float(probs[0][1])
                return round(phishing_prob, 4), self._model_name

            # 2. Secondary: If decision_function exists (e.g. SVM), apply sigmoid
            if hasattr(pipeline, "decision_function"):
                df_val = float(pipeline.decision_function(X)[0])
                # Sigmoid transform: 1 / (1 + e^-x)
                sigmoid_prob = 1.0 / (1.0 + np.exp(-df_val))
                return round(float(sigmoid_prob), 4), self._model_name

            # 3. Fallback: Hard binary prediction
            pred = int(pipeline.predict(X)[0])
            prob = 0.85 if pred == 1 else 0.15
            return prob, self._model_name

        except Exception as exc:
            print(f"[!] ML prediction error: {exc}")
            return None, None

model_manager = ModelManager.get_instance()
