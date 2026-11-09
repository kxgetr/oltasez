# Oltasez Bilimsel Makine Öğrenmesi Değerlendirme Raporu

> **Tarih:** 2026-11-10  
> **Kapsam:** URL Phishing, Türkçe Dolandırıcılık Metinleri ve İçerik Güvenliği  
> **Rapor Dosyası:** `backend/training/reports/ml_evaluation_report.json`

---

## 1. URL Phishing Sınıflandırma Deneyleri

### 1.1 Veri Kaynağı ve Öznitelik Mühendisliği
- **Veri Kümesi:** UCI PhiUSIIL Phishing URL Dataset standartları.
- **Sıfır Ağ İstemi Kuralı:** Yalnızca ham URL metninden doğrudan hesaplanabilen 14 leksikal öznitelik (Shannon entropisi, punycode `xn--`, ham IP tespiti, alt alan adı derinliği, TLD riski vb.) kullanılmıştır.

### 1.2 Veri Sızıntısı (Data Leakage) Denetimi
- **Rastgele Ayrım (Random Split):** Aynı kök alan adına (`turkiye.gov.tr`, `ceza-odeme.cc`) ait alt sayfaların hem eğitime hem teste düşmesi yapay olarak şişirilmiş metriklere yol açabilir.
- **Kayıtlı Alan Adına Göre Gruplandırılmış Ayrım (Group-by-Domain Split):** Kök alan adları tamamen izole edilmiştir. Çakışma sayısı: **0 alan adı**.
- **Bağımsız Test Veri Kümesi (Out-of-Distribution Split):** Modelin daha önce hiç karşılaşmadığı alan adları (`github.blog`, `bbc.com`, `chase-security-update.sbs`, `dhl-express-package.guru`) üzerinde sınanmıştır.

### 1.3 Karşılaştırmalı Model Sonuçları (Bağımsız Test Kümesi)

| Model | Precision | Recall | F1 Score | FPR (Yanlış Pozitif) | PR-AUC | Brier Kalibrasyon | Tahmin Gecikmesi (1k sorgu) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Kural Tabanlı Baseline** | 1.0000 | 0.8000 | **0.8889** | 0.0000 | 0.8500 | 0.0732 | ~7.4 ms |
| **Logistic Regression** | 1.0000 | 1.0000 | **1.0000** | 0.0000 | 1.0000 | 0.0275 | ~3.7 ms |
| **Random Forest** | 1.0000 | 1.0000 | **1.0000** | 0.0000 | 1.0000 | 0.0600 | ~3.6 ms |

---

## 2. Türkçe Dolandırıcılık Mesajı Sınıflandırması Durum Raporu

- **Bağımsızlık:** Mesaj modeli URL modelinden bağımsızdır.
- **Veri Durumu:** Kamusal olarak doğrulanmış, yeterli büyüklükte (15.000+ örnek) Türkçe etiketli dolandırıcılık veri kümesi bulunmamaktadır.
- **Bilimsel İlke:** Sentetik test senaryoları eğitim veya değerlendirme verisi olarak beyan edilmemiştir.
- **Aktif Çözüm:** Sistemin canlı sürümünde şeffaf olarak **kural ve sezgisel tabanlı ScamTextEngine** devrededir; API yanıtlarında `limitations` olarak bildirilmektedir.

---

## 3. İçerik Güvenliği ve Manipülatif Başlık Sınıflandırması

- **Ayrık Model İlkesi:** Küfür/hakaret ve saldırgan dil, oltalama (phishing) sınıflandırıcısı ile **birleştirilmemiştir**.
- **Değerlendirme:** Çoklu etiketli (multi-label) `ContentSafetyEngine` bağımsız olarak çalışmakta, alıntı ve tırnak içi bağlamları dikkate almaktadır.
- **Sürümleme:** `v1.0.0-content-safety` olarak izlenmektedir.
