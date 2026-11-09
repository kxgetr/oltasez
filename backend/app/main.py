from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.model_loader import model_manager
from app.schemas.analysis import HealthResponse
from app.api.endpoints import router as analysis_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: loads ML model into memory on startup."""
    print(f"[*] Starting {settings.PROJECT_NAME} ({settings.ENVIRONMENT})...")
    loaded = model_manager.load_model()
    if loaded:
        print(f"[✓] ML Model '{model_manager.model_name}' successfully loaded into memory.")
    else:
        print("[!] Running with fallback heuristic engine.")
    yield
    print(f"[*] Shutting down {settings.PROJECT_NAME}...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Oltasez - Yapay Zekâ Destekli Phishing / Oltalama URL Analiz Servisi",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production_hidden" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production_hidden" else None
)

# CORS Middleware configured from environment variables
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]["msg"] if errors else "Geçersiz istek biçimi."
    if "Value error, " in first_error:
        first_error = first_error.replace("Value error, ", "")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": first_error,
            "errors": errors
        }
    )

@app.get("/health", response_model=HealthResponse, tags=["Health"], summary="Servis Sağlık Durumu")
def health_check() -> HealthResponse:
    """Returns the operational status of the API and ML model availability."""
    return HealthResponse(
        status="ok",
        version=settings.PROJECT_VERSION,
        model_loaded=model_manager.is_loaded,
        model_name=model_manager.model_name
    )

app.include_router(analysis_router)
app.include_router(analysis_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"], include_in_schema=False)
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "ml_model_loaded": model_manager.is_loaded,
        "ml_model_name": model_manager.model_name,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=(settings.ENVIRONMENT == "development"))
