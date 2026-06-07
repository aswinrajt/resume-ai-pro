import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { extractTextFromFile } from "@/lib/parse-resume";
import { analyzeResume } from "@/lib/analyze.functions";
import { saveAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Analyze — ResumeAI" },
      { name: "description", content: "Upload your resume and a job description to get an AI ATS score and rewrites." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const navigate = useNavigate();
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10 MB.");
      return;
    }
    setParsing(true);
    setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      if (text.length < 50) {
        toast.error("Couldn't extract enough text from the file.");
        setFileName(null);
      } else {
        setResumeText(text);
        toast.success(`Parsed ${file.name}`);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to read file");
      setFileName(null);
    } finally {
      setParsing(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onAnalyze = async () => {
    if (resumeText.trim().length < 50) {
      toast.error("Please add your resume (upload or paste).");
      return;
    }
    if (jd.trim().length < 30) {
      toast.error("Please paste the job description.");
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeResume({
        data: { resumeText: resumeText.trim(), jobDescription: jd.trim() },
      });
      saveAnalysis({
        result,
        resumeText: resumeText.trim(),
        jobDescription: jd.trim(),
        createdAt: Date.now(),
      });
      navigate({ to: "/results" });
    } catch (e: any) {
      toast.error(e?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 relative">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> AI analysis workspace
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Score your resume against any <span className="gradient-text">job</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
              Upload your resume and paste the job description. We'll do the rest.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Resume upload */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl glass p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Your resume</h2>
                  <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT — up to 10 MB.</p>
                </div>
                {fileName && (
                  <button
                    onClick={() => { setFileName(null); setResumeText(""); }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Clear file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 text-center
                  ${dragOver ? "border-primary bg-primary/5" : "border-border/80 hover:border-primary/50 hover:bg-primary/[0.03]"}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary/15 border border-primary/20 mb-4">
                  {parsing ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  ) : fileName ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Upload className="h-6 w-6 text-primary" />
                  )}
                </div>
                {fileName ? (
                  <div>
                    <div className="font-medium flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {fileName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {resumeText.length.toLocaleString()} characters extracted
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-medium">Drop your resume here</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      or <span className="text-primary">browse files</span>
                    </div>
                  </>
                )}
              </div>

              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or paste text
                <div className="h-px flex-1 bg-border" />
              </div>

              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="min-h-[180px] resize-none bg-background/40 border-border/60 focus-visible:ring-primary/40"
              />
            </motion.section>

            {/* JD */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl glass p-6 flex flex-col"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Job description</h2>
                <p className="text-sm text-muted-foreground">Paste the full posting for the most accurate match.</p>
              </div>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here — responsibilities, requirements, qualifications..."
                className="flex-1 min-h-[420px] resize-none bg-background/40 border-border/60 focus-visible:ring-primary/40"
              />
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {jd.length.toLocaleString()} characters
              </div>
            </motion.section>
          </div>

          {/* Analyze CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-center"
          >
            <Button
              size="lg"
              onClick={onAnalyze}
              disabled={analyzing || parsing}
              className="h-14 px-10 text-base bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow animate-pulse-glow disabled:opacity-60 disabled:animate-none"
            >
              {analyzing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing your resume…</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Analyze Resume</>
              )}
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
