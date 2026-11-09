# Oltasez Production Güvenlik, Güvenilirlik ve SSRF Mimarisi Raporu

> **Durum:** Canlıya Dağıtım / Production Ready  
> **Test Doğrulaması:** 13/13 Güvenlik Testi Başarılı (`node backend/tests/run_security_tests.js`)

---

## 1. Uygulanan Production Güvenlik Önlemleri

### 1.1 IP Bazlı İstek Sınırlaması (Rate Limiting)
- Kayar pencereli (sliding-window) token algoritması ile istemci IP adresi başına **dakikada azami 60 istek** sınırı getirildi.
- Aşım durumunda `HTTP 429 Too Many Requests` ve `Retry-After: 60` başlığı döner.
- Sağlık kontrolü ve canlılık probe'ları (`/health`, `/readiness`) rate limit dışı tutulmuştur.

### 1.2 İstek Boyutu Sınırı (Request Body Size Guard)
- Bellek tüketimini ve DoS saldırılarını engellemek amacıyla maksimum istek gövdesi **64 KB (65.536 bayt)** ile sınırlandırıldı. Sınırı aşan istekler `HTTP 413 Payload Too Large` ile anında kesilir.

### 1.3 Yapılandırılmış Loglama & Request ID
- Her isteğe özgün `UUID` (`X-Request-ID`) atanır.
- İşlem süresi `X-Process-Time` başlığıyla istemciye ve JSON loglarına iletilir.
- **Log Temizleme:** URL veya isteklerde geçebilecek `token`, `password`, `api_key`, `secret`, `session`, `otp`, `cvv` parametreleri loglara yazılmadan önce `[REDACTED]` ile maskelenir.

### 1.4 Güvenlik Başlıkları (Security Headers)
Tüm yanıtlara OWASP standartlarında başlıklar eklenir:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### 1.5 Ayrıntısız Güvenli Hata Mesajları
- Beklenmeyen sunucu hatalarında iç sistem trace'leri, veritabanı URL'leri veya dosya yolları istemciye sızdırılmaz; standart ve güvenli bir JSON yanıtı döndürülür.

### 1.6 Health ve Readiness Probe'ları
- `GET /health`: Liveness durumu.
- `GET /readiness`: Kubernetes / Container orkestrasyonu için motor hazırlık durumu.

---

## 2. Gelecekteki Sayfa Taramaları İçin SSRF Koruma Mimarisi (`ssrf_guard.py`)

Canlı sistemde kullanıcı URL'lerine sunucudan doğrudan istek atılmaz. İleride sayfa taraması eklendiğinde devreye girmek üzere **izole SSRF savunma şartnamesi** hazırlandı:
- **İzinli Protokoller:** Yalnızca `http` ve `https`.
- **Yasaklı Ağ Aralıkları:**
  - `127.0.0.0/8` (Loopback)
  - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918 Özel Ağlar)
  - `169.254.0.0/16` (Link-local ve AWS/GCP Bulut Metadata IP'si: `169.254.169.254`)
  - `::1/128`, `fc00::/7`, `fe80::/10` (IPv6 Yerel Ağlar)
- **DNS Rebinding Savunması:** URL ana makinesi ağ isteği öncesi DNS sorgusuyla çözümlenir, dönen IP adresleri yasaklı listede taranır ve bağlantı doğrudan onaylı IP'ye yapılır.
- **Limitler:** Azami 3 yönlendirme (redirect), yönlendirme başına yeniden IP doğrulaması, 5 saniye zaman aşımı, azami 1 MB yanıt boyutu.
