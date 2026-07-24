import { useEffect, useState } from "react";
import { siteConfig } from "@content/site.config";
import { resolveTokenTexts } from "@/sections/design/tokens";
import { navSections, SideNav } from "@/sections/design/side-nav";
import { OverviewSection } from "@/sections/design/overview";
import { LogoSection } from "@/sections/design/logo";
import { ColorsSection } from "@/sections/design/colors";
import { TypographySection } from "@/sections/design/typography";
import { SpacingSection } from "@/sections/design/spacing";
import { UiComponentsSection } from "@/sections/design/ui-components";
import { SiteSectionsSection } from "@/sections/design/site-sections";
import { GuidelinesSection } from "@/sections/design/guidelines";

const logoHorizontalWhite = "/images/logo-horizontal-white.webp";
const logoHorizontalBlack = "/images/logo-horizontal-black.webp";

/**
 * Design-system reference page (/design) — assembles the blocks in
 * @/sections/design. Client-only: lazy-loaded by the router and never
 * prerendered, so design tokens are resolved from computed styles at mount.
 */
export default function Components() {
  const [activeSection, setActiveSection] = useState("overview");
  // Resolved once on mount — this page is client-only (never prerendered).
  const [tok] = useState(resolveTokenTexts);

  useEffect(() => {
    document.title = `Design System — ${siteConfig.name}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = siteConfig.title;
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    navSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl" role="banner">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center" data-testid="link-home">
            <img src={logoHorizontalWhite} alt={siteConfig.title} width={200} height={40} className="h-8 w-auto" />
          </a>
          <nav className="flex items-center gap-1" aria-label="Page navigation">
            <a
              href="/"
              data-testid="link-back-home"
              className="px-3 py-1.5 text-sm text-muted-foreground rounded-md transition-colors duration-150"
            >
              ← Back to site
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-container-wide mx-auto flex">
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-10 pl-4 sm:pl-6 lg:pl-8 pr-4">
          <SideNav activeSection={activeSection} />
        </aside>

        <main className="flex-1 min-w-0" role="main">
          <OverviewSection />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <LogoSection />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <ColorsSection tok={tok} />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <TypographySection />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <SpacingSection />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <UiComponentsSection tok={tok} />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <SiteSectionsSection tok={tok} />
          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />
          <GuidelinesSection tok={tok} />

          <footer className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 border-t border-border/50" role="contentinfo">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={logoHorizontalBlack} alt="" width={150} height={30} loading="lazy" decoding="async" className="h-6 w-auto rounded-sm bg-foreground p-1" />
                <p className="text-xs text-muted-foreground">Design System v1.0</p>
              </div>
              <p className="text-xs text-muted-foreground" data-testid="text-footer-updated">
                {siteConfig.title}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
