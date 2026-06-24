export interface EssayWithEvaluation {
  id: string;
  userId: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
  evaluation: {
    id: string;
    essayId: string;
    overallBand: number;
    createdAt: string;
  } | null;
}

export interface DashboardStats {
  totalEssays: number;
  averageBand: number | null;
  recentEssays: EssayWithEvaluation[];
  bandTrend: { date: string; band: number }[];
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface CreateEssayResponse {
  essay: EssayWithEvaluation;
}

export type BandScore = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export function getBandColor(band: number): string {
  if (band >= 5) return "#22c55e";
  if (band >= 4) return "#84cc16";
  if (band >= 3) return "#eab308";
  if (band >= 2) return "#f97316";
  return "#ef4444";
}

export function getBandLabel(band: number): string {
  if (band >= 5) return "Expert";
  if (band >= 4.5) return "Very Good";
  if (band >= 4) return "Competent";
  if (band >= 3.5) return "Modest";
  if (band >= 3) return "Limited";
  return "Developing";
}
