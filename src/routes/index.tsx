import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Brain, FileSearch, Sparkles, Target, Wand2, FileText,
  CheckCircle2, Zap, Shield, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroOrb from "@/assets/hero-orb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeAI — Beat the ATS, land the interview" },
      { name: "description", content: "AI-powered resume analysis, ATS scoring, smart rewrites, and tailored cover letters in seconds." },
      { property: "og:title", content: "ResumeAI — Beat the ATS" },
      { property: "og:description", content: "Score your resume against any job in seconds." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Target, title: "ATS Match Score", desc: "Instant compatibility score with detailed keyword gap analysis." },
  { icon: Brain, title: "AI Rewrites", desc: "Transform weak bullets into quantified, recruiter-ready impact statements." },
  { icon: FileSearch, title: "Keyword Intelligence", desc: "Surface the exact missing terms hiring systems are screening for." },
  { icon: Wand2, title: "Tailored Summary", desc: "Generate a professional summary that mirrors the role's language." },
  { icon: FileText, title: "Cover Letter Generator", desc: "Personalized, compelling cover letters in one click." },
  { icon: Shield, title: "Private by Design", desc: "Your data never leaves the session. Nothing stored. Nothing shared." },
];

const stats = [
  { value: "98%", label: "ATS detection accuracy" },
  { value: "3.4×", label: "Higher interview rate" },
  { value: "12s", label: "Average analysis time" },
  { value: "50k+", label: "Resumes optimized" },
];

const steps = [
  { n: "01", title: "Drop your resume", desc: "Upload a PDF or DOCX — we extract the text instantly, in your browser." },
  { n: "02", title: "Paste the job", desc: "Add the job description you're targeting. Any role, any industry." },
  { n: "03", title: "Get your edge", desc: "Score, rewrites, keywords, and a cover letter — all in seconds." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Now with GPT-class analysis
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
                Beat the ATS.
                <br />
                <span className="gradient-text">Land the interview.</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                ResumeAI scores your resume against any job description, rewrites weak bullets,
                and generates a tailored cover letter — in seconds.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 px-7 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow text-base">
                  <Link to="/app">
                    Analyze my resume <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-7 glass text-base border-border/60">
                  <a href="#features">See features</a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> No signup required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 100% private</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Free to try</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-[560px] mx-auto">
                <div className="absolute -inset-10 bg-gradient-glow blur-3xl opacity-70 animate-pulse-glow" />
                <img
                  src={heroOrb}
                  alt="AI neural network analyzing a resume"
                  width={1280}
                  height={1280}
                  className="relative rounded-3xl shadow-elegant animate-float"
                />
                <FloatingCard
                  className="absolute -left-4 top-10 md:-left-12"
                  delay={0.6}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">ATS Score</div>
                      <div className="text-lg font-semibold">92<span className="text-sm text-muted-foreground">/100</span></div>
                    </div>
                  </div>
                </FloatingCard>
                <FloatingCard
                  className="absolute -right-2 bottom-10 md:-right-10"
                  delay={1}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Keywords found</div>
                      <div className="text-lg font-semibold">24 of 26</div>
                    </div>
                  </div>
                </FloatingCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="relative border-y border-border/60 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-semibold gradient-primary-text">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Built for modern hiring
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Everything you need to <span className="gradient-text">stand out</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Six AI-powered tools, one unified workflow. From first read to final send.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative rounded-2xl glass p-6 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary/20 border border-primary/20 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">From resume to <span className="gradient-text">ready</span></h2>
          <p className="mt-3 text-muted-foreground text-lg">Three steps. Twelve seconds. Real results.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl glass p-7"
            >
              <div className="text-5xl font-semibold gradient-primary-text/30 opacity-30 mb-2">{s.n}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Your next interview is one <span className="gradient-text">analysis</span> away.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              No accounts. No friction. Just a smarter resume in seconds.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 px-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow text-base">
              <Link to="/app">Launch ResumeAI <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`glass-strong rounded-2xl p-3.5 shadow-elegant animate-float ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}
