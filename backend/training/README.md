# Oltasez ML Model Eğitim ve Değerlendirme Hattı

Bu dizin, Oltasez projesinin makine öğrenimi modeli eğitim ve değerlendirme kodlarını içerir.

## 📁 Dosyalar

- `train.py`: Eğitim veri setini yükler, 14 URL özniteliğini çıkarır, **Logistic Regression** ve **Random Forest** modellerini eğitip karşılaştırır; en yüksek F1 skoruna sahip modeli `models/phishing_model.joblib` olarak kaydeder.
- `generate_sample_data.py`: Gerçekçi meşru ve oltalama URL'lerinden oluşan örnek bir başlangıç veri seti (`dataset.csv`) üretir.
- `reports/`: Eğitim sonuç metrik raporlarını (Precision, Recall, F1, Karmaşıklık Matrisi) `.json` ve `.txt` formatında saklar.

## 🚀 Model Eğitimi Nasıl Çalıştırılır?

Backend sanal ortamınız aktifken:

```bash
cd backend/training

# 1. Varsayılan veri setiyle eğitimi başlatma:
python train.py

# 2. Özel bir CSV veri setiyle çalıştırma:
python train.py --data /yol/veri_seti.csv
```

### Veri Seti CSV Formatı:
CSV dosyası en az iki sütun içermelidir:
```csv
url,label
https://turkiye.gov.tr,0
http://apple-id-verify.xyz/login,1
```
*(0: Güvenli / Meşru, 1: Oltalama / Phishing)*

## 🎯 Üretilen Çıktılar:
- `backend/models/phishing_model.joblib`: Eğitilen model boru hattı (`StandardScaler` + En iyi sınıflandırıcı) ve öznitelik haritası.
- `backend/training/reports/metrics_report.json`: JSON metrik raporu.
- `backend/training/reports/metrics_report.txt`: Okunabilir metin raporu.
- Backend FastAPI servisi açıldığında modeli otomatik olarak algılar ve `GET /health` üzerinde `model_loaded: true` döner.
