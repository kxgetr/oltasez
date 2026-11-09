# Oltasez Geliştirme ve Mimari Planı (v2.0)

## 1. Mimari Prensipler ve Ayrım
- **Dolandırıcılık Konusu (Category/Topic):** HGS/Geçiş, Fatura (Elektrik/Su/Doğalgaz), Kargo/Teslimat, Banka/Finans, e-Devlet/Resmi Kurum, Ödül/Hediye, Hesap Doğrulama.
  - *Kritik İlke:* Bir metinde veya URL'de "HGS" veya "Fatura" geçmesi tek başına dolandırıcılık kanıtı DEĞİLDİR. Bu yalnızca tespit edilen "konu"dur.
- **Dolandırıcılık Riski (Risk Level & Phishing Indicators):** Alan adı uyumsuzluğu, şüpheli TLD, ham IP, aciliyet ("hemen öde", "hakkınızda icra"), ceza tehdidi, sahte ödeme linki gibi faktörlerin birleşimi.
- **İçerik Güvenliği (Safety / Profanity & Toxicity):** Küfür, hakaret, aşağılama veya saldırgan dil içerip içermediği.
  - *Kritik İlke:* Küfür veya argo içermek tek başına phishing göstergesi DEĞİLDİR; ancak içerik güvenliği açısından etiketlenir.
- **Güven Skoru İlkesi:** Gerçek eğitilmiş ML modeli bağlanmadığı sürece uydurma (arbitrary) "AI güven skoru" üretilmez; kural ve öznitelik tabanlı somut puanlama ve tespitler şeffafça sunulur.

## 2. 3 Analiz Modu
1. **URL Analizi (`/api/v1/analyze/url`):** Yalnızca URL dizgesi üzerinden 14+ leksikal/yapısal öznitelik analizi (ağ isteği ve scraping yapılmaz).
2. **SMS ve Mesaj Analizi (`/api/v1/analyze/sms`):** Kısa mesaj içeriği, içindeki olası linkler, konu tespiti, aciliyet/baskı unsurları ve içerik güvenliği analizi.
3. **Başlık ve Metin Analizi (`/api/v1/analyze/text`):** E-posta başlığı, ilan, mesaj veya web metni analizi; konu, risk faktörleri, saldırgan dil ve manipülasyon incelemesi.

## 3. Planlanan Adımlar
1. Backend veri sözleşmelerini (`schemas/analysis.py`), analiz motorlarını (`services/`) ve uç noktalarını (`api/endpoints.py`) 3 modu ve ayrımı kapsayacak şekilde güncellemek.
2. `GET /health` uç noktasını ve sistem sağlık kontrolünü doğrulamak.
3. Frontend TypeScript tiplerini (`src/types/analysis.ts`) ve API istemcisini (`src/services/api.ts`) 3 moda göre genişletmek.
4. Frontend arayüzüne 3 modlu sekme yapısını (Tab switcher: URL Analizi, SMS/Mesaj Analizi, Başlık & Metin Analizi) entegre etmek.
5. Pytest backend testleri ve frontend birim test altyapısını kurup çalıştırmak.
6. `.env.example` ve `README.md` dokümanlarını eksiksiz güncellemek.
