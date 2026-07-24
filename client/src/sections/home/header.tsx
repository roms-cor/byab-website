import { Menu, X } from "lucide-react";
import { siteConfig } from "@content/site.config";
import { useMobileNav } from "@/hooks/use-mobile-nav";

const logoHorizontalWhite = "/images/logo-horizontal-white.webp";

export function Header() {
  const navItems = [
    { label: "Services", href: "#services", title: "Our four service pillars: operations, transformation, data, and growth" },
    { label: "Track Record", href: "#work", title: "Recent client engagements and outcomes" },
    { label: "Team", href: "#team", title: "Meet our team of four specialists" },
    { label: "Story", href: "#story", title: "Our history from 2005 to today" },
    { label: "Contact", href: "#contact", title: "Get in touch — email, locations, and contact form" },
  ];

  const { mobileOpen, toggle, closeAndRestoreFocus, menuRef, triggerRef } = useMobileNav();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" role="banner">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-header flex items-center justify-between">
        <a href="/" aria-label="Home" data-testid="link-logo-home">
          <img src={logoHorizontalWhite} alt={siteConfig.title} width={240} height={48} className="h-[38px] w-auto" {...{fetchpriority: "high"} as any} data-testid="img-logo-header" />
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  title={item.title}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm transition-opacity duration-150 text-muted-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            title="Get in touch — email, locations, and contact form"
            data-testid="button-header-cta"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full transition-opacity duration-150 bg-foreground text-background"
          >
            Get in touch
          </a>
          <button
            ref={triggerRef}
            onClick={toggle}
            className="md:hidden flex items-center justify-center w-10 h-10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav ref={menuRef} id="mobile-nav" className="md:hidden absolute top-header left-0 right-0 bg-white border-t border-border/50 shadow-lg" aria-label="Mobile navigation">
          <ul className="flex flex-col py-4 px-4 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  title={item.title}
                  onClick={closeAndRestoreFocus}
                  data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="block py-3 text-base font-medium transition-opacity duration-150 text-gray-700"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-3 mt-1 border-t border-border/50">
              <a
                href="#contact"
                onClick={closeAndRestoreFocus}
                data-testid="button-mobile-cta"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-medium rounded-full transition-opacity duration-150 bg-foreground text-background"
              >
                Get in touch
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
