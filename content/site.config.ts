export interface SiteConfig {
  /** Public brand name, used in copy, metadata and schema.org */
  name: string;
  /** Short name / acronym */
  shortName: string;
  /** Naked domain, no protocol (used for CNAME) */
  domain: string;
  /** Canonical absolute URL, with trailing slash */
  url: string;
  /** Public contact email */
  email: string;
  /** Full browser-tab page title */
  title: string;
  /** Short tagline shown after the em-dash in the title */
  tagline: string;
  /** Brand slogan used as a bold lead-in phrase in page copy (sentence case) */
  slogan: string;
  /** Meta description (≤160 chars recommended) */
  description: string;
  /** Meta keywords (comma-separated) */
  keywords: string;
  /** Absolute URL of the OG / Twitter share image (1200×630) */
  ogImage: string;
  /** ISO 8601 founding date (used in schema.org) */
  foundingDate: string;
  /** Postal address */
  address: {
    street: string;
    postalCode: string;
    city: string;
    /** Full country name (e.g. "France") */
    country: string;
    /** ISO 3166-1 alpha-2 country code (e.g. "FR") */
    countryCode: string;
  };
  /** Human-readable locations line — derived from locationCities (e.g. "Paris & La Rochelle") */
  locations: string;
  /** Cities served, used for schema.org areaServed and location prose */
  locationCities: string[];
  /** Supported locales, first entry is the default */
  locales: string[];
  /** Brand colors (reference for metadata generation; CSS tokens live in index.css) */
  colors: {
    primary: string;
    accent: string;
    background: string;
    textPrimary: string;
    themeColor: string;
  };
  /** Brand fonts (reference; loading is configured in index.html) */
  fonts: {
    body: string;
    mono: string;
  };
}

// Single source of truth for the cities served. `locations` (visible page
// copy/footer) is derived from this list below, so the two can never drift
// apart when the template is duplicated for another business.
const locationCities = ["Paris", "La Rochelle"];

export const siteConfig: SiteConfig = {
  name: "Because You Are Busy",
  shortName: "BYAB",
  domain: "becausebusy.com",
  url: "https://becausebusy.com/",
  email: "hello@becausebusy.com",
  title: "Because You Are Busy — Operations, Transformation & Growth Consultancy",
  tagline: "Operations, Transformation & Growth Consultancy",
  slogan: "Because you are busy",
  description:
    "Because You Are Busy (BYAB) — We run what you can't get to anymore. Operations, transformation, and growth consultancy for founders and managing partners since 2005. 57% operating profitability, 0€ debt, 20+ years.",
  keywords:
    "because you are busy, BYAB, externalized operations, transformation consulting, growth engineering, B2B growth, law firm operations, general secretariat, founder operations, managing partner support, externalized back-office, operations consultancy France, B2B SaaS growth, outbound B2B, systems architecture, data governance",
  ogImage: "https://becausebusy.com/og-image.png",
  foundingDate: "2005-04-01",
  address: {
    street: "18 rue Arago",
    postalCode: "94400",
    city: "Vitry-sur-Seine",
    country: "France",
    countryCode: "FR",
  },
  locations: locationCities.join(" & "),
  locationCities,
  locales: ["en", "fr"],
  colors: {
    primary: "#999999",
    accent: "#000000",
    background: "#FFFFFF",
    textPrimary: "#000000",
    themeColor: "#ffffff",
  },
  fonts: {
    body: "Inter",
    mono: "JetBrains Mono",
  },
};
