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
    lead: "Your calendar is full of work that shouldn't need a CEO",
    rest: " — finance, HR, compliance, and back-office land on your desk while the decisions only you can make wait.",
  },
  {
    num: "02",
    lead: "Execution depends on you pushing it",
    rest: " — data is scattered, processes are improvised, and every week goes to firefighting instead of building systems that hold without you.",
  },
  {
    num: "03",
    lead: "You can't forecast next quarter's revenue with confidence",
    rest: " — because no one owns the outbound machine, funnel architecture, or commercial pipeline that would turn market opportunity into predictable revenue.",
  },
];
