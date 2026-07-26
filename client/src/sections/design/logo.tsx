import { siteConfig } from "@content/site.config";
import { DownloadButton } from "./download-button";

const logoSquareBlack = "/images/logo-square-black.webp";
const logoSquareWhite = "/images/logo-square-white.webp";
const logoHorizontalBlack = "/images/logo-horizontal-black.webp";
const logoHorizontalWhite = "/images/logo-horizontal-white.webp";

export function LogoSection() {
  return (
    <section id="logo" aria-labelledby="logo-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
      <header className="max-w-3xl mb-8 sm:mb-12">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">01</p>
        <h2 id="logo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-logo">
          Logo
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
          Our logo is the cornerstone of the brand identity. Use it consistently across all touchpoints.
        </p>
      </header>

      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Logomark (Square)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <figure className="relative rounded-lg border border-border/50 bg-white p-8 sm:p-12 flex flex-col items-center justify-center min-h-logo-tile sm:min-h-logo-tile-sm gap-4">
          <img src={logoSquareBlack} alt="Logomark on light background" className="h-16 sm:h-20 w-16 sm:w-20" data-testid="img-logo-light" />
          <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-muted-foreground font-medium">Light background</figcaption>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
            <DownloadButton src={logoSquareBlack} filename={`${siteConfig.shortName.toLowerCase()}-logomark-black.png`} />
          </div>
        </figure>
        <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-logo-tile sm:min-h-logo-tile-sm gap-4 bg-foreground">
          <img src={logoSquareWhite} alt="Logomark on dark background" className="h-16 sm:h-20 w-16 sm:w-20" data-testid="img-logo-dark" />
          <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium text-gray-400">Dark background</figcaption>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
            <DownloadButton src={logoSquareWhite} filename={`${siteConfig.shortName.toLowerCase()}-logomark-white.png`} />
          </div>
        </figure>
      </div>

      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Horizontal Logo</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <figure className="relative rounded-lg border border-border/50 bg-white p-8 sm:p-12 flex flex-col items-center justify-center min-h-logo-tile sm:min-h-logo-tile-sm gap-4">
          <img src={logoHorizontalWhite} alt="Horizontal logo on light background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-light" />
          <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-muted-foreground font-medium">Light background</figcaption>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
            <DownloadButton src={logoHorizontalWhite} filename={`${siteConfig.shortName.toLowerCase()}-horizontal-logo-light.png`} />
          </div>
        </figure>
        <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-logo-tile sm:min-h-logo-tile-sm gap-4 bg-foreground">
          <img src={logoHorizontalBlack} alt="Horizontal logo on dark background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-dark" />
          <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium text-gray-400">Dark background</figcaption>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
            <DownloadButton src={logoHorizontalBlack} filename={`${siteConfig.shortName.toLowerCase()}-horizontal-logo-dark.png`} />
          </div>
        </figure>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { icon: "48", title: "Minimum Size", desc: "48px width minimum for digital applications" },
          { icon: "2x", title: "Clear Space", desc: "2x the logomark height around all sides" },
          { icon: "SVG", title: "File Format", desc: "SVG for web, PNG for social and print" },
        ].map((item) => (
          <article key={item.title} className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/50" data-testid={`card-logo-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-3 sm:mb-4" aria-hidden="true">
              <span className="text-xs font-bold text-foreground">{item.icon}</span>
            </div>
            <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
