import {
  HealthResponse,
  URLAnalysisRequest,
  URLAnalysisResponse,
  SMSAnalysisRequest,
  SMSAnalysisResponse,
  TextAnalysisRequest,
  TextAnalysisResponse,
} from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Standard API error wrapper with status code and friendly Turkish message.
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Checks FastAPI backend health status
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new ApiError(`Backend sağlık kontrolü başarısız oldu (${res.status})`, res.status);
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error?.message || "Backend servisine ulaşılamadı", 503);
  }
}

/**
 * Sends a URL to backend POST /analyze/url (or /analyze)
 */
export async function analyzeUrl(request: URLAnalysisRequest): Promise<URLAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Sunucu hatası (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === "string" 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback to HTTP error
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "FastAPI sunucusuna bağlanılamadı. Lütfen backend servisinin (localhost:8000) çalıştığından emin olun.",
      503
    );
  }
}

/**
 * Sends an SMS message to backend POST /analyze/sms
 */
export async function analyzeSms(request: SMSAnalysisRequest): Promise<SMSAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Sunucu hatası (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === "string" 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "FastAPI sunucusuna bağlanılamadı. Lütfen backend servisinin (localhost:8000) çalıştığından emin olun.",
      503
    );
  }
}

/**
 * Sends title and body text to backend POST /analyze/text
 */
export async function analyzeText(request: TextAnalysisRequest): Promise<TextAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Sunucu hatası (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === "string" 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "FastAPI sunucusuna bağlanılamadı. Lütfen backend servisinin (localhost:8000) çalıştığından emin olun.",
      503
    );
  }
}
