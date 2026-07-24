import type { ReactNode } from "react";

export interface TimelineEntry {
  year: string;
  title: string;
  /** Small photo (128px), absolute public path, or null for no photo */
  photo: string | null;
  photoAlt: string | null;
  /** Rich text content — may include inline links */
  content: ReactNode;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2005",
    title: "The founding conviction",
    photo: "/images/cecile-128.webp",
    photoAlt: "Cécile Noiriel",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
          On April 1, 2005,{" "}
          <a href="https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-cecile-linkedin">
            Cécile Noiriel
          </a>
          {" "}creates{" "}
          <a href="https://annuaire-entreprises.data.gouv.fr/entreprise/because-you-are-busy-b-y-a-b-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-annuaire">
            Because You Are Busy (B Y A B)
          </a>
          , registered under SIREN 481 631 471. The mission: operational and commercial organization support for SMEs — because founders don't lack courage, they lack time and structure to execute.
        </p>
        <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
          From day one,{" "}
          <a href="https://entreprises.lefigaro.fr/b-y-a-b-b-y-a-b-83/entreprise-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-figaro">
            Because You Are Busy
          </a>{" "}
          lives exactly what it promises clients: an{" "}
          <a href="https://www.pappers.fr/entreprise/b-y-a-b-because-you-are-busy-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-pappers">
            ultra-lean, ultra-profitable structure
          </a>
          {" "}— revenue around 130,000€, operating profitability above 57%, and zero external debt raised, ever.
        </p>
      </>
    ),
  },
  {
    year: "2015",
    title: "Specialization: law firms & SMEs",
    photo: "/images/anne-128.webp",
    photoAlt: "Anne Grosz",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
          Ten years after the original founding,{" "}
          <a href="https://www.linkedin.com/in/annegrosz" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-anne-linkedin">
            Anne Grosz
          </a>
          {" "}creates a second entity:{" "}
          <a href="https://entreprises.lefigaro.fr/because-you-are-busy-94/entreprise-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-figaro">
            Because You Are Busy
          </a>{" "}
          (SIREN 814 783 056), registered November 20, 2015. Specialization: externalized general secretariat for law firms and SMEs.
        </p>
        <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
          Anne brings eight years as Secretary General and CFO at{" "}
          <a href="https://www.infocession.fr/avocats/vatier-associes" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-vatier">
            Vatier & Associés
          </a>
          {" "}(Paris law firm) — overseeing accounting, HR, IT, compliance, and events. With{" "}
          <a href="https://www.societe.com/societe/because-you-are-busy-814783056.html" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-societe">
            Because You Are Busy
          </a>
          , she transforms that expertise into an externalized offer: in-house operational rigor, now serving multiple clients.
        </p>
      </>
    ),
  },
  {
    year: "2020",
    title: "Consolidation: craft over startup",
    photo: null,
    photoAlt: null,
    content: (
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
        Because You Are Busy evolves legally — from SAS to SARL, then to EI for greater operational simplicity. Accounts are systematically filed with a confidentiality declaration.{" "}
        <a href="https://www.pappers.fr/entreprise/because-you-are-busy-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-pappers">
          The craft model wins over the startup model
        </a>
        : human-scale, delivery-focused, trust-based client relationships — not scale for scale's sake.
      </p>
    ),
  },
  {
    year: "2025",
    title: "Georges: the transformation & data layer",
    photo: "/images/georges-128.webp",
    photoAlt: "Georges Grosz",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
          On July 4, 2025,{" "}
          <a href="https://www.linkedin.com/in/georges-grosz-8aa9613" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-georges-linkedin">
            Georges Grosz
          </a>{" "}
          joins Because You Are Busy as co-manager alongside Anne. His background: 22+ years as Senior Executive Consultant at CGI and professor of information systems at Université Paris 1 Panthéon-Sorbonne — decades of systems architecture and data governance for major French organizations.
        </p>
        <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
          With Georges, Because You Are Busy becomes a full transformation co-pilot — capable of rebuilding systems architecture, deploying data governance frameworks, and turning operational chaos into measurable, decision-ready clarity at any scale.
        </p>
      </>
    ),
  },
  {
    year: "2025–26",
    title: "Romain: the growth machine",
    photo: "/images/romain-128.webp",
    photoAlt: "Romain Cornu",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
          At the same time, another path converges:{" "}
          <a href="https://fr.linkedin.com/in/romaincornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-linkedin">
            Romain Cornu
          </a>
          , B2B growth specialist — Head of Marketing at Datananas, then nearly six years at MerciApp (Growth Advisor → Investor → GTM & Key Accounts Lead).{" "}
          <a href="https://www.avizio.fr/expert/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-avizio">
            Head of Growth at Clovis
          </a>
          {" "}for over four years, and Outbound Teacher at GrowthMakers.{" "}
          <a href="https://clay.earth/profile/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-clay">
            Full profile on Clay
          </a>
          .
        </p>
        <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
          Romain joins Because You Are Busy to build the growth engineering capability: ICP definition, outbound infrastructure, acquisition funnels, and the revenue metrics that make commercial growth predictable. When he joins, the Because You Are Busy puzzle is complete.
        </p>
      </>
    ),
  },
];
