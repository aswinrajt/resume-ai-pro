export interface AnalysisResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  atsOptimizationTips: string[];
  recommendations: string[];
  professionalSummary: string;
  rewrittenBullets: { original: string; improved: string }[];
  coverLetter: string;
}
