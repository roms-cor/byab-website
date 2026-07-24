import { siteConfig } from "./site.config";

/**
 * Registered legal entities shown in the footer "Companies" column,
 * with their public registry links (SIREN transparency / backlinks).
 * Edit this file when duplicating the template for another business.
 */
export interface CompanyRegistryLink {
  label: string;
  href: string;
}

export interface Company {
  name: string;
  siren: string;
  founded: string;
  links: CompanyRegistryLink[];
}

export const companies: Company[] = [
  {
    name: "B Y A B",
    siren: "481 631 471",
    founded: "2005",
    links: [
      { label: "Annuaire Entreprises", href: "https://annuaire-entreprises.data.gouv.fr/entreprise/because-you-are-busy-b-y-a-b-481631471" },
      { label: "Pappers", href: "https://www.pappers.fr/entreprise/b-y-a-b-because-you-are-busy-481631471" },
      { label: "Le Figaro", href: "https://entreprises.lefigaro.fr/b-y-a-b-b-y-a-b-83/entreprise-481631471" },
    ],
  },
  {
    name: siteConfig.name,
    siren: "814 783 056",
    founded: "2015",
    links: [
      { label: "Société.com", href: "https://www.societe.com/societe/because-you-are-busy-814783056.html" },
      { label: "Pappers", href: "https://www.pappers.fr/entreprise/because-you-are-busy-814783056" },
      { label: "Le Figaro", href: "https://entreprises.lefigaro.fr/because-you-are-busy-94/entreprise-814783056" },
    ],
  },
];
