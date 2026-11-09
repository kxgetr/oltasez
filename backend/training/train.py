"""
Machine Learning Training Pipeline for Oltasez Phishing URL Detection.

Usage:
    python train.py [--data path/to/dataset.csv]
"""

import os
import sys
import argparse
import json
from datetime import datetime
import pandas as pd
import numpy as np

# Add parent directory to path to import app modules
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.core.feature_extractor import extract_features
from app.core.model_features import FEATURE_NAMES, features_to_vector
from training.generate_sample_data import generate_sample_dataset

# Scikit-Learn dependencies
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    accuracy_score,
    confusion_matrix,
    classification_report
)
import joblib

MODELS_OUTPUT_DIR = os.path.join(BACKEND_DIR, "models")
REPORTS_OUTPUT_DIR = os.path.join(CURRENT_DIR, "reports")

def load_or_create_dataset(csv_path: str) -> pd.DataFrame:
    """Loads CSV dataset; generates a default sample dataset if not found."""
    if not os.path.exists(csv_path):
        print(f"[!] Dataset '{csv_path}' not found. Generating default sample dataset...")
        generate_sample_dataset(csv_path)

    df = pd.read_csv(csv_path)
    if "url" not in df.columns or "label" not in df.columns:
        raise ValueError("Dataset CSV must contain 'url' and 'label' columns.")

    # Drop any nulls
    df = df.dropna(subset=["url", "label"])
    df["label"] = df["label"].astype(int)
    print(f"[*] Loaded dataset with {len(df)} records. Class distribution:\n{df['label'].value_counts().to_dict()}")
    return df

def extract_dataset_features(df: pd.DataFrame) -> Tuple_X_y:
    """Extracts URL-based features for every record in the dataset."""
    print("[*] Extracting 14 URL-based features for all records...")
    X_rows = []
    y_labels = []

    for _, row in df.iterrows():
        try:
            feats = extract_features(str(row["url"]))
            vector = features_to_vector(feats)
            X_rows.append(vector)
            y_labels.append(row["label"])
        except Exception as e:
            print(f"[!] Warning: Failed to extract features for URL: {row['url']} ({e})")
            continue

    return np.array(X_rows), np.array(y_labels)

def train_and_evaluate(X, y):
    """
    Trains Logistic Regression and Random Forest models with standard preprocessing,
    evaluates performance, and returns the best model.
    """
    # Stratified Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    models = {
        "LogisticRegression": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42))
        ]),
        "RandomForest": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42, class_weight="balanced"))
        ]),
    }

    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_pipeline = None

    print("\n" + "="*50)
    print(" MODEL EVALUATION RESULTS ")
    print("="*50)

    for name, pipeline in models.items():
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred).tolist()

        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "classification_report": classification_report(y_test, y_pred, output_dict=True, zero_division=0)
        }

        print(f"\n--- {name} ---")
        print(f"Accuracy : {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall   : {rec:.4f}")
        print(f"F1-Score : {f1:.4f}")
        print(f"Confusion Matrix:\n {np.array(cm)}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_pipeline = pipeline

    print("\n" + "="*50)
    print(f"[*] BEST MODEL SELECTED: {best_model_name} (F1 Score: {best_f1:.4f})")
    print("="*50)

    return best_model_name, best_pipeline, results

def save_artifacts(best_name: str, best_pipeline, results: dict):
    """Saves the trained model pipeline (.joblib) and metric report (.json and .txt)."""
    os.makedirs(MODELS_OUTPUT_DIR, exist_ok=True)
    os.makedirs(REPORTS_OUTPUT_DIR, exist_ok=True)

    # 1. Save model artifact
    model_path = os.path.join(MODELS_OUTPUT_DIR, "phishing_model.joblib")
    artifact_payload = {
        "model_name": best_name,
        "pipeline": best_pipeline,
        "feature_names": FEATURE_NAMES,
        "trained_at": datetime.now().isoformat(),
        "metrics": results[best_name]
    }
    joblib.dump(artifact_payload, model_path)
    print(f"[+] Model artifact successfully saved to: {model_path}")

    # 2. Save JSON metric report
    report_json_path = os.path.join(REPORTS_OUTPUT_DIR, "metrics_report.json")
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "best_model": best_name,
            "results": results,
            "features_used": FEATURE_NAMES
        }, f, indent=2, ensure_ascii=False)

    # 3. Save readable TXT summary report
    report_txt_path = os.path.join(REPORTS_OUTPUT_DIR, "metrics_report.txt")
    with open(report_txt_path, "w", encoding="utf-8") as f:
        f.write("=== Oltasez ML Model Evaluation Report ===\n")
        f.write(f"Trained at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Best Model Selected: {best_name}\n\n")
        for m_name, m_data in results.items():
            f.write(f"[{m_name}]\n")
            f.write(f"  Accuracy : {m_data['accuracy']:.4f}\n")
            f.write(f"  Precision: {m_data['precision']:.4f}\n")
            f.write(f"  Recall   : {m_data['recall']:.4f}\n")
            f.write(f"  F1 Score : {m_data['f1_score']:.4f}\n")
            f.write(f"  Confusion Matrix: {m_data['confusion_matrix']}\n\n")

    print(f"[+] Evaluation reports saved to:\n    - {report_json_path}\n    - {report_txt_path}")

def main():
    parser = argparse.ArgumentParser(description="Oltasez URL Phishing ML Training Pipeline")
    parser.add_argument("--data", type=str, default=os.path.join(CURRENT_DIR, "dataset.csv"), help="Path to training CSV dataset")
    args = parser.parse_args()

    df = load_or_create_dataset(args.data)
    X, y = extract_dataset_features(df)
    best_name, best_pipeline, results = train_and_evaluate(X, y)
    save_artifacts(best_name, best_pipeline, results)

if __name__ == "__main__":
    main()
