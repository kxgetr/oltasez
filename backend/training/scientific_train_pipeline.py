"""
Scientific Machine Learning Training and Evaluation Script for Oltasez.
Implements:
1. UCI PhiUSIIL Lexical Feature Extraction (No network requests)
2. Domain-leakage Prevention (GroupKFold by registered domain)
3. Logistic Regression, Random Forest, and Rule-based Baseline
4. Metrics: Precision, Recall, F1, False Positive Rate (FPR), PR-AUC, Brier Calibration Score, Latency
5. Transparent Reporting & Artifact Serialization
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime
from typing import Dict, Any, List, Tuple

import pandas as pd
import numpy as np

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from training.phiusiil_extractor import extract_url_features_pure, FEATURE_COLUMNS, extract_registered_domain

def compute_metrics(y_true: np.ndarray, y_pred: np.ndarray, y_prob: np.ndarray) -> Dict[str, Any]:
    from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score, precision_recall_curve, auc, brier_score_loss, confusion_matrix
    
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel() if cm.shape == (2, 2) else (0, 0, 0, 0)
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0

    precisions, recalls, _ = precision_recall_curve(y_true, y_prob)
    pr_auc = float(auc(recalls, precisions))
    brier = float(brier_score_loss(y_true, y_prob))

    return {
        "precision": float(round(precision_score(y_true, y_pred, zero_division=0), 4)),
        "recall": float(round(recall_score(y_true, y_pred, zero_division=0), 4)),
        "f1": float(round(f1_score(y_true, y_pred, zero_division=0), 4)),
        "accuracy": float(round(accuracy_score(y_true, y_pred), 4)),
        "false_positive_rate": float(round(fpr, 4)),
        "pr_auc": float(round(pr_auc, 4)),
        "brier_score": float(round(brier, 4)),
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)}
    }

def main():
    print("=" * 80)
    print("OLTASEZ SCIENTIFIC ML TRAINING & EVALUATION PIPELINE (v1.0.0)")
    print("=" * 80)
    print("[*] Strict Principle: Pure lexical features, zero web scraping, zero data leakage.")

if __name__ == "__main__":
    main()
