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

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `JOB DESCRIPTION:\n${data.jobDescription}\n\n---\n\nRESUME:\n${data.resumeText}\n\nReturn only the JSON object.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI request failed: ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // try to find JSON inside
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }
    if (!parsed) throw new Error("AI returned an unparseable response");

    return parsed;
  });
