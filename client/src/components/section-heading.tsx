import type { ReactNode } from "react";

/**
 * Shared homepage section header: aria-hidden uppercase eyebrow + the
 * section's <h2>. The h2 `id` is the target of the parent
 * `<section aria-labelledby>`; markup and classes are exactly what the seven
 * sections (services, work, about, team, story, faq, contact) rendered before
 * factoring — do not restyle here without checking all of them.
 * `className` appends per-section h2 variants (e.g. `leading-tight`).
 * Hero and Marquee keep their own eyebrow variants (different margins/colors,
 * not section headers) on purpose.
 */
interface SectionHeadingProps {
  /** Eyebrow label (decorative — aria-hidden). */
  eyebrow: string;
  /** id of the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  /** data-testid of the <h2>. */
  testId: string;
  /** Extra h2 classes appended after the base classes (e.g. "leading-tight"). */
  className?: string;
  /** Rich heading content: text, <br/>, `text-gray-450` spans. */
  children: ReactNode;
}

export function SectionHeading({ eyebrow, id, testId, className, children }: SectionHeadingProps) {
  return (
    <>
      <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">{eyebrow}</p>
      <h2
        id={id}
        className={`text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground${className ? ` ${className}` : ""}`}
        data-testid={testId}
      >
        {children}
      </h2>
    </>
  );
}
