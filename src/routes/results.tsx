import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, XCircle, TrendingUp, Lightbulb, Target,
  Sparkles, FileDown, FileText, Wand2, Mail, Zap, ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreRing } from "@/components/ScoreRing";
import { CopyButton } from "@/components/CopyButton";
import { loadAnalysis, type StoredAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — ResumeAI" },
      { name: "description", content: "Your AI-powered resume analysis and ATS optimization report." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<StoredAnalysis | null>(null);

  useEffect(() => {
    const d = loadAnalysis();
    if (!d) {
      navigate({ to: "/app" });
      return;
    }
    setData(d);
  }, [navigate]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const r = data.result;

  const reportText = buildReport(r);

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumeai-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
              <Link to="/app"><ArrowLeft className="mr-1.5 h-4 w-4" /> New analysis</Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadReport} className="glass border-border/60">
                <FileDown className="mr-1.5 h-3.5 w-3.5" /> Download report
              </Button>
            </div>
          </div>

          {/* Hero: Score + summary */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-60 pointer-events-none" />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
              <ScoreRing score={r.matchScore} />
              <div>
                <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> ATS Match Analysis
                </div>
                <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">
                  Your resume is <span className="gradient-text">{label(r.matchScore)}</span> for this role
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
                  {r.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Stat icon={CheckCircle2} value={r.matchedSkills.length} label="matched skills" color="success" />
                  <Stat icon={XCircle} value={r.missingKeywords.length} label="missing keywords" color="warning" />
                  <Stat icon={Wand2} value={r.rewrittenBullets.length} label="AI rewrites" color="primary" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tabs */}
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="glass border border-border/60 h-auto p-1 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"><Lightbulb className="h-3.5 w-3.5 mr-1.5" />Insights</TabsTrigger>
              <TabsTrigger value="keywords" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"><Target className="h-3.5 w-3.5 mr-1.5" />Keywords</TabsTrigger>
              <TabsTrigger value="rewrite" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"><Wand2 className="h-3.5 w-3.5 mr-1.5" />Rewrite</TabsTrigger>
              <TabsTrigger value="cover" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"><Mail className="h-3.5 w-3.5 mr-1.5" />Cover letter</TabsTrigger>
            </TabsList>

            {/* INSIGHTS */}
            <TabsContent value="insights" className="mt-6 grid lg:grid-cols-2 gap-5">
              <Panel icon={TrendingUp} title="Strengths" tone="success">
                <ul className="space-y-3">
                  {r.strengths.map((s, i) => (
                    <Item key={i} variant="success">{s}</Item>
                  ))}
                </ul>
              </Panel>
              <Panel icon={Lightbulb} title="Improvement opportunities" tone="warning">
                <ul className="space-y-3">
                  {r.improvements.map((s, i) => (
                    <Item key={i} variant="warning">{s}</Item>
                  ))}
                </ul>
              </Panel>
              <Panel icon={ShieldCheck} title="ATS optimization tips" tone="accent">
                <ul className="space-y-3">
                  {r.atsOptimizationTips.map((s, i) => (
                    <Item key={i} variant="accent">{s}</Item>
                  ))}
                </ul>
              </Panel>
              <Panel icon={Zap} title="Strategic recommendations" tone="primary">
                <ul className="space-y-3">
                  {r.recommendations.map((s, i) => (
                    <Item key={i} variant="primary">{s}</Item>
                  ))}
                </ul>
              </Panel>
            </TabsContent>

            {/* KEYWORDS */}
            <TabsContent value="keywords" className="mt-6 grid lg:grid-cols-2 gap-5">
              <Panel icon={CheckCircle2} title="Matched skills" tone="success" count={r.matchedSkills.length}>
                <div className="flex flex-wrap gap-2">
                  {r.matchedSkills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/25 text-success px-3 py-1 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
              </Panel>
              <Panel icon={XCircle} title="Missing keywords" tone="warning" count={r.missingKeywords.length}>
                <div className="flex flex-wrap gap-2">
                  {r.missingKeywords.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/30 text-warning px-3 py-1 text-xs font-medium">
                      <XCircle className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Adding these (truthfully) to your resume will lift your ATS score significantly.
                </div>
              </Panel>
            </TabsContent>

            {/* REWRITE */}
            <TabsContent value="rewrite" className="mt-6 space-y-5">
              <Panel icon={FileText} title="AI-tailored professional summary" tone="primary" action={<CopyButton text={r.professionalSummary} />}>
                <p className="text-foreground/90 leading-relaxed">{r.professionalSummary}</p>
              </Panel>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" /> Bullet point rewrites
                </h3>
                {r.rewrittenBullets.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="grid md:grid-cols-2 gap-3 rounded-2xl glass p-4 md:p-5"
                  >
                    <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-destructive/80" /> Original
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{b.original}</p>
                    </div>
                    <div className="rounded-xl bg-success/5 border border-success/20 p-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-success" /> AI-optimized
                        </div>
                        <CopyButton text={b.improved} />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{b.improved}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* COVER LETTER */}
            <TabsContent value="cover" className="mt-6">
              <Panel icon={Mail} title="Personalized cover letter" tone="accent" action={<CopyButton text={r.coverLetter} label="Copy letter" />}>
                <article className="prose prose-invert max-w-none">
                  {r.coverLetter.split(/\n\n+/).map((p, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{p}</p>
                  ))}
                </article>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function label(score: number) {
  if (score >= 85) return "exceptionally aligned";
  if (score >= 70) return "well aligned";
  if (score >= 50) return "partially aligned";
  return "underprepared";
}

function Stat({ icon: Icon, value, label, color }: { icon: any; value: number | string; label: string; color: "success" | "warning" | "primary" }) {
  const map: Record<string, string> = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/25",
    primary: "bg-primary/10 text-primary border-primary/25",
  };
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${map[color]}`}>
      <Icon className="h-4 w-4" />
      <span className="font-semibold">{value}</span>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}

function Panel({
  icon: Icon, title, children, tone = "primary", count, action,
}: {
  icon: any; title: string; children: React.ReactNode;
  tone?: "primary" | "accent" | "success" | "warning"; count?: number; action?: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl glass p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${toneMap[tone]}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-base font-semibold">
            {title}{typeof count === "number" && <span className="ml-2 text-muted-foreground text-sm font-normal">({count})</span>}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function Item({ children, variant }: { children: React.ReactNode; variant: "success" | "warning" | "accent" | "primary" }) {
  const dotMap: Record<string, string> = {
    success: "bg-success",
    warning: "bg-warning",
    accent: "bg-accent",
    primary: "bg-primary",
  };
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-foreground/90">
      <span className={`mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 ${dotMap[variant]}`} />
      <span>{children}</span>
    </li>
  );
}

function buildReport(r: any): string {
  return `ResumeAI Report
================
Match score: ${r.matchScore}/100

Summary
-------
${r.summary}

Matched skills
--------------
${r.matchedSkills.map((s: string) => `• ${s}`).join("\n")}

Missing keywords
----------------
${r.missingKeywords.map((s: string) => `• ${s}`).join("\n")}

Strengths
---------
${r.strengths.map((s: string) => `• ${s}`).join("\n")}

Improvement opportunities
-------------------------
${r.improvements.map((s: string) => `• ${s}`).join("\n")}

ATS optimization tips
---------------------
${r.atsOptimizationTips.map((s: string) => `• ${s}`).join("\n")}

Strategic recommendations
-------------------------
${r.recommendations.map((s: string) => `• ${s}`).join("\n")}

Tailored professional summary
-----------------------------
${r.professionalSummary}

Bullet rewrites
---------------
${r.rewrittenBullets.map((b: any, i: number) => `${i + 1}. Original: ${b.original}\n   Improved: ${b.improved}`).join("\n\n")}

Cover letter
------------
${r.coverLetter}
`;
}
