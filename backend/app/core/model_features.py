"""Feature definitions and names for training & inference consistency."""

FEATURE_NAMES = [
    "url_length",
    "domain_length",
    "path_length",
    "subdomain_count",
    "dot_count",
    "digit_count",
    "digit_ratio",
    "hyphen_count",
    "special_char_count",
    "has_ip_address",
    "uses_https",
    "query_param_count",
    "entropy",
    "has_punycode",
]

def features_to_vector(features_dict: dict) -> list:
    """Converts a feature extraction dictionary into an ordered feature list for model input."""
    return [
        float(features_dict["url_length"]),
        float(features_dict["domain_length"]),
        float(features_dict["path_length"]),
        float(features_dict["subdomain_count"]),
        float(features_dict["dot_count"]),
        float(features_dict["digit_count"]),
        float(features_dict["digit_ratio"]),
        float(features_dict["hyphen_count"]),
        float(features_dict["special_char_count"]),
        1.0 if features_dict["has_ip_address"] else 0.0,
        1.0 if features_dict["uses_https"] else 0.0,
        float(features_dict["query_param_count"]),
        float(features_dict["entropy"]),
        1.0 if features_dict["has_punycode"] else 0.0,
    ]
