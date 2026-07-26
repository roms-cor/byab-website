import { siteConfig } from "@content/site.config";

/** Minimal run-book footer — the /why page keeps its own quiet colophon. */
export function WhyFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center bg-white">
      <div className="font-mono text-4xs text-gray-300 uppercase tracking-label">
        © {year} {siteConfig.name}
      </div>
      <div className="font-mono text-4xs text-gray-300 uppercase tracking-label">{siteConfig.locations}</div>
      <a
        href={`mailto:${siteConfig.email}`}
        className="font-mono text-4xs text-muted-foreground hover:text-gray-800 uppercase tracking-label transition-colors"
        data-testid="link-why-footer-email"
      >
        {siteConfig.email}
      </a>
    </footer>
  );
}
