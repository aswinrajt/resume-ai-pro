import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  resumeText: z.string().min(50).max(50000),
  jobDescription: z.string().min(30).max(20000),
});

const SYSTEM_PROMPT = `You are an elite ATS (Applicant Tracking System) and career coach. Analyze the candidate's resume against the job description and return ONLY a valid JSON object (no markdown, no commentary) with this exact shape:

{
  "matchScore": number (0-100, overall ATS compatibility),
  "summary": string (2-3 sentence executive summary),
  "matchedSkills": string[] (skills present in both resume and JD, 5-15 items),
  "missingKeywords": string[] (important keywords from JD missing in resume, 5-15 items),
  "strengths": string[] (3-6 specific resume strengths),
  "improvements": string[] (4-7 actionable improvement opportunities),
  "atsOptimizationTips": string[] (4-6 ATS-specific tips like formatting, keywords, section headers),
  "recommendations": string[] (3-5 strategic recommendations),
  "professionalSummary": string (a polished 3-4 sentence professional summary tailored to the JD),
  "rewrittenBullets": [{"original": string, "improved": string}] (rewrite 4-6 weak/generic bullets from the resume with quantified, action-led, keyword-rich versions),
  "coverLetter": string (a personalized, compelling 3-paragraph cover letter ~250 words tailored to the role)
}

Be specific, data-driven, and use modern resume best practices (STAR method, metrics, strong verbs).`;

const FALLBACK_MODEL = "gemini-2.5-flash-lite";
const MAX_RETRIES = 2;

function parseJsonContent(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  }
}

function parseGeminiError(status: number, body: string): string {
  try {
    const err = JSON.parse(body)?.error;
    if (err?.message) {
      const detail = err.details?.find?.(
        (d: { quotaMetric?: string; model?: string; limit?: number }) =>
          d.quotaMetric?.includes("free_tier"),
      );
      if (detail?.limit === 0 && detail?.model) {
        return `No free-tier quota for ${detail.model}. Set GEMINI_MODEL=${FALLBACK_MODEL} in .env and restart the dev server.`;
      }
      return err.message.split("\n")[0];
    }
  } catch {
    // fall through
  }
  if (status === 429) return "Rate limit reached. Please try again shortly.";
  if (status === 503) return "AI service is temporarily unavailable. Please try again shortly.";
  return `AI request failed (${status})`;
}

function isRetryable(status: number, body: string): boolean {
  if (status === 503 || status === 429) return true;
  const msg = parseGeminiError(status, body).toLowerCase();
  return msg.includes("high demand") || msg.includes("try again");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function modelChain(): string[] {
  const primary = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  return primary === FALLBACK_MODEL ? [primary] : [primary, FALLBACK_MODEL];
}

async function callGemini(apiKey: string, model: string, userPrompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const body = await res.text();
  if (!res.ok) {
    return { ok: false as const, status: res.status, body };
  }

  const json = JSON.parse(body);
  const content: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  const parsed = parseJsonContent(content);
  if (!parsed) {
    return {
      ok: false as const,
      status: 502,
      body: JSON.stringify({ error: { message: "AI returned an unparseable response" } }),
    };
  }

  return { ok: true as const, parsed };
}

async function generateAnalysis(apiKey: string, userPrompt: string) {
  let lastError = "AI request failed";

  for (const model of modelChain()) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const result = await callGemini(apiKey, model, userPrompt);

      if (result.ok) return result.parsed;

      lastError = parseGeminiError(result.status, result.body);

      if (!isRetryable(result.status, result.body)) break;
      if (attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
      }
    }
  }

  throw new Error(lastError);
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("AI service is not configured. Set GEMINI_API_KEY in .env");
    }

    const userPrompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\n---\n\nRESUME:\n${data.resumeText}\n\nReturn only the JSON object.`;
    return generateAnalysis(key, userPrompt);
  });
