import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      <span className="text-lg font-semibold tracking-tight">
        Resume<span className="gradient-primary-text">AI</span>
      </span>
    </Link>
  );
}
