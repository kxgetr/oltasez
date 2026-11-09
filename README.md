# Oltasez 🎣🛡️

> **Yapay Zekâ Destekli Modern Web Tabanlı Phishing / Oltalama URL Analiz Platformu**

Oltasez; kullanıcıların karşılaştığı şüpheli bağlantıları sayfa içeriğini taramaya (scraping) ve gizliliği ihlal etmeye gerek kalmadan, doğrudan leksikal/yapısal URL öznitelikleri ve makine öğrenimi modelleri ile saniyeler içinde analiz eden açık kaynaklı bir siber güvenlik projesidir.

---

## 🌟 Öne Çıkan Özellikler

- **%100 URL Tabanlı ve Gizlilik Dostu:** Web sitelerine bağlanıp kod çalıştırmaz; parola, oturum veya sayfa kazıma yapmaz.
- **14 Matematiksel Öznitelik Çıkarımı:** Entropi (Shannon randomness), alt alan adı derinliği, IP barındırma, homograf/punycode (`xn--`), rakam yoğunluğu vb.
- **Hibrit Değerlendirme Motoru:** scikit-learn ML sınıflandırıcısı + Şeffaf siber güvenlik kuralları.
- **Açıklanabilir Güvenlik Raporu:** Belirlenen risk durumunun gerekçelerini son kullanıcının anlayabileceği Türkçe maddeler halinde sunar.
- **Modern Siber Güvenlik Arayüzü:** Koyu tema, cam morfoloji (glassmorphism), siber gösterge paneli (gauge visual) ve responsive tasarım.

---

## 🏗️ Teknoloji Yığını

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI, Python 3.10+, scikit-learn, joblib, pydantic v2
- **Dağıtım / Deployment:** Vercel (Frontend) + Render / Railway / Docker (Backend)

---

## 📁 Proje Dizin Yapısı

```text
oltasez/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py        # POST /analyze yönlendiricisi
│   │   ├── core/
│   │   │   ├── config.py           # Dinamik CORS ve ortam ayarları
│   │   │   ├── url_utils.py        # URL doğrulama, regex & entropi hesaplama
│   │   │   ├── feature_extractor.py# 14 gerçek öznitelik çıkarıcı
│   │   │   ├── explainer.py        # Kullanıcı dostu Türkçe gerekçe üretici
│   │   │   ├── model_features.py   # Sabit model girdi vektör eşlemesi
│   │   │   └── model_loader.py     # Singleton ML model yöneticisi & predict
│   │   ├── schemas/
│   │   │   └── analysis.py         # Pydantic v2 doğrulama ve yanıt sözleşmeleri
│   │   ├── services/
│   │   │   └── analyzer.py         # Hibrit analiz boru hattı
│   │   └── main.py                 # FastAPI uygulaması, CORS & lifespan
│   ├── models/
│   │   └── phishing_model.joblib   # Eğitilmiş ML model dosyası
│   ├── tests/                      # Pytest birim ve entegrasyon testleri
│   ├── training/                   # Model eğitim betikleri ve raporlar
│   ├── Dockerfile                  # Üretime hazır hafif Docker imajı
│   ├── requirements.txt            # Python bağımlılıkları
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router sayfaları
│   │   ├── components/             # ResultPanel, SampleUrls, Empty/Loading/Error states
│   │   ├── services/               # FastAPI bağlantı istemcisi
│   │   └── types/                  # TypeScript tip sözleşmeleri
│   ├── package.json
│   └── .env.example                # NEXT_PUBLIC_API_URL şablonu
│
├── docker-compose.yml              # Tek komutla backend container başlatıcı
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
- Swagger API Dokümantasyonu: `http://localhost:8000/docs`
- Sağlık Kontrolü: `http://localhost:8000/health`

### 2. Frontend (Next.js) Başlatma
Yeni bir terminalde:
```bash
cd frontend
npm install
npm run dev
```
Tarayıcınızda açın: `http://localhost:3000`

---

## ☁️ Canlıya Dağıtım Rehberi (Deployment Guide)

Oltasez'i canlıya almak için en kolay ve popüler yöntem: **Frontend'i Vercel'e, Backend'i Render veya Railway'e** yüklemektir.

### Bölüm A: Backend Dağıtımı (Render / Railway / VPS)

#### Seçenek 1: Render.com (Ücretsiz & Çok Kolay)
1. [Render.com](https://render.com) üzerinde ücretsiz hesap açın ve **New + > Web Service** seçin.
2. GitHub reponuzu bağlayın.
3. Ayarları şu şekilde girin:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** bölümüne şunları ekleyin:
   - `ENVIRONMENT` = `production`
   - `CORS_ORIGINS` = `https://oltasez.vercel.app,*`
5. **Deploy Web Service** butonuna tıklayın. Render size bir URL verecektir (örn: `https://oltasez-api.onrender.com`).

#### Seçenek 2: Docker ile Dağıtım (Herhangi bir VPS veya Container Platformu)
Proje kök dizininde tek komutla container'ı başlatabilirsiniz:
```bash
docker compose up -d --build
```

---

### Bölüm B: Frontend Dağıtımı (Vercel)

1. [Vercel.com](https://vercel.com) üzerinde oturum açın ve **Add New... > Project** butonuna tıklayın.
2. Oltasez GitHub reponuzu seçin.
3. Proje ayarlarında:
   - **Root Directory:** `frontend` seçin.
4. **Environment Variables** (Ortam Değişkenleri) alanına backend adresinizi girin:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://oltasez-api.onrender.com` *(Bölüm A'da aldığınız canlı backend URL'si)*
5. **Deploy** butonuna tıklayın. Vercel uygulamanızı saniyeler içinde canlıya alacaktır!

---

## 🧪 Birim Testleri Çalıştırma

Backend testlerini çalıştırmak için:
```bash
cd backend
pytest -v
```
Tüm URL doğrulamaları, 14 öznitelik çıkarımı, açıklama mantığı ve API sözleşmeleri otomatik olarak test edilir.
