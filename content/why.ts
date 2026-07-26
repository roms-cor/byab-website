/**
 * /why page content — single source of truth for every string that exists
 * only on the /why landing page (blueprint-structured conversion page).
 *
 * Shared collections (stats, pain points, engagements, testimonial, FAQ)
 * are NOT duplicated here — the page imports them from their own content
 * files, so editing content/stats.ts (etc.) updates /why automatically.
 *
 * Consumed by:
 *   - client/src/pages/why.tsx + client/src/sections/why/* (visible page)
 *   - script/meta-tokens.ts → WHY_* tokens for client/why/index.html.template
 *   - script/validate-seo.ts → prerender needles for dist/public/why/index.html
 *
 * Keep this file plain TypeScript (no JSX) — build scripts import it under
 * tsx. Keep seo.title/seo.description free of double quotes: they are
 * inlined into the WebPage JSON-LD of the /why head template.
 */
import { siteConfig } from "./site.config";

export interface WhyStep {
  step: string;
  title: string;
  text: string;
}

export interface WhyBenefit {
  title: string;
  text: string;
}

const foundingYear = siteConfig.foundingDate.slice(0, 4);

export const whyContent = {
  seo: {
    /** <title> + og:title of /why (must differ from siteConfig.title) */
    title: `Why ${siteConfig.name} — How We Take Work Off Your Desk`,
    /** Meta description of /why (must differ from siteConfig.description) */
    description: `The problem we remove, how the engagement works in three steps, and the model behind it: senior operators running operations, transformation and growth since ${foundingYear} — no juniors, no vendors, no investors.`,
    /** Breadcrumb + internal-link label */
    breadcrumbLabel: "Why us",
  },

  hero: {
    kicker: `Since ${foundingYear} — Operations · Transformation · Growth`,
    heading: "We run what you can't get to anymore.",
    description: `${siteConfig.slogan}, we take operations, transformation, and growth off the executive desk and run them — so your time goes to the decisions only a CEO or COO can make.`,
    ctaLabel: "Take work off my desk",
    volumeLine: "Vol. 01 — Executive Operations Manual",
  },

  /** Decorative operations-console motif next to the hero (proof visual). */
  console: {
    title: "System.OpStatus",
    statusLabel: "Active",
    uptimeValue: "99.9%",
    uptimeLabel: "Execution Uptime",
    gauges: [
      { label: "Q3 Forecast", value: "Predictable" },
      { label: "Data Governance", value: "Secured" },
    ],
    terminalLines: [
      "> Initiating general secretariat rebuild...",
      "> Financial reporting: AUTOMATED",
      "> HR documentation: COMPLIANT",
    ],
  },

  problem: {
    part: "01",
    partTitle: "The Problem",
    heading: "The company grew. The load landed on you.",
    whyAloneLead: "Why it can't be fixed alone:",
    whyAloneText:
      "Hiring your way out means headcount, management time, and months of ramp-up — and one hire never covers finance, compliance, data, and growth at once.",
  },

  how: {
    part: "02",
    partTitle: "How It Works",
    heading: "Three steps, and it's off your desk.",
    steps: [
      {
        step: "01",
        title: "We diagnose the load",
        text: "We map what's on your desk that shouldn't be — back-office, systems, pipeline — and what it's costing you.",
      },
      {
        step: "02",
        title: "Senior operators take it over",
        text: "The same four senior people run your back-office, reporting, and outbound end to end. No juniors ever touch your files.",
      },
      {
        step: "03",
        title: "You steer on numbers you trust",
        text: "One trusted version of your operating numbers, decision-ready dashboards, and a pipeline you can forecast, quarter after quarter.",
      },
    ] satisfies WhyStep[],
  },

  model: {
    part: "03",
    partTitle: "The Model",
    heading: "No juniors. No vendors. No investors.",
    advantagePrefix: "Advantage",
    benefits: [
      {
        title: "Senior operators only",
        text: "Every engagement is handled by founders and senior operators directly — no juniors, no rotating staff. The same four people handle your numbers and your files.",
      },
      {
        title: "Three disciplines, one roof",
        text: "Operations, transformation & data, and growth engineering from day one — zero vendors to coordinate.",
      },
      {
        title: "Self-funded independence",
        text: `57% operating profitability, 0€ external debt ever. We run our own business the way we run yours.`,
      },
      {
        title: "We operate, we don't advise",
        text: "The work gets done and stays off your desk — it doesn't come back as a 200-page report of recommendations to implement.",
      },
    ] satisfies WhyBenefit[],
  },

  track: {
    part: "04",
    partTitle: "Track Record",
    heading: "Three engagements. Three results.",
  },

  finalCta: {
    heading: "Let's take something off your desk.",
    description: `${siteConfig.slogan}, we'll take it from here. Tell us what's consuming your time and you'll hear back from a senior operator within 24h — in confidence.`,
    ctaLabel: "Take work off my desk",
    emailLabel: "Email",
    basedInLabel: "Based in",
  },

  appendix: {
    part: "05",
    partTitle: "Appendix",
    heading: "Not ready to hand anything over yet?",
    /**
     * Which content/faq.ts entries appear in the objections accordion
     * (0-based indexes into `resolvedFaq`): differentiation, why externalize,
     * track record. Out-of-range indexes are skipped gracefully.
     */
    faqIndexes: [6, 7, 4],
    capture: {
      title: "Leave your email",
      subtitle: "An occasional short note from a senior operator. No pitch.",
      placeholder: "name@domain.com",
      buttonLabel: "Subscribe",
      mailtoSubject: "Keep me posted",
    },
  },
} as const;
