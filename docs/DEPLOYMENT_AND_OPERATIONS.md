# Oltasez Production Dağıtım ve Operasyon Rehberi

> **Sürüm:** v1.0.0-prod  
> **Mimari:** Next.js (Frontend) + FastAPI (Backend) + İzole Heuristic/ML Servisi

---

## 1. Mimari Genel Bakış

```text
               +----------------------------------+
               |  İstemci / Tarayıcı (Kullanıcı)  |
               +-----------------+----------------+
                                 |
                          (HTTPS / 443)
                                 v
          +--------------------------------------------+
          | Vercel Edge / Reverse Proxy (SSL Sonlandırma) |
          +----------------------+---------------------+
                                 |
        +------------------------+------------------------+
        | (Statik & SSR)                                  | (API İstekleri)
        v                                                 v
+-------------------------------+             +----------------------------------+
|      Next.js Frontend         |             |       FastAPI Backend            |
| (Standalone Docker / Port 3000|             |   (Uvicorn Worker / Port 8000)   |
+-------------------------------+             +-----------------+----------------+
                                                                |
                                             +------------------+------------------+
                                             |                                     |
                                             v                                     v
                                 +-----------------------+             +-----------------------+
                                 |  URL Detection Engine |             |   Scam Text Engine    |
                                 |  (Zero-Network / 14 Feat)           |  (Konu / Risk Ayrık)  |
                                 +-----------------------+             +-----------------------+
```

---

## 2. Ortam Değişkenleri ve Secret Yönetimi

| Servis | Değişken Adı | Açıklama | Örnek Değer |
| :--- | :--- | :--- | :--- |
| **Backend** | `ENVIRONMENT` | Çalışma modu (`development` / `production`) | `production` |
| **Backend** | `PORT` | Uvicorn çalışma portu | `8000` |
| **Backend** | `CORS_ORIGINS` | İzin verilen frontend kök adresleri | `https://oltasez.vercel.app` |
| **Frontend**| `NEXT_PUBLIC_API_URL` | Backend servisinin genel URL'i | `https://api.oltasez.com` |

> [!CAUTION]
> Production ortamında `CORS_ORIGINS` değerini asla `*` (tüm originler) olarak bırakmayınız; yalnızca yetkili frontend alan adınızı tanımlayınız.

---

## 3. Dağıtım Yöntemleri (Deployment)

### Yöntem A: Docker Compose ile Tek Tuşla Kurulum (Önerilen)
```bash
# Projeyi klonlayın
git clone https://github.com/kxgetr/oltasez.git
cd oltasez

# Ortam değişkenlerini düzenleyin
cp .env.example .env

# Container'ları başlatın
docker compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/health`
- Readiness: `http://localhost:8000/readiness`

### Yöntem B: Vercel (Frontend) + Render / Railway (Backend)
1. **Frontend:** Vercel paneline gidin, depoyu bağlayın. `Root Directory` olarak `frontend` seçin. `NEXT_PUBLIC_API_URL` ortam değişkenini backend adresiniz olarak girin.
2. **Backend:** Render/Railway üzerinde yeni Web Service oluşturun. `Root Directory` olarak `backend` seçin. Build komutu: `pip install -r requirements.txt`, Start komutu: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 4. Yedekleme ve Rollback Stratejisi

1. **Model ve Kod İmmutability:** Her release bir Git tag'i (`v1.0.0`) ile etiketlenir. Docker imajları versiyonlu olarak saklanır (`oltasez-backend:1.0.0`).
2. **Sıfır Kesinti Rollback (Zero-Downtime):**
   ```bash
   # Önceki kararlı sürüme dönme
   docker compose stop
   git checkout v0.9.0
   docker compose up -d --build
   ```
3. **Stateless Mimari:** URL ve mesaj analizleri sunucu belleğinde kalıcı tutulmadığından, servis çökmelerinde veri kaybı riski bulunmaz.

---

## 5. Canlıya Çıkış Kontrol Listesi (Pre-flight Checklist)

- [x] Tüm 45 sentetik ve negatif model testi başarılı mı? (`run_engine_verification.js`)
- [x] 13 üretim güvenlik, SSRF ve rate limit testi başarılı mı? (`run_security_tests.js`)
- [x] E2E ve kullanıcı akışı testleri hatasız çalışıyor mu? (`test_e2e_user_journey.js`)
- [x] Hassas parametreler (token, şifre, anahtar) loglardan maskeleniyor mu?
- [x] `HTTP 413` istek gövdesi (64 KB) sınırı devrede mi?
- [x] `HTTP 429` rate limiting devrede mi?
- [x] Güvenlik feragatnamesi ve "kesin garanti değildir" bildirimi arayüzde mevcut mu?
- [x] Kullanıcı girdilerinin üçüncü taraflara veya hedef web sitelerine izinsiz gönderilmediği teyit edildi mi?
