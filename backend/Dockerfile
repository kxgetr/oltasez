# Hafif ve güvenli Python imajı
FROM python:3.11-slim

WORKDIR /app

# Sistem bağımlılıklarını güncelle
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Bağımlılıkları yükle (Docker layer cache avantajı için önce requirements)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodlarını ve modelleri kopyala
COPY . .

# FastAPI portu
ENV PORT=8000
EXPOSE 8000

# Sağlık kontrolü (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Sunucuyu başlat (Production ayarları)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
