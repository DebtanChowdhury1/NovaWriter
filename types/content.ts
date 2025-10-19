export type ContentCategory = "blog" | "ad" | "email" | "product";

export interface GenerationPayload {
  prompt: string;
  tone: string;
  wordCount: number;
  keywords: string[];
  template: ContentCategory;
}

export interface GenerationResponse {
  content: string;
  tokenUsage: number;
  savedId: string;
}

export interface GenerationHistoryItem {
  _id: string;
  userId: string;
  template: ContentCategory;
  prompt: string;
  tone: string;
  wordCount: number;
  keywords: string[];
  content: string;
  tokenUsage: number;
  createdAt: string;
}

export interface DashboardStats {
  totalGenerations: number;
  tokensUsed: number;
  lastGeneratedAt?: string;
  topTemplate?: ContentCategory;
}
