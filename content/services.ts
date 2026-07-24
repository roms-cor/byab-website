export interface Service {
  num: string;
  title: string;
  description: string;
  outcomes: string[];
}

export const services: Service[] = [
  {
    num: "01",
    title: "Operational Backbone",
    description:
      "Because You Are Busy externalizes your entire back-office — general secretariat, admin, finance, and compliance — so founders and managing partners stop drowning in operational detail and start leading. Run by a team with 20+ years of law firm and SME operational experience.",
    outcomes: [
      "General secretariat & admin management",
      "Accounting, treasury & financial reporting",
      "HR, legal documentation & ISO compliance",
      "Designed for law firms, SMEs & scaling founders",
    ],
  },
  {
    num: "02",
    title: "Transformation & Data",
    description:
      "Because You Are Busy rebuilds the systems layer — architecture, project governance, and data strategy — that transforms operational chaos into measurable clarity. Anchored in 22+ years of CGI systems consulting and academic expertise at Université Paris 1 Panthéon-Sorbonne.",
    outcomes: [
      "Systems architecture & tech governance",
      "Data strategy & operational dashboards",
      "Project management & transformation roadmaps",
      "Business analysis & decision enablement",
    ],
  },
  {
    num: "03",
    title: "Growth Engine",
    description:
      "Because You Are Busy engineers your full commercial pipeline — ICP definition, outbound sequences, acquisition funnels, and revenue metrics — so growth becomes systematic, not a function of effort or luck. Built on proven playbooks from MerciApp, Clovis, and Datananas.",
    outcomes: [
      "Outbound sequence design & automation",
      "Acquisition funnel architecture",
      "Sales process structuring & CRM ops",
      "ICP definition & go-to-market strategy",
    ],
  },
  {
    num: "04",
    title: "Legal Practice Ops",
    description:
      "Because You Are Busy provides purpose-built operational support for law firms where precision is non-negotiable. Born from Anne Grosz's 8 years as Secretary General at Vatier & Associés, this service handles everything partners shouldn't have to: admin, finance, compliance, and client file management.",
    outcomes: [
      "Partner-facing general secretariat",
      "Finance, compliance & ISO management",
      "Client file & deadline administration",
      "20 years of law firm operational expertise",
    ],
  },
];
