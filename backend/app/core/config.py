"""Backend configuration and environment settings."""
import os

class Settings:
    PROJECT_NAME: str = "Oltasez API"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Port configuration (e.g. Render/Railway assigns PORT dynamically)
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS settings - reads comma-separated origins from environment variable
    _cors_raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,https://oltasez.vercel.app,*"
    )
    CORS_ORIGINS: list[str] = [origin.strip() for origin in _cors_raw.split(",") if origin.strip()]

settings = Settings()
