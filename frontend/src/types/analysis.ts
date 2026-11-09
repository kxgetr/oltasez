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

export interface TopicItem {
  key: string;
  label: string;
  matched_terms: string[];
}

export interface ManipulationIndicators {
  has_urgency: boolean;
  has_financial_demand: boolean;
  has_threat: boolean;
  detected_cues: string[];
}

export interface ContentSafetyReport {
  has_offensive_language: boolean;
  flagged_words: string[];
  safe_for_work: boolean;
  explanation: string;
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

export interface SMSAnalysisRequest {
  message: string;
  sender?: string | null;
}

export interface SMSAnalysisResponse {
  sender?: string | null;
  message_preview: string;
  status: RiskStatus;
  risk_score: number;
  reasons: string[];
  detected_topics: TopicItem[];
  manipulation: ManipulationIndicators;
  content_safety: ContentSafetyReport;
  extracted_urls: URLAnalysisResponse[];
  ai_score_explanation: string;
}

export interface TextAnalysisRequest {
  title?: string | null;
  content: string;
}

export interface TextAnalysisResponse {
  title?: string | null;
  content_preview: string;
  status: RiskStatus;
  risk_score: number;
  reasons: string[];
  detected_topics: TopicItem[];
  manipulation: ManipulationIndicators;
  content_safety: ContentSafetyReport;
  extracted_urls: URLAnalysisResponse[];
  ai_score_explanation: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  model_loaded: boolean;
  model_name?: string | null;
  modes_supported?: string[];
}
