import { useEffect } from "react";
import { Mail } from "lucide-react";
import { siteConfig } from "@content/site.config";

const logoHorizontalWhite = "/images/logo-horizontal-white.webp";

export default function ComingSoon() {
  useEffect(() => {
    document.title = `${siteConfig.name} — Coming Soon`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${siteConfig.name} (${siteConfig.shortName}) — Operations, transformation, and growth consultancy for founders and managing partners since 2005. Our new site is coming soon.`);
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute("content", "index, follow");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <img
        src={logoHorizontalWhite}
        alt={siteConfig.name}
        width={240}
        height={48}
        className="h-10 sm:h-12 w-auto mb-12"
        data-testid="img-coming-soon-logo"
      />

      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground text-center"
        data-testid="text-coming-soon-heading"
      >
        Coming soon
      </h1>

      <p
        className="text-base sm:text-lg mt-4 text-center max-w-md leading-relaxed"
        style={{ color: "hsl(var(--muted-foreground))" }}
        data-testid="text-coming-soon-tagline"
      >
        <strong className="font-semibold text-foreground">{siteConfig.slogan}</strong>, we're building something worth your time.
      </p>

      <a
        href={`mailto:${siteConfig.email}`}
        className="inline-flex items-center gap-2 mt-10 px-5 py-2.5 text-sm font-medium rounded-[10px] transition-opacity duration-150 hover:opacity-70"
        style={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
        data-testid="link-coming-soon-contact"
      >
        <Mail className="w-4 h-4" />
        {siteConfig.email}
      </a>

      <p
        className="text-[11px] mt-16"
        style={{ color: "var(--gray-76)" }}
        data-testid="text-coming-soon-footer"
      >
        Operations, transformation &amp; growth since 2005
        <a 
          href="/home" 
          className="ml-1 opacity-10 underline" 
          style={{ color: "var(--gray-76)" }}
          data-testid="link-hidden-home"
        >
          .
        </a>
      </p>
    </div>
  );
}
