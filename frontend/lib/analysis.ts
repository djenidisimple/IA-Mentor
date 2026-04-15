import { apiFetch } from "./api";

export interface CodeQualityMetrics {
  filesAnalyzed: number;
  totalLinesOfCode: number;
  commentLines: number;
  commentRatio: number;
  complexityScore: number;
  maintainabilityIndex: number;
  detectedLanguages: string[];
  hasReadme: boolean;
  hasTests: boolean;
  hasDocumentation: boolean;
  followsBestPractices: boolean;
}

export interface AnalysisResult {
  id: number;
  submissionId: number;
  summary: string;
  detailedFeedback: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  codeQualityMetrics: CodeQualityMetrics;
  status: string;
  createdAt: string;
  completedAt: string;
}

export const analysisApi = {
  analyzeSubmission: (submissionId: number) =>
    apiFetch<AnalysisResult>("/api/analysis/submission", {
      method: "POST",
      body: JSON.stringify({ submissionId }),
    }),

  getAnalysisResult: (submissionId: number) =>
    apiFetch<AnalysisResult>(`/api/analysis/submission/${submissionId}`),

  getRepositoryContent: (submissionId: number) =>
    apiFetch<any>(`/api/analysis/submission/${submissionId}/repository`),
};