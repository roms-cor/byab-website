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
      "Because You Are Busy runs your entire back-office — general secretariat, admin, finance, and compliance — so the operational load leaves the executive desk and your time goes back to strategy. Run directly by senior operators with 20+ years of law firm and SME operational experience: no juniors ever touch your files.",
    outcomes: [
      "Back-office off your desk, run end to end",
      "Financial reporting you can steer by",
      "HR, legal documentation & ISO compliance covered",
      "Senior operators only — built for CEOs, COOs & managing partners",
    ],
  },
  {
    num: "02",
    title: "Transformation & Data",
    description:
      "Because You Are Busy rebuilds the systems layer — architecture, project governance, and data strategy — so you steer the company on numbers you trust instead of gut feel and firefighting. Anchored in 22+ years of CGI systems consulting and academic expertise at Université Paris 1 Panthéon-Sorbonne.",
    outcomes: [
      "Decision-ready dashboards, not raw exports",
      "Systems architecture & tech governance that scale",
      "Transformation roadmaps that actually ship",
      "One trusted version of your operating numbers",
    ],
  },
  {
    num: "03",
    title: "Growth Engine",
    description:
      "Because You Are Busy engineers your full commercial pipeline — ICP definition, outbound sequences, acquisition funnels, and revenue metrics — so revenue becomes a forecast you stand behind, not a function of effort or luck. Built on proven playbooks from MerciApp, Clovis, and Datananas.",
    outcomes: [
      "A pipeline you can forecast, quarter after quarter",
      "Outbound machine designed, automated & owned",
      "Sales process & CRM ops that survive turnover",
      "ICP & go-to-market grounded in your numbers",
    ],
  },
  {
    num: "04",
    title: "Legal Practice Ops",
    description:
      "Because You Are Busy provides purpose-built operational support for law firms where precision and discretion are non-negotiable. Born from Anne Grosz's 8 years as Secretary General at Vatier & Associés, this service takes everything off the partners' desks that isn't billable: admin, finance, compliance, and client file management.",
    outcomes: [
      "Partners' hours back on billable work",
      "Finance, compliance & ISO run without partner oversight",
      "Client files & deadlines administered, zero misses tolerated",
      "20 years of law firm operational expertise, handled discreetly",
    ],
  },
];
