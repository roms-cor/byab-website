export interface TeamMember {
  /** Main photo (256px), absolute public path */
  src: string;
  /** Thumbnail photo (128px), absolute public path */
  thumb: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  since: string;
  /** Short label shown in the footer "People" column; defaults to `role` when omitted */
  footerRole?: string;
  linkedin?: string;
  website?: string;
  /** Extra public reference links (profiles, press) included in the AI-crawler external-references lists */
  refs?: { label: string; href: string }[];
}

export const teamMembers: TeamMember[] = [
  {
    src: "/images/cecile-256.webp",
    thumb: "/images/cecile-128.webp",
    name: "Cécile Noiriel",
    role: "Founder — B Y A B, 2005",
    bio: "Cécile Noiriel founded Because You Are Busy (B Y A B, SIREN 481 631 471) on April 1, 2005 — with a conviction ahead of its time: founders don't lack courage, they lack time and structure. She has run the operation continuously for over 20 years, serving as the firm's founding operational anchor.",
    skills: ["Project Coordination", "Administrative Org", "Client Delivery", "Process Design"],
    since: "Since 2005",
    footerRole: "Founder, B Y A B 2005",
    linkedin: "https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/",
  },
  {
    src: "/images/anne-256.webp",
    thumb: "/images/anne-128.webp",
    name: "Anne Grosz",
    role: "Founder & Operations",
    bio: "Anne Grosz spent 8 years as Secretary General & CFO at Vatier & Associés (Paris law firm) before founding the second Because You Are Busy entity in 2015. She leads externalized general secretariat for law firms and SMEs — finance, admin, HR, and ISO compliance — with in-house rigor at external scale.",
    skills: ["General Secretariat", "Finance & Admin", "Law Firm Ops", "ISO Compliance"],
    since: "Since 2015",
    footerRole: "Co-founder & Operations",
    linkedin: "https://www.linkedin.com/in/annegrosz",
    refs: [
      { label: "Vatier & Associés — Infocession", href: "https://www.infocession.fr/avocats/vatier-associes" },
    ],
  },
  {
    src: "/images/georges-256.webp",
    thumb: "/images/georges-128.webp",
    name: "Georges Grosz",
    role: "Transformation & Data",
    bio: "Georges Grosz brings 22+ years as Senior Executive Consultant at CGI and teaches information systems at Université Paris 1 Panthéon-Sorbonne. He joined Because You Are Busy as co-manager in July 2025, adding the systems architecture discipline that turns fragmented operations into governed, decision-ready infrastructure.",
    skills: ["Systems Architecture", "Data Governance", "Project Management", "Business Analysis"],
    since: "Since July 2025",
    linkedin: "https://www.linkedin.com/in/georges-grosz-8aa9613",
  },
  {
    src: "/images/romain-256.webp",
    thumb: "/images/romain-128.webp",
    name: "Romain Cornu",
    role: "Growth Engine",
    bio: "Romain Cornu spent nearly 6 years at MerciApp — from Growth Advisor to GTM & Key Accounts Lead — and 4+ years as Head of Growth at Clovis, plus Head of Marketing at Datananas. At Because You Are Busy, he designs go-to-market engines that make B2B revenue growth systematic, not accidental.",
    skills: ["Go-to-Market", "Acquisition Funnels", "Outbound B2B", "Revenue Ops"],
    since: "Since 2025",
    linkedin: "https://fr.linkedin.com/in/romaincornu",
    refs: [
      { label: "Romain Cornu — Avizio", href: "https://www.avizio.fr/expert/romain-cornu" },
      { label: "Romain Cornu — Clay", href: "https://clay.earth/profile/romain-cornu" },
    ],
  },
];
