import type { AnalysisResult } from "./types";

const KEY = "resumeai:last-analysis";

export interface StoredAnalysis {
  result: AnalysisResult;
  resumeText: string;
  jobDescription: string;
  createdAt: number;
}

export function saveAnalysis(data: StoredAnalysis) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAnalysis) : null;
  } catch {
    return null;
  }
}
