# Oltasez 🎣🛡️

> **Türkçe Odaklı Siber Tehdit, Dolandırıcılık ve Oltalama Analiz Platformu**

Oltasez; kullanıcıların karşılaştığı şüpheli bağlantıları (URL), SMS tuzaklarını (HGS, kargo, sahte fatura) ve e-posta içeriklerini sayfa kazıma (scraping) ve gizlilik ihlali yapmadan, doğrudan leksikal öznitelikler, aciliyet belirteçleri ve Türkçe siber güvenlik modelleriyle çözümleyen açık kaynaklı bir platformdur.

---

## 🌟 3 Farklı Analiz Modu

1. **URL Analizi:**
   - 14 matematiksel öznitelik (Shannon entropisi, punycode/homograf tespiti, IP kullanımı, alt alan adı derinliği vb.).
   - Ağ isteği yapmadan, web sitelerine bağlanmadan tamamen leksikal değerlendirme.
2. **SMS ve Dolandırıcılık Mesajı Analizi:**
   - HGS / geçiş ücreti sahtekarlığı, PTT / kargo teslimat tuzağı, elektrik / doğalgaz faturası taklitleri.
   - Aciliyet, haciz, dava tehdidi ve finansal talep baskısı analizi.
   - Mesaj içindeki URL'lerin otomatik ayıklanıp yapısal puanlanması.
3. **Başlık ve Metin Analizi:**
   - E-posta başlığı ve metin gövdesi üzerinde sosyal mühendislik tespiti.
   - Banka, e-Devlet ve kurum taklidi göstergeleri.

### ⚠️ Kritik Ayrım Prensipleri
- **Konu ≠ Dolandırıcılık Kanıtı:** Bir metinde "HGS" veya "Fatura" kelimesi geçmesi tek başına oltalama kanıtı değildir.
- **İçerik Güvenliği ≠ Oltalama:** Küfür, hakaret ve argo dil `content_safety` katmanında değerlendirilir; phishing risk skorunu yapay olarak yükseltmez.
- **Saydam AI Değerlendirmesi:** Gerçek ML modeli yüklenmediğinde hiçbir zaman uydurma yapay zeka güven puanı üretilmez; kural ve sezgisel motor sonuçları şeffafça paylaşılır.

---

## 🏗️ Teknoloji Yığını

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons (Vercel Dağıtımı Uyumlu)
- **Backend:** FastAPI, Python 3.10+, Pydantic v2, scikit-learn
- **Test:** Pytest birim test altyapısı (URL, SMS, Metin, API sözleşmeleri)
- **Dağıtım:** Vercel (Frontend) + Render / Railway / Docker (Backend)

---

## 📁 Proje Dizin Yapısı

```text
oltasez/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py        # /health, /analyze, /analyze/url, /analyze/sms, /analyze/text
│   │   ├── core/
│   │   │   ├── text_utils.py       # Türkçe konu kalıpları, aciliyet & içerik güvenliği regexleri
│   │   │   ├── url_utils.py        # URL doğrulama, normalizasyon & entropi
│   │   │   ├── feature_extractor.py# 14 matematiksel öznitelik çıkarıcı
│   │   │   ├── explainer.py        # Şeffaf Türkçe gerekçe motoru
│   │   │   ├── config.py           # Dinamik CORS ve ortam ayarları
│   │   │   └── model_loader.py     # Singleton model yöneticisi
│   │   ├── schemas/
│   │   │   └── analysis.py         # Pydantic v2 veri sözleşmeleri
│   │   ├── services/
│   │   │   └── analyzer.py         # URL, SMS ve Metin çok modlu analiz servisleri
│   │   └── main.py                 # FastAPI uygulaması & lifespan
│   ├── tests/                      # test_api.py, test_sms_analysis.py, test_text_analysis.py ...
│   ├── requirements.txt            # Python bağımlılıkları
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router (Çok modlu modern dashboard)
│   │   ├── components/             # ResultPanel, MessageResultPanel, ModeSelector ...
│   │   ├── services/               # analyzeUrl, analyzeSms, analyzeText API istemcileri
│   │   └── types/                  # TypeScript analiz tipleri ve sözleşmeleri
│   ├── package.json
│   ├── postcss.config.js           # Tailwind CSS & Autoprefixer uyumlu
│   └── .env.example
│
├── .env.example                    # Kök ortam değişkenleri referansı
├── docker-compose.yml
└── README.md
```

---

## 💻 Yerel Geliştirme (Local Development)

### 1. Backend (FastAPI) Başlatma
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Swagger UI Dokümantasyonu: `http://localhost:8000/docs`
- Sağlık Kontrolü: `http://localhost:8000/health`

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Arayüz: `http://localhost:3000`

---

## 🧪 Testleri Çalıştırma

Backend birim ve sözleşme testleri için:
```bash
cd backend
pytest
```
- `test_url_validation.py`: URL geçerlilik testleri
- `test_feature_extractor.py`: 14 öznitelik çıkarımı
- `test_sms_analysis.py`: HGS taklidi, aciliyet, küfür ve dolandırıcılık ayrımı
- `test_text_analysis.py`: Banka ve fatura e-posta analizleri
- `test_api.py`: `/health`, `/analyze/url`, `/analyze/sms`, `/analyze/text` JSON şemaları

---

## ☁️ Canlıya Dağıtım (Deployment)

### A. Frontend (Vercel)
1. Vercel paneline gidin ve GitHub deponuzu bağlayın.
2. **Root Directory** olarak `frontend` seçin.
3. **Framework Preset:** `Next.js`
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Backend API adresiniz (örn: `https://oltasez-api.onrender.com`)
5. Deploy butonuna basın.

### B. Backend (Render / Railway)
1. Yeni bir **Web Service** oluşturun ve GitHub deponuzu bağlayın.
2. **Root Directory:** `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   - `CORS_ORIGINS`: `https://sizin-app.vercel.app`
