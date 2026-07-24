export interface Engagement {
  title: string;
  category: string;
  year: string;
  description: string;
  outcome: string;
}

export const engagements: Engagement[] = [
  {
    title: "B2B SaaS Scale-Up",
    category: "Growth Engineering",
    year: "2025",
    description:
      "ICP definition, outbound infrastructure design, acquisition funnel architecture, and sales pipeline metrics for a French B2B SaaS company moving from founder-led sales to systematic, repeatable growth.",
    outcome: "Pipeline engineered",
  },
  {
    title: "National Law Firm",
    category: "Operations Restructuring",
    year: "2024",
    description:
      "Full operational overhaul of a multi-office French law firm: general secretariat rebuild, financial reporting automation, ISO compliance processes, and HR documentation — all rebuilt from scratch by Because You Are Busy.",
    outcome: "Operations rebuilt",
  },
  {
    title: "Tech PME",
    category: "Transformation & Data",
    year: "2025",
    description:
      "Information systems architecture review, data governance framework design, and operational dashboard deployment for a growing French tech SME — operational chaos transformed into decision-ready visibility.",
    outcome: "Visibility restored",
  },
];
