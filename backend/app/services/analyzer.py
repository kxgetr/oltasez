from typing import List, Literal, Tuple
from app.core.feature_extractor import extract_features
from app.core.model_loader import model_manager
from app.core.explainer import generate_explanations, PHISHING_KEYWORDS, RISKY_TLDS
from app.schemas.analysis import FeatureSummary, URLAnalysisResponse

def map_score_to_status(score: int) -> Literal["Güvenli", "Şüpheli", "Oltalama Riski"]:
    """
    Maps risk score to user-facing Turkish status:
    - 0–34: Güvenli
    - 35–64: Şüpheli
    - 65–100: Oltalama Riski
    """
    if score <= 34:
        return "Güvenli"
    elif score <= 64:
        return "Şüpheli"
    else:
        return "Oltalama Riski"

def compute_structural_penalty(feats: dict, hostname: str, url_lower: str) -> int:
    """
    Computes a deterministic heuristic penalty based on high-risk structural features.
    """
    penalty = 0

    if feats["has_ip_address"]:
        penalty += 45
    if not feats["uses_https"]:
        penalty += 20
    if feats["has_punycode"]:
        penalty += 35

    matched_tld = next((tld for tld in RISKY_TLDS if hostname.endswith(tld)), None)
    if matched_tld:
        penalty += 25

    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in url_lower]
    if found_keywords:
        penalty += min(len(found_keywords) * 12, 30)

    if feats["subdomain_count"] >= 3:
        penalty += 25
    elif feats["subdomain_count"] == 2:
        penalty += 10

    if feats["entropy"] > 4.6:
        penalty += 18

    if feats["url_length"] > 95:
        penalty += 15

    if feats["digit_ratio"] > 0.18:
        penalty += 15

    if hostname.count("-") >= 2:
        penalty += 15

    return penalty

def analyze_url_pipeline(normalized_url: str) -> URLAnalysisResponse:
    """
    Full URL analysis pipeline:
    1. Extract 14 URL-based features
    2. Run ML inference (if available)
    3. Compute combined risk score (0-100)
    4. Map to status: Güvenli (0-34), Şüpheli (35-64), Oltalama Riski (65-100)
    5. Generate clear, educational, transparent Turkish explanations
    6. Return structured response
    """
    # 1. Feature extraction
    feats = extract_features(normalized_url)
    hostname = feats.get("_hostname", "").lower()
    url_lower = normalized_url.lower()

    # 2. Structural penalty calculation
    structural_penalty = compute_structural_penalty(feats, hostname, url_lower)

    # 3. ML Model prediction
    ml_prob, model_name = model_manager.predict(feats)

    if ml_prob is not None:
        # Scale ML probability (0.0 - 1.0) to 0-100
        ml_score = int(ml_prob * 100)
        # Weighted combination: 70% ML prediction + 30% deterministic structural penalties
        combined_score = int(ml_score * 0.70 + structural_penalty * 0.30)
        risk_score = min(max(combined_score, 0), 100)
    else:
        # Graceful fallback when model file is not present
        fallback_score = min(max(10 + structural_penalty, 0), 100)
        risk_score = fallback_score

    # 4. Map to status
    status = map_score_to_status(risk_score)

    # 5. Generate transparent, human-readable explanations via explainer module
    reasons = generate_explanations(
        features=feats,
        url=normalized_url,
        status=status,
        risk_score=risk_score,
        ml_probability=ml_prob,
        model_name=model_name
    )

    # Remove internal metadata key before serializing into schema
    feats.pop("_hostname", None)
    feature_summary = FeatureSummary(**feats)

    return URLAnalysisResponse(
        url=normalized_url,
        status=status,
        risk_score=risk_score,
        reasons=reasons,
        features=feature_summary
    )
