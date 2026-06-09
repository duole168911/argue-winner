export type IntensityStyle = "low" | "mid" | "high";

export interface ArgumentRequest {
  message: string;
  intensity: number;
}

export interface ArgumentResponse {
  responses: string[];
}

export interface ApiErrorBody {
  error: string;
}
