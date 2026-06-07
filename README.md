# ResumeAI Pro

AI-powered resume analyzer that scores your resume against any job description, surfaces ATS keyword gaps, rewrites weak bullets, and generates a tailored professional summary and cover letter.

Developed & licensed by **Aswin Raj**.

---

## Features

- **ATS match score** — 0–100 compatibility score with an executive summary
- **Keyword intelligence** — matched skills and missing keywords from the job posting
- **Actionable feedback** — strengths, improvements, ATS tips, and strategic recommendations
- **AI rewrites** — before/after bullet improvements with quantified, action-led language
- **Professional summary** — tailored to the target role
- **Cover letter generator** — personalized draft ready to copy or edit
- **Client-side resume parsing** — PDF, DOCX, TXT, and MD parsed in the browser (no file upload to a server)
- **Downloadable report** — export the full analysis as a text file
- **Privacy-first session** — analysis results live in `sessionStorage` for the current browser tab only

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| AI | [Google Gemini API](https://ai.google.dev/) (direct integration) |
| Resume parsing | [PDF.js](https://mozilla.github.io/pdf.js/) (PDF), [Mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX) |
| Validation | [Zod](https://zod.dev/) |
| Backend (optional) | [Supabase](https://supabase.com/) (auth scaffold — not required for core analysis flow) |
| Build | [Vite 7](https://vite.dev/) + [Nitro](https://nitro.build/) |

---

## How it works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Browser    │     │  TanStack Start  │     │  Google Gemini  │
│  /app       │────▶│  server function │────▶│  API            │
│             │     │  analyzeResume   │     │                 │
│  PDF/DOCX   │     └──────────────────┘     └─────────────────┘
│  → text     │              │
│  (local)    │              ▼
└─────────────┘     sessionStorage → /results
```

1. **Upload or paste** your resume on `/app`. Files are parsed entirely in the browser.
2. **Paste the job description** you are applying for.
3. **Analyze** sends only the extracted plain text (not the original file) to a server-side function.
4. **Gemini** returns structured JSON: score, keywords, rewrites, summary, and cover letter.
5. **Results** are saved to `sessionStorage` and displayed on `/results`.

---

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** (or bun)
- A **Google Gemini API key** — free tier available at [Google AI Studio](https://aistudio.google.com/apikey)

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/resume-ai-pro.git
cd resume-ai-pro
```

### 2. Install dependencies

```bash
npm install
```

If you hit peer dependency conflicts with `nitro`, try:

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Required — Google Gemini (resume analysis)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional — Supabase (auth scaffold; not required for analysis)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** | Gemini API key from Google AI Studio |
| `GEMINI_MODEL` | No | Model ID (default: `gemini-2.5-flash`). Falls back to `gemini-2.5-flash-lite` on overload |
| `SUPABASE_URL` | No | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | No | Supabase anon/public key |
| `VITE_SUPABASE_*` | No | Client-side Supabase vars (same values as above, with `VITE_` prefix) |

> **Never commit `.env` to git.** API keys are secrets and must stay local or in your deployment platform's secret store.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) (port may vary — check the terminal output).

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Deploy to Cloudflare Workers (free)

This project builds for **Cloudflare Workers** via Nitro. Do **not** run Wrangler's auto-setup wizard — it will fail on the Lovable Vite config. Use the steps below instead.

### One-time setup

1. Create a free [Cloudflare](https://dash.cloudflare.com) account
2. Log in locally:
   ```bash
   npx wrangler login
   ```
3. Add your Gemini key as a Worker secret:
   ```bash
   npx wrangler secret put GEMINI_API_KEY --config .output/server/wrangler.json
   ```
   (Run `npm run build` first so `.output/server/wrangler.json` exists, or use the Cloudflare dashboard → Workers → Settings → Secrets.)

### Deploy

```bash
npm run deploy
```

This runs `npm run build` then `wrangler deploy --config .output/server/wrangler.json`.

### Cloudflare Git integration

If connecting GitHub in the Cloudflare dashboard:

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy --config .output/server/wrangler.json` |

Add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) as **encrypted environment variables / secrets** in the Cloudflare project settings.

---

## Gemini model notes

- **`gemini-2.5-flash`** — default; best balance of quality and speed on the free tier
- **`gemini-2.5-flash-lite`** — lighter model; used automatically as a fallback when the primary model is overloaded
- **`gemini-2.0-flash`** — avoid on free tier; quota is often **0** for new keys

If you see quota or “high demand” errors, set `GEMINI_MODEL=gemini-2.5-flash-lite` in `.env` and restart the dev server.

---

## Project structure

```
resume-ai-pro/
├── src/
│   ├── routes/
│   │   ├── index.tsx          # Landing page
│   │   ├── app.tsx            # Upload + analyze workspace
│   │   ├── results.tsx        # Analysis report
│   │   └── __root.tsx         # Root layout, meta, error boundary
│   ├── lib/
│   │   ├── analyze.functions.ts   # Gemini server function
│   │   ├── parse-resume.ts          # Client-side PDF/DOCX parsing
│   │   ├── analysis-store.ts      # sessionStorage helpers
│   │   └── types.ts                 # AnalysisResult shape
│   ├── components/            # UI (Navbar, Footer, ScoreRing, …)
│   └── integrations/supabase/ # Optional Supabase clients & auth
├── public/
├── vite.config.ts
└── package.json
```

---

## Supported resume formats

| Format | Method |
|--------|--------|
| `.pdf` | PDF.js text-layer extraction |
| `.docx` | Mammoth raw text extraction |
| `.txt`, `.md` | Native browser `File.text()` |
| Paste | Direct textarea input |

**Limitations:** Scanned/image-only PDFs without an embedded text layer may extract little or no text. For those, paste the resume text manually.

Max upload size: **10 MB**.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Privacy

- Resume **files** are parsed in your browser and are not uploaded to any server.
- Only **plain text** (resume + job description) is sent to the Gemini API when you click Analyze.
- Results are stored in **sessionStorage** only — they clear when you close the tab and are not persisted to a database by default.

---

## License

Copyright © 2026 **Aswin Raj**. All rights reserved.

This project is proprietary software. Unauthorized copying, modification, or distribution is not permitted without explicit permission from the author.

---

## Author

**Aswin Raj**

For questions, issues, or licensing inquiries, open an issue on this repository or contact the author directly.
