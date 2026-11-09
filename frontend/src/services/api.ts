import {
  HealthResponse,
  URLAnalysisRequest,
  URLAnalysisResponse,
  SMSAnalysisRequest,
  SMSAnalysisResponse,
  TextAnalysisRequest,
  TextAnalysisResponse,
} from "@/types/analysis";

// Trim any trailing slashes to avoid double slashes (e.g., https://api.com//analyze)
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

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
 * Sends a URL to backend POST /analyze (with fallback to /analyze/url and /api/v1/analyze/url)
 */
export async function analyzeUrl(request: URLAnalysisRequest): Promise<URLAnalysisResponse> {
  const endpoints = [
    `${API_BASE_URL}/analyze`,
    `${API_BASE_URL}/analyze/url`,
    `${API_BASE_URL}/api/v1/analyze/url`
  ];

  let lastStatus = 503;
  let lastErrorMessage = "FastAPI sunucusuna bağlanılamadı.";

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (res.status === 404) {
        lastStatus = 404;
        continue; // Try next alias endpoint
      }

      if (!res.ok) {
        let errorMessage = `Sunucu hatası (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData?.detail) {
            errorMessage = typeof errorData.detail === "string" 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Fallback
        }
        throw new ApiError(errorMessage, res.status);
      }

      const data = await res.json();
      // Adapt v1 schema to URLAnalysisResponse if needed
      if (data && !data.status && data.risk_level) {
        const statusMap: Record<string, any> = {
          low: "Güvenli",
          medium: "Şüpheli",
          high: "Oltalama Riski",
          unknown: "Şüpheli"
        };
        return {
          url: request.url,
          status: statusMap[data.risk_level] || "Şüpheli",
          risk_score: data.risk_score || 0,
          reasons: data.evidence || [],
          features: {
            url_length: request.url.length,
            domain_length: data.metadata?.registered_domain?.length || 0,
            path_length: 0,
            subdomain_count: 0,
            dot_count: 0,
            digit_count: 0,
            digit_ratio: 0,
            hyphen_count: 0,
            special_char_count: 0,
            has_ip_address: Boolean(data.metadata?.is_ip),
            uses_https: request.url.startsWith("https://"),
            query_param_count: 0,
            entropy: data.metadata?.entropy || 0,
            has_punycode: Boolean(data.metadata?.has_punycode)
          }
        };
      }

      return data;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode !== 404) throw error;
      lastErrorMessage = error?.message || lastErrorMessage;
    }
  }

  throw new ApiError(
    `Servis bağlantısı kurulamadı (${lastStatus}). Lütfen Vercel ortam değişkenlerindeki NEXT_PUBLIC_API_URL adresinizi (örn: https://...onrender.com) kontrol ediniz.`,
    lastStatus
  );
}

/**
 * Sends an SMS message to backend POST /analyze/sms (with fallback to /api/v1/analyze/message)
 */
export async function analyzeSms(request: SMSAnalysisRequest): Promise<SMSAnalysisResponse> {
  const endpoints = [
    `${API_BASE_URL}/analyze/sms`,
    `${API_BASE_URL}/api/v1/analyze/message`
  ];

  let lastStatus = 503;
  let lastErrorMessage = "SMS analiz servisine ulaşılamadı.";

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (res.status === 404) {
        lastStatus = 404;
        continue;
      }

      if (!res.ok) {
        let errorMessage = `Sunucu hatası (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData?.detail) {
            errorMessage = typeof errorData.detail === "string" 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Fallback
        }
        throw new ApiError(errorMessage, res.status);
      }

      const data = await res.json();
      if (data && !data.status && data.risk_level) {
        const statusMap: Record<string, any> = {
          low: "Güvenli",
          medium: "Şüpheli",
          high: "Oltalama Riski",
          unknown: "Şüpheli"
        };
        return {
          sender: request.sender,
          message_preview: request.message.slice(0, 100),
          status: statusMap[data.risk_level] || "Şüpheli",
          risk_score: data.risk_score || 0,
          reasons: data.evidence || [],
          detected_topics: (data.detected_categories || []).map((c: string) => ({
            key: c,
            label: c.replace("_", " ").toUpperCase(),
            matched_terms: []
          })),
          manipulation: {
            has_urgency: Boolean(data.metadata?.has_urgency),
            has_financial_demand: Boolean(data.metadata?.has_payment_demand),
            has_threat: Boolean(data.metadata?.has_threat),
            detected_cues: []
          },
          content_safety: {
            has_offensive_language: (data.content_flags || []).includes("offensive_language"),
            flagged_words: [],
            safe_for_work: !(data.content_flags || []).includes("offensive_language"),
            explanation: (data.content_flags || []).includes("offensive_language") 
              ? "Uygunsuz dil tespit edildi." 
              : "İçerik temiz."
          },
          extracted_urls: [],
          ai_score_explanation: "Kural ve sezgisel motor devrededir."
        };
      }

      return data;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode !== 404) throw error;
      lastErrorMessage = error?.message || lastErrorMessage;
    }
  }

  throw new ApiError(
    `SMS servisi bulunamadı (${lastStatus}). Lütfen NEXT_PUBLIC_API_URL adresini kontrol ediniz.`,
    lastStatus
  );
}

/**
 * Sends title and body text to backend POST /analyze/text (with fallback to /api/v1/analyze/title)
 */
export async function analyzeText(request: TextAnalysisRequest): Promise<TextAnalysisResponse> {
  const endpoints = [
    `${API_BASE_URL}/analyze/text`,
    `${API_BASE_URL}/api/v1/analyze/title`
  ];

  let lastStatus = 503;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (res.status === 404) {
        lastStatus = 404;
        continue;
      }

      if (!res.ok) {
        let errorMessage = `Sunucu hatası (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData?.detail) {
            errorMessage = typeof errorData.detail === "string" 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Fallback
        }
        throw new ApiError(errorMessage, res.status);
      }

      const data = await res.json();
      if (data && !data.status && data.risk_level) {
        const statusMap: Record<string, any> = {
          low: "Güvenli",
          medium: "Şüpheli",
          high: "Oltalama Riski",
          unknown: "Şüpheli"
        };
        return {
          title: request.title,
          content_preview: request.content.slice(0, 100),
          status: statusMap[data.risk_level] || "Şüpheli",
          risk_score: data.risk_score || 0,
          reasons: data.evidence || [],
          detected_topics: (data.detected_categories || []).map((c: string) => ({
            key: c,
            label: c.replace("_", " ").toUpperCase(),
            matched_terms: []
          })),
          manipulation: {
            has_urgency: Boolean(data.metadata?.has_urgency),
            has_financial_demand: Boolean(data.metadata?.has_payment_demand),
            has_threat: Boolean(data.metadata?.has_threat),
            detected_cues: []
          },
          content_safety: {
            has_offensive_language: (data.content_flags || []).includes("offensive_language"),
            flagged_words: [],
            safe_for_work: !(data.content_flags || []).includes("offensive_language"),
            explanation: (data.content_flags || []).includes("offensive_language") 
              ? "Uygunsuz dil tespit edildi." 
              : "İçerik temiz."
          },
          extracted_urls: [],
          ai_score_explanation: "Kural ve sezgisel motor devrededir."
        };
      }

      return data;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode !== 404) throw error;
    }
  }

  throw new ApiError(
    `Metin analiz servisi bulunamadı (${lastStatus}). Lütfen NEXT_PUBLIC_API_URL adresini kontrol ediniz.`,
    lastStatus
  );
}
