/**
 * generate-og-image.ts — regenerates the 1200×630 social share card.
 *
 * Composites the horizontal logo onto a brand-colored canvas and writes
 * client/public/og-image.png. Run it whenever the logo asset or the brand
 * colors change (and when duplicating the template for another profession):
 *
 *   npm run og-image
 *
 * The canvas color comes from content/site.config.ts (colors.accent). When
 * the canvas is dark, the dark logo artwork is negated so it stays visible.
 * script/validate-seo.ts verifies the resulting file's real dimensions match
 * the declared og:image:width/height (1200×630).
 */
import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const { siteConfig: cfg } = await import("../content/site.config.js").catch(
  () => import("../content/site.config.ts" as any)
);

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_MAX_WIDTH = Math.round(WIDTH * 0.6);
const LOGO_MAX_HEIGHT = Math.round(HEIGHT * 0.4);

const logoPath = resolve(root, "client/public/images/logo-horizontal-black.webp");
const outPath = resolve(root, "client/public/og-image.png");

// Canvas color from the brand config (accent = the brand's strong color).
const canvas = String(cfg.colors.accent ?? "#000000");

// Perceived luminance of the canvas decides whether the dark logo artwork
// needs to be inverted to stay legible.
const hex = canvas.replace("#", "");
const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2).padEnd(2, hex[i] ?? "0"), 16));
const canvasIsDark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;

let logo = sharp(logoPath).resize(LOGO_MAX_WIDTH, LOGO_MAX_HEIGHT, {
  fit: "inside",
  withoutEnlargement: false,
});
if (canvasIsDark) logo = logo.negate({ alpha: false });

const logoBuf = await logo.png().toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 4, background: canvas },
})
  .composite([
    {
      input: logoBuf,
      left: Math.round((WIDTH - (logoMeta.width ?? 0)) / 2),
      top: Math.round((HEIGHT - (logoMeta.height ?? 0)) / 2),
    },
  ])
  .png()
  .toFile(outPath);

console.log(
  `✓ wrote ${outPath} (${WIDTH}×${HEIGHT}, canvas ${canvas}${canvasIsDark ? ", logo inverted for dark canvas" : ""})`
);
