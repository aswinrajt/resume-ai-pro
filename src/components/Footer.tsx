export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ResumeAI. Crafted for ambitious careers.</p>
        <p>Powered by Lovable AI · Built with care</p>
      </div>
    </footer>
  );
}
