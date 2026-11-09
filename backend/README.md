# Oltasez Backend API

Oltasez projesinin FastAPI tabanlı makine öğrenimi ve URL analiz servisi.

## 📁 Dizin Yapısı

```text
backend/
├── app/
│   ├── api/
│   │   └── endpoints.py       # POST /analyze yönlendiricisi
│   ├── core/
│   │   ├── config.py          # CORS ve uygulama ayarları
│   │   └── url_utils.py       # URL doğrulama ve temel öznitelik çıkarıcı
│   ├── schemas/
│   │   └── analysis.py        # Pydantic v2 istek/yanıt sözleşmeleri
│   ├── services/
│   │   └── analyzer.py        # Sezgisel & ML analiz motoru
│   └── main.py                # FastAPI uygulaması & hata yakalayıcılar
├── models/                    # Gelecekteki eğitilmiş .joblib modelleri
├── requirements.txt           # Python kütüphaneleri
└── README.md
```

## 🚀 Yerel Kurulum ve Çalıştırma

### 1. Sanal Ortam Oluşturma

```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# veya Windows CMD:
.\venv\Scripts\activate.bat
# Linux / macOS:
# source venv/bin/activate
```

### 2. Bağımlılıkları Yükleme

```bash
pip install -r requirements.txt
```

### 3. Sunucuyu Başlatma

```bash
uvicorn app.main:app --reload --port 8000
```

Sunucu ayağa kalktığında:
- API Kök Dizini: `http://127.0.0.1:8000/`
- Sağlık Kontrolü: `http://127.0.0.1:8000/health`
- İnteraktif Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## 📡 API Uç Noktaları

### 1. `GET /health`
Sistem sağlık ve model durumunu döner.
```json
{
  "status": "ok",
  "version": "0.1.0",
  "model_loaded": false
}
```

### 2. `POST /analyze`
URL analiz isteği alır ve risk değerlendirmesi üretir.

**İstek Gövdesi (Request Body):**
```json
{
  "url": "https://secure-login-verify.xyz/account"
}
```

**Başarılı Yanıt (Response 200 OK):**
```json
{
  "url": "https://secure-login-verify.xyz/account",
  "status": "phishing",
  "risk_score": 75,
  "reasons": [
    "Oltalama saldırılarında sıkça istismar edilen uzantı (.xyz) tespit edildi.",
    "Yanıltıcı anahtar kelimeler bulundu: login, account, verify."
  ],
  "features": {
    "url_length": 39,
    "subdomain_count": 0,
    "has_ip": false,
    "digit_ratio": 0.0
  }
}
```

**Doğrulama Hatası (Response 422 Unprocessable Entity):**
```json
{
  "detail": "Geçerli bir ana makine / alan adı (hostname) bulunamadı.",
  "errors": [...]
}
```
