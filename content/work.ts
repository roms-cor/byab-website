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
      "ICP definition, outbound infrastructure design, acquisition funnel architecture, and sales pipeline metrics for a French B2B SaaS company — moving the CEO from founder-led sales to a commercial machine the company owns and can forecast.",
    outcome: "Pipeline engineered",
  },
  {
    title: "National Law Firm",
    category: "Operations Restructuring",
    year: "2024",
    description:
      "Full operational overhaul of a multi-office French law firm: general secretariat rebuild, financial reporting automation, ISO compliance processes, and HR documentation — partners' time returned to clients while Because You Are Busy rebuilt and ran the rest.",
    outcome: "Operations rebuilt",
  },
  {
    title: "Tech PME",
    category: "Transformation & Data",
    year: "2025",
    description:
      "Information systems architecture review, data governance framework design, and operational dashboard deployment for a growing French tech SME — leadership went from operational chaos to steering on numbers they trust.",
    outcome: "Visibility restored",
  },
];
