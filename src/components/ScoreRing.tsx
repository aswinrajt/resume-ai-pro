import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, clamped, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [clamped, count]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  const colorFrom = clamped >= 80 ? "oklch(0.72 0.18 160)" : clamped >= 60 ? "oklch(0.78 0.16 220)" : "oklch(0.80 0.16 75)";
  const colorTo = clamped >= 80 ? "oklch(0.78 0.16 220)" : clamped >= 60 ? "oklch(0.70 0.22 290)" : "oklch(0.65 0.24 25)";

  const label = clamped >= 85 ? "Excellent" : clamped >= 70 ? "Strong" : clamped >= 50 ? "Needs work" : "Low match";

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: `radial-gradient(circle, ${colorFrom}, transparent 70%)` }} />
      <svg width="220" height="220" viewBox="0 0 220 220" className="relative -rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={radius} stroke="oklch(1 0 0 / 0.08)" strokeWidth="14" fill="none" />
        <motion.circle
          cx="110" cy="110" r={radius}
          stroke="url(#ring-grad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-6xl font-semibold tracking-tight gradient-text">
          {rounded}
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</span>
      </div>
    </div>
  );
}
