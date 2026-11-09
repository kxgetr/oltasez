"""
Production Security & Rate Limiting Middleware.
Implements:
1. In-memory Token-bucket / Sliding-window Rate Limiting per IP
2. Request Body Size Limiter (Max 64 KB to mitigate DoS / Memory exhaustion)
3. Structured Logging with UUID Request ID & Sensitive Data Sanitization
4. Timing header (X-Process-Time) & Security Headers (X-Content-Type-Options, etc.)
"""

import time
import uuid
import re
import logging
from typing import Dict, Tuple
from urllib.parse import urlparse, parse_qs, urlencode
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette import status

# Configure structured JSON logger
logger = logging.getLogger("oltasez.production")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '{"time": "%(asctime)s", "level": "%(levelname)s", "name": "%(name)s", "message": "%(message)s"}'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Maximum request body size: 65,536 bytes (64 KB)
MAX_REQUEST_BODY_SIZE = 64 * 1024

# Rate limit configuration: 60 requests per minute per IP
RATE_LIMIT_REQUESTS = 60
RATE_LIMIT_WINDOW_SECONDS = 60

# In-memory storage for sliding window: {ip: [(timestamp1), (timestamp2)...]}
_ip_rate_records: Dict[str, list] = {}

SENSITIVE_PARAM_NAMES = {
    "token", "auth", "key", "api_key", "secret", "password", "pass",
    "pwd", "session", "access_token", "bearer", "otp", "cvv", "card"
}

def sanitize_url_for_logging(url_str: str) -> str:
    """
    Masks secret tokens and sensitive query parameters before logging.
    e.g. 'https://bank.com/login?token=secret123&user=mrt' -> 'https://bank.com/login?token=[REDACTED]&user=mrt'
    """
    if not url_str:
        return ""
    try:
        parsed = urlparse(url_str)
        if not parsed.query:
            return url_str
        query_dict = parse_qs(parsed.query, keep_blank_values=True)
        sanitized_query = {}
        for k, vals in query_dict.items():
            if k.lower() in SENSITIVE_PARAM_NAMES:
                sanitized_query[k] = ["[REDACTED]"]
            else:
                sanitized_query[k] = vals
        new_query = urlencode(sanitized_query, doseq=True)
        return parsed._replace(query=new_query).geturl()
    except Exception:
        return "[URL_SANITIZATION_FAILED]"

def is_rate_limited(client_ip: str) -> Tuple[bool, int]:
    """
    Checks if client IP exceeded rate limits.
    Returns: (is_limited, remaining_quota)
    """
    now = time.time()
    timestamps = _ip_rate_records.get(client_ip, [])
    
    # Filter timestamps older than sliding window
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS
    active_timestamps = [ts for ts in timestamps if ts > cutoff]

    if len(active_timestamps) >= RATE_LIMIT_REQUESTS:
        _ip_rate_records[client_ip] = active_timestamps
        return True, 0

    active_timestamps.append(now)
    _ip_rate_records[client_ip] = active_timestamps
    remaining = RATE_LIMIT_REQUESTS - len(active_timestamps)
    return False, remaining

class ProductionSecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Assign unique Request ID
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id
        start_time = time.time()

        # Extract client IP
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # 2. Rate Limiting Check (Skip /health and /readiness)
        path = request.url.path
        if path not in ("/health", "/readiness", "/"):
            limited, remaining = is_rate_limited(client_ip)
            if limited:
                logger.warning(
                    f"Rate limit exceeded for IP: {client_ip} on path: {path} [request_id: {request_id}]"
                )
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "İstek sınırı aşıldı. Lütfen bir süre sonra tekrar deneyiniz.",
                        "request_id": request_id,
                        "code": "RATE_LIMIT_EXCEEDED"
                    },
                    headers={
                        "X-Request-ID": request_id,
                        "Retry-After": str(RATE_LIMIT_WINDOW_SECONDS)
                    }
                )

        # 3. Request Body Size Guard
        content_length = request.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_REQUEST_BODY_SIZE:
            logger.warning(
                f"Payload too large from IP: {client_ip} ({content_length} bytes) [request_id: {request_id}]"
            )
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={
                    "error": "İstek boyutu sınırı aşıldı (Azami 64 KB).",
                    "request_id": request_id,
                    "code": "PAYLOAD_TOO_LARGE"
                },
                headers={"X-Request-ID": request_id}
            )

        # 4. Proceed to route with timing
        try:
            response = await call_next(request)
        except Exception as exc:
            logger.error(
                f"Unhandled server error on {path}: {str(exc)} [request_id: {request_id}]"
            )
            # Safe non-verbose error response (Never leak traceback in production)
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Sunucuda beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
                    "request_id": request_id,
                    "code": "INTERNAL_SERVER_ERROR"
                },
                headers={"X-Request-ID": request_id}
            )

        process_time = (time.time() - start_time) * 1000

        # 5. Security & Diagnostic Headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # Log completion with sanitized path
        sanitized_path = sanitize_url_for_logging(str(request.url))
        logger.info(
            f"{request.method} {sanitized_path} -> {response.status_code} in {process_time:.2f}ms [request_id: {request_id}]"
        )

        return response
