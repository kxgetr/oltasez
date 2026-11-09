import csv
import os

SAMPLE_DATA = [
    # Legitimate (label=0)
    ("https://www.google.com", 0),
    ("https://www.turkiye.gov.tr", 0),
    ("https://github.com/explore", 0),
    ("https://en.wikipedia.org/wiki/Phishing", 0),
    ("https://stackoverflow.com/questions", 0),
    ("https://www.youtube.com/watch?v=dQw4w9WgXcQ", 0),
    ("https://www.amazon.com/dp/B08N5WRWNW", 0),
    ("https://www.apple.com/iphone", 0),
    ("https://www.microsoft.com/tr-tr", 0),
    ("https://medium.com/@user/article-title", 0),
    ("https://www.nytimes.com/section/technology", 0),
    ("https://developer.mozilla.org/en-US/docs/Web", 0),
    ("https://www.bbc.com/news", 0),
    ("https://news.ycombinator.com", 0),
    ("https://www.reddit.com/r/cybersecurity", 0),
    ("https://tr.wikipedia.org/wiki/Ana_Sayfa", 0),
    ("https://www.linkedin.com/feed", 0),
    ("https://netflix.com/browse", 0),
    ("https://archive.org/web", 0),
    ("https://openai.com/research", 0),

    # Phishing / Malicious (label=1)
    ("http://192.168.1.105/login-account-verification.php", 1),
    ("http://10.0.0.1/banka-giris-fatura-odeme/update.html", 1),
    ("http://apple-id-verify-security-check.xyz/login", 1),
    ("http://paypal-account-suspended-update.top/auth/verify.php", 1),
    ("https://xn--amazn-7qa.com/order-confirmation-signin", 1),
    ("http://secure-login-netflix-account-reactivate.xyz/login.html?token=98234823", 1),
    ("http://fatura-odeme-merkezi-onay-destek.top/odeme", 1),
    ("http://e-devlet-kapisi-onay-kart-aidati.xyz/sorgula.php", 1),
    ("http://bank-guvenlik-dogrulama-sms-onay.net/user/login", 1),
    ("http://free-crypto-giveaway-airdrop2026.click/claim", 1),
    ("http://203.0.113.15/webscr/login?cmd=_login-run", 1),
    ("http://secure.account-update.service.auth-verify.top/security", 1),
    ("http://instagram-blue-tick-verification-center.xyz/badge", 1),
    ("http://faceb00k-security-alert-center.com/checkpoint", 1),
    ("http://whatsapp-web-activation-code-sms.top/confirm", 1),
    ("http://paribu-kripto-giris-odul-kampanya.xyz/login", 1),
    ("http://garanti-bbva-mobil-guvenlik-guncelleme.click/giris", 1),
    ("http://ziraat-bankasi-sms-onay-dekont.top/fatura", 1),
    ("http://papara-hesap-dogrulama-kimlik-onay.xyz/auth", 1),
    ("http://vakifbank-kart-aidat-iade-talebi.top/basvuru", 1),
]

def generate_sample_dataset(csv_path: str = "dataset.csv"):
    """Creates a sample balanced dataset if none is present."""
    os.makedirs(os.path.dirname(os.path.abspath(csv_path)), exist_ok=True)
    with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "label"])
        for url, label in SAMPLE_DATA:
            writer.writerow([url, label])
    print(f"Sample dataset generated with {len(SAMPLE_DATA)} records at: {csv_path}")

if __name__ == "__main__":
    generate_sample_dataset("dataset.csv")
