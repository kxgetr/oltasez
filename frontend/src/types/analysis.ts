export type RiskStatus = "Güvenli" | "Şüpheli" | "Oltalama Riski" | "safe" | "suspicious" | "phishing";

export interface FeatureSummary {
  url_length: number;
  domain_length: number;
  path_length: number;
  subdomain_count: number;
  dot_count: number;
  digit_count: number;
  digit_ratio: number;
  hyphen_count: number;
  special_char_count: number;
  has_ip_address: boolean;
  uses_https: boolean;
  query_param_count: number;
  entropy: number;
  has_punycode: boolean;
}

export interface URLAnalysisRequest {
  url: string;
}

export interface URLAnalysisResponse {
  url: string;
  status: RiskStatus;
  risk_score: number; // 0 - 100
  reasons: string[];
  features: FeatureSummary;
}

export interface HealthResponse {
  status: string;
  version: string;
  model_loaded: boolean;
  model_name?: string | null;
}
