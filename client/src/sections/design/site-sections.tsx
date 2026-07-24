import { useMemo } from "react";
import { siteConfig } from "@content/site.config";
import { teamMembers } from "@content/team";
import { engagements } from "@content/work";
import { testimonial } from "@content/testimonial";
import type { TokenText } from "./tokens";

const teamList = teamMembers.map((m) => `${m.name} (${m.role})`).join(", ");
const engagementList = engagements.map((e) => `${e.title} / ${e.outcome}`).join(", ");

const makeSiteSections = (t: TokenText) => [
  { id: "header", name: "Header", description: `Fixed navigation bar with ${siteConfig.name} logo, anchor links (Services, Track Record, Team, Story, Contact), and primary CTA 'Get in touch'.`, tokens: `bg: Background / backdrop-blur, text: Link (${t.gray500}), CTA: Accent (${t.gray900})` },
  { id: "hero", name: "Hero", description: "Full-width intro with an eyebrow label, display heading, subtitle, primary + secondary CTAs, a proof stats row of key brand metrics, and TeamSlider carousel on right.", tokens: `heading: Text Primary, accent word: ${t.gray450}, buttons: Accent + ${t.gray50}, proof stats: font-mono ${t.gray500}` },
  { id: "marquee", name: "Marquee", description: "Infinite horizontal scroll of expertise keywords with alternating bold/normal pattern.", tokens: `bold text: ${t.gray500}, normal text: ${t.gray450}, border: Gray 100` },
  { id: "pain", name: "Pain Recognition", description: "Dark section with a provocative heading and 3 numbered pain points, each with a bold lead phrase followed by supporting body copy.", tokens: `bg: Accent (${t.gray900}), heading: ${t.white}, accent word: ${t.gray350}, numbers: ${t.gray500} font-mono, body: ${t.whiteA85}, bold: ${t.white}` },
  { id: "services", name: "Services", description: "Section heading with a CTA link, above a 2×2 grid of service cards. Each card has a number, title, description, and an outcome list with → prefix items in mono font.", tokens: `card bg: Gray 50, number: ${t.gray450}, text: Link (${t.gray500}), outcomes: ${t.gray500} font-mono` },
  { id: "stats", name: "Stats", description: `Dark panel with '${siteConfig.name} — by the numbers' label. 4 metrics with yellow accent suffixes (${t.yellow}). Each stat has a descriptive label and a supporting subtitle.`, tokens: `panel bg: Accent (${t.gray900}), values: ${t.white}, suffixes: ${t.yellow}, labels: ${t.whiteA50}, subs: ${t.whiteA25} font-mono` },
  { id: "work", name: "Engagements", description: `Heading 'Recent engagements.' Engagement rows with category (mono), title, description, year, and outcome badge (yellow bg ${t.yellow}): ${engagementList}. Sourced from content/work.ts.`, tokens: `category: ${t.gray500} font-mono, description: ${t.gray500}, year: ${t.gray450}, badge bg: ${t.yellow}, badge text: ${t.gray900}` },
  { id: "approach", name: "About / Approach", description: `Background ${t.gray50}. Two-column layout: a positioning heading with body text on the left, and 3 named pillars with bullet dots and one-line descriptions on the right.`, tokens: `bg: Gray 50 (${t.gray50}), pillar bullets: ${t.gray900}, pillar names: font-semibold, pillar desc: ${t.gray500}, borders: ${t.gray225}` },
  { id: "team", name: "Team", description: `Heading 'Our team.' with an intro line, then a 2×2 grid of team cards: ${teamList}. Each card has photo, name, role, bio, LinkedIn link. Sourced from content/team.ts.`, tokens: `card bg: Gray 50, name: Text Primary, role: ${t.gray450}, bio: ${t.gray500}, photo border: ${t.gray100}` },
  { id: "story", name: "Story", description: `Background ${t.gray50}. Company history timeline of dated phases, each with a year, heading, and body copy containing external backlinks (company registries, LinkedIn profiles, partner sites). Closes with a brand promise quote on a dark panel.`, tokens: `bg: Gray 50 (${t.gray50}), year: Text Primary font-mono, text: Link (${t.gray500}), links: Text Primary underline, promise panel: Accent (${t.gray900}) bg, ${t.white} text, credits: ${t.gray350}` },
  { id: "testimonial", name: "Testimonial", description: `Centered blockquote: '${testimonial.quote}' — ${testimonial.author}, ${testimonial.role}. Sourced from content/testimonial.ts.`, tokens: `avatar bg: Primary (${t.gray300}), avatar text: Text Primary` },
  { id: "contact", name: "Contact", description: `Background ${t.gray50}. Two-column layout with a section heading (accent word ${t.gray450}), styled contact details with mono labels (Email, Based in), and a response-time promise. Form with Name, Email, message textarea, and submit button.`, tokens: `bg: Gray 50 (${t.gray50}), labels: ${t.gray500} font-mono, inputs: default border/bg, submit: Accent (${t.gray900})` },
  { id: "footer", name: "Footer", description: `4-column grid: logo + tagline + email/location + nav links, People (${teamMembers.map((m) => m.name).join(", ")} — all with LinkedIn), Companies (legal entities with registry links). Bottom bar: copyright, version/publish/commit timestamps, address.`, tokens: `text: Link (${t.gray500}), company SIREN: ${t.gray450}, registry links: ${t.gray450} underline, version: ${t.gray250}` },
];

export function SiteSectionsSection({ tok }: { tok: TokenText }) {
  const siteSections = useMemo(() => makeSiteSections(tok), [tok]);

  return (
    <section id="sections" aria-labelledby="sections-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
      <header className="max-w-3xl mb-8 sm:mb-12">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">06</p>
        <h2 id="sections-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-sections">
          Site Sections
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
          Every section available on the site, with its purpose, structure, and the design tokens it uses.
          This is the definitive reference for building and extending pages.
        </p>
      </header>

      <div className="space-y-0 border-t border-border/50">
        {siteSections.map((section, i) => (
          <article
            key={section.id}
            className="border-b border-border/50 py-5 sm:py-6"
            data-testid={`section-ref-${section.id}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                <span className="text-xs font-mono text-gray-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">{section.name}</h3>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                <p className="text-xs font-mono mt-2 text-gray-400">{section.tokens}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
        <h3 className="text-sm font-semibold text-foreground mb-3">Page Structure</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The homepage follows this exact section order. All sections are wrapped in semantic HTML5 elements
          with proper heading hierarchy (h1 in Hero, h2 per section, h3 for sub-items).
        </p>
        <div className="flex flex-wrap gap-2">
          {siteSections.map((section) => (
            <span
              key={section.id}
              className="text-xs font-mono px-2.5 py-1 rounded-md bg-gray-100 text-muted-foreground"
            >
              {section.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
