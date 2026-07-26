export interface Stat {
  value: string;
  suffix: string;
  label: string;
  sub: string;
}

export const stats: Stat[] = [
  {
    value: "20",
    suffix: "+",
    label: "Years running operations for executives without interruption",
    sub: "Since April 2005 — as of 2026",
  },
  {
    value: "57",
    suffix: "%",
    label: "Operating profitability — we run our own business the way we run yours",
    sub: "Revenue ~130,000€. No hype.",
  },
  {
    value: "3",
    suffix: "",
    label: "Disciplines under one roof: Operations, Transformation & Data, Growth",
    sub: "One senior team. Zero vendors to manage.",
  },
  {
    value: "0",
    suffix: "€",
    label: "External debt raised — ever. No investors to answer to but you.",
    sub: "Self-funded since 2005",
  },
];
