export interface PainPoint {
  num: string;
  /** Bold lead-in of the sentence */
  lead: string;
  /** Rest of the sentence (starts with punctuation or space) */
  rest: string;
}

export const painPoints: PainPoint[] = [
  {
    num: "01",
    lead: "Operational admin is consuming the time you need for strategy",
    rest: " — finance, HR, compliance, and back-office pile up while the decisions that actually move your company forward wait.",
  },
  {
    num: "02",
    lead: "Your data is scattered and your processes are improvised",
    rest: " — every week is spent firefighting instead of building the systems that would prevent fires from starting.",
  },
  {
    num: "03",
    lead: "Revenue growth is stalling despite clear market opportunity",
    rest: " — because no one owns the outbound machine, funnel architecture, or commercial pipeline that would convert it into predictable revenue.",
  },
];
