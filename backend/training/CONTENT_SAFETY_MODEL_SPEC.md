# Oltasez İçerik Güvenliği ve Toksisite Sınıflandırma Mimarisi

> **Sürüm:** v1.0.0-safety-model-spec  
> **Ayrım İlkesi:** İçerik Güvenliği (Küfür/Toksisite) $\neq$ Oltalama (Phishing)

---

## 1. Neden Phishing Modelinden Tamamen Ayrıdır?

Siber güvenlik analizinde sıklıkla yapılan metodolojik bir hata, saldırgan dil ile dolandırıcılık teşebbüsünü tek bir skorda birleştirmektir:
- **Kaba bir sohbet mesajı:** Küfür içerir, ancak **phishing değildir**.
- **Kusursuz Türkçe ile yazılmış sahte e-Devlet e-postası:** Dilbilgisi ve nezaket açısından mükemmeldir, sıfır küfür içerir, ancak **yüksek riskli bir oltalama saldırısıdır**.

Bu iki kavramı aynı sınıflandırıcıda birleştirmek **aşırı yanlış pozitif (False Positive)** veya **kritik yanlış negatif (False Negative)** hatalarına yol açar. Oltasez bu nedenle iki bağımsız model ve ayrı metrikler kullanır.

---

## 2. Etiket Taksonomisi ve Çoklu Etiketleme (Multi-label)

İçerik güvenliği modeli aşağıdaki 4 ayrı bağımsız ikili (binary) etiketi tahmin eder:

1. **`is_offensive` (0 veya 1):** Küfür, hakaret, aşağılama ve nefret söylemi.
2. **`is_aggressive_title` (0 veya 1):** Tehditkâr, haciz veya hapis korkusu yayan manşet/başlık.
3. **`is_extreme_urgency` (0 veya 1):** Son 1 saat, derhal yapmazsanız bloke edilecektir gibi panik dili.
4. **`is_clickbait` (0 veya 1):** "Gözlerinize inanamayacaksınız", "Büyük vurgun" gibi sansasyonel manipülasyon.

---

## 3. Değerlendirme Metrikleri

Her bir alt görev için aşağıdaki metrikler ayrı ayrı raporlanır:
- **Macro F1 Score**
- **Per-class Precision & Recall**
- **False Positive Rate (FPR):** Özellikle meşru alıntılar ve haber bültenlerindeki yanlış alarm oranı $\%1$'in altında olmalıdır.
- **Inference Latency:** $< 10$ ms.

---

## 4. Gerçek Model Eğitimi Öncesi Durum Bildirimi

Bu alanda kamuya açık yüksek kaliteli ve lisanslı Türkçe siber hakaret/manipülasyon veri kümesi henüz standartlaşmadığından, **sistem halihazırda açıklanabilir kural ve sözlük tabanlı `ContentSafetyEngine` çalıştırmaktadır**. Eğitim yapılmamış bir makine öğrenimi modeli varmış gibi yapay doğruluk skorları beyan edilmemektedir.
