# ResumeAI Pro

AI-powered resume analyzer that scores your resume against any job description, finds ATS keyword gaps, rewrites weak bullets, and generates a tailored summary and cover letter — in seconds.

**Developer:** Aswin Raj  
**Tagline:** Beat the ATS. Land the interview.

---

## One-line pitch

ResumeAI Pro helps job seekers optimize their resume for Applicant Tracking Systems (ATS) with instant AI feedback tailored to any job posting.

---

## The problem it solves

Most job applications never reach a human recruiter. Applicant Tracking Systems (ATS) filter resumes by keywords, formatting, and role fit before anyone reads them. Job seekers often:

- Don't know which keywords they're missing  
- Use generic bullet points without metrics  
- Spend hours tailoring resumes and cover letters manually  

ResumeAI Pro automates that workflow with instant, structured AI feedback.

---

## Key features

| Feature | What it does |
|---------|----------------|
| **ATS match score** | 0–100 compatibility score with an executive summary |
| **Keyword intelligence** | Lists matched skills and missing keywords from the job posting |
| **Strengths & improvements** | Actionable feedback on what's working and what to fix |
| **ATS optimization tips** | Formatting, section headers, and keyword placement guidance |
| **AI bullet rewrites** | Before/after rewrites with quantified, action-led language |
| **Professional summary** | Role-tailored summary generated from your resume + JD |
| **Cover letter generator** | Personalized 3-paragraph cover letter draft |
| **Resume upload** | PDF, DOCX, TXT, and MD — parsed in the browser |
| **Paste fallback** | Paste resume text directly if upload isn't needed |
| **Downloadable report** | Export the full analysis as a text file |
| **Session privacy** | Results stored in the browser session only (no account required for core flow) |

---

## How it works

1. **Upload or paste** your resume (PDF/DOCX supported)  
2. **Paste the job description** you're applying for  
3. **Click Analyze** — AI compares resume vs. role  
4. **Review results** — score, keywords, rewrites, summary, cover letter  
5. **Copy or download** what you need and update your application  

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 19, TanStack Start, TanStack Router |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| AI | Google Gemini API |
| Resume parsing | PDF.js (PDF), Mammoth (DOCX) |
| Validation | Zod |
| Deployment | Cloudflare Workers |
| Build | Vite 7 |

**Short list:** `React 19` · `TanStack Start` · `TypeScript` · `Tailwind CSS` · `Google Gemini` · `PDF.js` · `Cloudflare Workers` · `Vite`

---

## Technical highlights

### Architecture

- **Frontend:** React 19, TanStack Router, TanStack Start (SSR + server functions)  
- **Styling:** Tailwind CSS 4, Radix UI, Framer Motion  
- **AI:** Google Gemini API (direct integration, structured JSON responses)  
- **Resume parsing:** PDF.js (PDF) + Mammoth (DOCX) — client-side only  
- **Validation:** Zod  
- **Deployment:** Cloudflare Workers (edge hosting)  

### Privacy & security

- Resume **files** are parsed locally in the browser — not uploaded to a file server  
- Only **plain text** (resume + job description) is sent to the AI API on analyze  
- API keys stay server-side (never exposed to the client)  
- Analysis results live in **sessionStorage** for the current tab  

### Engineering decisions

- Direct **Gemini API** integration for cost control and ownership  
- **Retry + fallback model** logic for Gemini rate limits and high-demand periods  
- **Cloudflare Workers** deployment for free-tier, global edge performance  
- Full-stack type safety with TypeScript end to end  

---

## Getting started

### Prerequisites

- Node.js 20+
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

### Setup

```bash
git clone <your-repo-url>
cd resume-ai-pro
npm install --legacy-peer-deps
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run locally:

```bash
npm run dev
```

Deploy to Cloudflare:

```bash
npm run deploy
```

Set `GEMINI_API_KEY` as a secret in the Cloudflare dashboard.

---

## Sample LinkedIn posts

### Option A — Short & punchy

> Built **ResumeAI Pro** — an AI resume analyzer that helps job seekers beat Applicant Tracking Systems.
>
> Upload your resume, paste a job description, and get:
> ✅ ATS match score  
> ✅ Missing keywords  
> ✅ AI bullet rewrites  
> ✅ Tailored summary + cover letter  
>
> Built with React, TanStack Start, and Google Gemini — deployed on Cloudflare Workers.
>
> Developed by **Aswin Raj**
>
> #WebDevelopment #AI #React #JobSearch #ATS #FullStack #Cloudflare #Gemini

### Option B — Story-driven

> Most resumes never reach a human — they get filtered by ATS software first.
>
> So I built **ResumeAI Pro**: a tool that scores your resume against any job description and tells you exactly what to improve.
>
> What it does:
> • Instant ATS compatibility score  
> • Keyword gap analysis (what's missing from the JD)  
> • AI-powered bullet rewrites with stronger impact language  
> • Generated professional summary and cover letter  
>
> Technical side: client-side PDF/DOCX parsing (your file never leaves the browser for parsing), server-side Gemini API for analysis, deployed on Cloudflare Workers at the edge.
>
> A project I'm proud to share — built end to end by **Aswin Raj**.
>
> #BuildInPublic #AIProjects #ReactJS #TypeScript #CareerTech #SoftwareEngineering

### Option C — Developer-focused

> New project: **ResumeAI Pro**
>
> Full-stack AI app for resume optimization against job descriptions.
>
> **Stack:** React 19 · TanStack Start · TypeScript · Tailwind · Gemini API · Cloudflare Workers  
>
> **Highlights:**
> - Client-side resume parsing (PDF.js + Mammoth)  
> - Server functions for secure AI calls  
> - Structured JSON output from Gemini (score, keywords, rewrites, cover letter)  
> - Retry/fallback handling for API rate limits  
>
> Privacy-first: files parsed in-browser; only text sent for analysis.
>
> — **Aswin Raj**
>
> #FullStackDeveloper #React #CloudflareWorkers #GoogleGemini #OpenSource

### Option D — Minimal (carousel / image caption)

> **ResumeAI Pro** — AI-powered ATS resume analyzer  
> Score · Keywords · Rewrites · Cover letter  
> Built by Aswin Raj | React + Gemini + Cloudflare

---

## Suggested hashtags

**Primary:** `#WebDevelopment` `#AI` `#React` `#FullStack` `#JobSearch` `#ATS`

**Secondary:** `#TypeScript` `#Cloudflare` `#Gemini` `#BuildInPublic` `#SoftwareEngineering` `#CareerTech` `#ReactJS` `#TailwindCSS`

---

## Resume / portfolio bullet points

- Designed and developed **ResumeAI Pro**, a full-stack AI web app that analyzes resumes against job descriptions and generates ATS optimization feedback  
- Integrated **Google Gemini API** with structured JSON responses, retry logic, and model fallback for production reliability  
- Implemented **client-side resume parsing** (PDF/DOCX) using PDF.js and Mammoth — no file upload to backend  
- Built UI with **React 19**, TanStack Start, Tailwind CSS 4, and Radix UI  
- Deployed to **Cloudflare Workers** with server-side secret management for API keys  

---

## Links

| Item | URL |
|------|-----|
| Live demo | `[Add your Cloudflare Workers URL]` |
| GitHub repo | `[Add your repository URL]` |
| Portfolio / contact | `[Add your LinkedIn or portfolio URL]` |

---

## Author

**Aswin Raj**  
Developed & licensed by Aswin Raj

---

*Last updated: June 2026*
