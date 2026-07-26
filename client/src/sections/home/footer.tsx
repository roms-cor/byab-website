declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __GIT_COMMIT_DATE__: string;

import { Link } from "wouter";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { siteConfig } from "@content/site.config";
import { teamMembers } from "@content/team";
import { companies } from "@content/companies";

const logoHorizontalWhite = "/images/logo-horizontal-white.webp";

export function Footer() {
  const footerNav = [
    { label: "Services", href: "#services" },
    { label: "Team", href: "#team" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ];

  const people = teamMembers.map((m) => ({
    name: m.name,
    role: m.footerRole ?? m.role,
    linkedin: m.linkedin,
  }));

  return (
    <footer className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-border/50" role="contentinfo">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <div>
            <img src={logoHorizontalWhite} alt={`${siteConfig.name} logo`} width={140} height={28} loading="lazy" decoding="async" className="h-7 w-auto mb-4" data-testid="img-footer-logo" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Operations, transformation & growth consultancy for CEOs, COOs, founders & managing partners since 2005.
            </p>
            <ul className="mt-4 space-y-2 list-none m-0 p-0">
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3 flex-shrink-0 text-gray-450" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-xs transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                  data-testid="link-footer-email"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3 h-3 flex-shrink-0 text-gray-450" aria-hidden="true" />
                <span className="text-xs text-muted-foreground" data-testid="text-footer-locations">{siteConfig.locations}</span>
              </li>
            </ul>
            <ul className="mt-3 space-y-1 list-none m-0 p-0">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                    data-testid={`link-footer-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/why"
                  className="text-xs flex items-center gap-1 transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                  data-testid="link-footer-why"
                >
                  Why us <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link
                  href="/design"
                  className="text-xs flex items-center gap-1 transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                  data-testid="link-footer-design"
                >
                  Design <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-label font-semibold text-foreground mb-3">People</p>
            <ul className="space-y-3 list-none m-0 p-0">
              {people.map((person) => {
                const first = person.name.split(" ")[0].toLowerCase();
                return (
                  <li key={person.name}>
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-foreground flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-70"
                      data-testid={`link-footer-person-${first}`}
                    >
                      <SiLinkedin className="w-3 h-3 flex-shrink-0 text-gray-450" aria-hidden="true" />
                      {person.name}
                    </a>
                    <p className="text-2xs mt-0.5 pl-[18px] text-gray-450">{person.role}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-label font-semibold text-foreground mb-3">Companies</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {companies.map((company) => (
                <div key={company.siren}>
                  <p className="text-xs font-medium text-foreground" data-testid={`text-footer-company-${company.siren.replace(/\s/g, "")}`}>
                    {company.name}
                  </p>
                  <p className="text-2xs mt-0.5 text-gray-450">
                    SIREN {company.siren} · Founded {company.founded}
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-2 list-none m-0 p-0">
                    {company.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${company.name} on ${link.label}`}
                          className="text-2xs underline transition-opacity duration-150 hover:opacity-70 text-gray-450"
                          data-testid={`link-footer-registry-${company.siren.replace(/\s/g, "")}-${link.label.toLowerCase().replace(/[.\s]/g, "-")}`}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-2xs text-gray-450">
            © 2026 <span itemScope itemType="https://schema.org/Organization"><span itemProp="name">{siteConfig.name}</span></span>. All rights reserved.
          </p>
          <p className="text-3xs hidden sm:block text-gray-250" data-testid="text-footer-version">
            v{__APP_VERSION__} · Published {new Date(__BUILD_DATE__).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} {new Date(__BUILD_DATE__).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} · Commit {__GIT_COMMIT_DATE__ ? `${new Date(__GIT_COMMIT_DATE__).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${new Date(__GIT_COMMIT_DATE__).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}` : "—"}
          </p>
          <p className="text-2xs text-gray-450" data-testid="text-footer-address">
            {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
