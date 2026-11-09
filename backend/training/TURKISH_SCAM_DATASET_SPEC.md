# Oltasez Türkçe Dolandırıcılık ve SMS Veri Gereksinim Dokümanı

> **Sürüm:** v1.0.0-data-spec  
> **Durum:** Veri Toplama ve Etiketleme Aşaması (Gerçek Veri Eksikliği Bildirimi)

---

## 1. Veri Gereksinimi ve Gerekçesi

Oltasez'in bilimsel ilkeleri gereğince, **doğrulanmış ve gerçek dünya kaynaklı etiketli veri kümesi olmadan yapay zeka sınıflandırıcısı eğitilmiş gibi gösterilemez**.

Sentetik veya yapay olarak üretilmiş örnekler (örn: 5-10 adet örnek SMS) geliştirme aşamasındaki birim testleri için uygundur; ancak **asla bir makine öğrenimi modelinin genelleştirme yeteneğini ve F1 skorunu ölçmek için nihai değerlendirme verisi olarak kullanılamaz**.

Bu nedenle gerçek veri kümesi toplanana kadar Türkçe dolandırıcılık analizinde **yalnızca kural ve sezgisel tabanlı motor (Heuristic Rule Engine)** çalıştırılacak ve bu durum analiz raporlarında şeffaf bir limitations maddesi olarak belirtilecektir.

---

## 2. İhtiyaç Duyulan Veri Senaryoları ve Kategori Taksonomisi

| Kategori Kodu | Hedef Senaryo | Minimum Örnek Adedi | Tipik Dolandırıcılık Belirteçleri |
| :--- | :--- | :--- | :--- |
| `hgs_transit` | HGS / Köprü & Otoyol Borcu | 1.000 meşru + 1.000 oltalama | "İcra takibi", "haciz", geçiş cezası, sahte ödeme linki |
| `utility_bill` | Fatura (Elektrik/Su/İnternet) | 1.000 meşru + 1.000 oltalama | "Gaz arzı kesilecek", son 24 saat, sahte fatura ödeme portali |
| `cargo_delivery` | Kargo Teslimat & Paket | 1.000 meşru + 1.000 oltalama | "Adres yetersizliği", "paket şubede bekliyor", sahte PTT/kargo takip linki |
| `banking_gov` | Banka & e-Devlet Taklidi | 1.500 meşru + 1.500 oltalama | "Hesabınız askıya alındı", "şüpheli işlem", giriş onay tuzağı |
| `reward_lottery` | Sahte Çekiliş ve Para Ödülü | 500 meşru + 1.000 oltalama | "Tebrikler kazandınız", kart aidatı iadesi, komisyon talebi |
| `account_threat` | Hesap Kapatma & Yasal Tehdit | 500 meşru + 1.000 oltalama | "Savcılık", "cezai kovuşturma", 1 saat içinde doğrulama baskısı |
| `benign_normal` | Günlük Mesajlar & Masum SMS | 3.000 normal | Arkadaş sohbetleri, bilgilendirme SMS'leri, onay kodları (OTP) |

**Toplam Hedef Boyut:** Minimum 15.000 doğrulanmış ve çapraz etiketlenmiş Türkçe mesaj.

---

## 3. Etiketleme Metodolojisi ve Anotasyon İlkeleri

Her metin en az **2 bağımsız siber güvenlik araştırmacısı** tarafından etiketlenmeli ve uyuşmazlık durumunda Cohen's Kappa ($> 0.85$) mutabakatı aranmalıdır:

1. **`is_fraud` (0 veya 1):** Mesaj bir sosyal mühendislik veya dolandırıcılık girişimi içeriyor mu?
2. **`topics` (Liste):** `[hgs_transit, utility_bill, cargo_delivery, banking_gov, reward_lottery, account_threat]`
3. **`urgency_level` (none / moderate / extreme):** Yapay aciliyet ve panik psikolojisi derecesi.
4. **`credential_requested` (boolean):** T.C. kimlik, kart numarası, şifre veya CVV talep ediliyor mu?
5. **`urls_present` (URL listesi):** Mesajda yer alan bağlantıların ham dizgeleri.

---

## 4. Veri Güvenliği ve KVKK Taahhüdü

Toplanan SMS ve mesaj veri kümesinde vatandaşlara ait özel telefon numaraları, ad-soyad, T.C. kimlik numaraları ve kart bilgileri **SHA-256 ile anonimleştirilecek veya `[MASKED_PHONE]`, `[MASKED_NAME]` şeklinde maskelenerek** veri setine dahil edilecektir.
