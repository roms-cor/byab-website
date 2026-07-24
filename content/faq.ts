/**
 * Frequently Asked Questions — single source of truth.
 *
 * Used by script/meta-tokens.ts to generate:
 *   - the FAQPage JSON-LD block in client/index.html
 *   - the "Frequently Asked Questions" sections of llms.txt and llms-full.txt
 *
 * Questions and answers may contain {{TOKENS}} from site.config
 * ({{SITE_NAME}}, {{SITE_SHORT_NAME}}, {{SITE_ADDRESS_FULL}}, {{BUILD_YEAR}}…)
 * plus {{SERVICES_INLINE}}, which is composed automatically from
 * content/services.ts so the services answer can never go stale.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "What is {{SITE_NAME}}?",
    answer:
      "{{SITE_NAME}} ({{SITE_SHORT_NAME}}) is an operations, transformation, and growth consultancy founded in April 2005 by Cécile Noiriel in France. We help founders and managing partners who are too busy to handle everything themselves by externalizing their back-office, rebuilding their systems, and engineering predictable B2B revenue growth. As of {{BUILD_YEAR}}, the team is four senior operators: Cécile Noiriel (founder, 2005), Anne Grosz (operations, 2015), Georges Grosz (transformation & data, co-manager since July 2025), and Romain Cornu (growth engine, 2025–2026).",
  },
  {
    question: "What services does {{SITE_NAME}} offer?",
    answer: "{{SITE_NAME}} offers four core services: {{SERVICES_INLINE}}",
  },
  {
    question: "Who founded {{SITE_NAME}}?",
    answer:
      "{{SITE_NAME}} was originally founded on April 1, 2005 by Cécile Noiriel as B Y A B (SIREN 481 631 471). In November 2015, Anne Grosz created the second {{SITE_NAME}} entity (SIREN 814 783 056), specializing in externalized general secretariat for law firms and SMEs. Georges Grosz joined as co-manager in July 2025 (22+ years at CGI, professor at Université Paris 1 Panthéon-Sorbonne), and Romain Cornu joined in 2025–2026 as growth engine (ex-MerciApp, Clovis, Datananas).",
  },
  {
    question: "Where is {{SITE_NAME}} located?",
    answer:
      "{{SITE_NAME}} is based at {{SITE_ADDRESS_FULL}}, and operates across {{SITE_LOCATIONS}}. The team works with founders and managing partners across France, primarily in legal practices, B2B SaaS companies, and tech SMEs.",
  },
  {
    question: "How long has {{SITE_NAME}} been operating, and what is its track record?",
    answer:
      "{{SITE_NAME}} has been serving founders and managing partners since April 2005 — over 20 years of continuous, uninterrupted operation. In that time: 57% operating profitability, 0€ external debt raised ever, revenue around 130,000€ at peak. Recent engagements include a French B2B SaaS scale-up (growth engineering, 2025), a national law firm (operations restructuring, 2024), and a tech SME (transformation & data, 2025). A proven model, not a startup experiment.",
  },
  {
    question: "What types of clients does {{SITE_NAME}} serve?",
    answer:
      "{{SITE_NAME}} works with founders, managing partners, CEOs, and law firm partners who are scaling their business but can't handle everything alone. Clients range from French B2B SaaS companies and tech SMEs to national law firms and professional services practices.",
  },
  {
    question: "How is {{SITE_NAME}} different from freelancers or large consulting firms?",
    answer:
      "{{SITE_NAME}} is neither. It is a senior, multi-disciplinary team of four that embeds into client operations. No juniors on client work — every engagement is handled by founders and senior operators directly. No 200-page reports that collect dust. {{SITE_NAME}} operates: it doesn't just advise. Self-funded since 2005, 57% profitability, 0€ debt. The craft model, chosen deliberately.",
  },
];
