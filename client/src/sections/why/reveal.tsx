import { useEffect, useRef, useState, type ReactNode } from "react";

const isServer = typeof window === "undefined";

/** Stagger steps → named Tailwind delay classes (arbitrary bracket delay values
 *  are unreliable with the animate plugin — named tokens only). */
const DELAY_CLASSES = ["", "delay-100", "delay-200", "delay-300", "delay-500"] as const;

/**
 * Scroll-reveal without framer-motion — the main app animates with CSS only.
 * An IntersectionObserver flips Tailwind transition classes exactly once.
 *
 * Prerender-safe by construction: during the build-time render (and for any
 * non-JS crawler) `isServer` is true, so the static HTML ships fully visible
 * — copy is never hidden behind JavaScript. The client re-render (the site's
 * replace-not-hydrate pattern) then starts hidden and reveals on intersection,
 * reproducing the mockup's entrance rhythm.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Stagger step (0–4), mapped to named delay classes. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(isServer);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-50px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const delayClass = DELAY_CLASSES[Math.min(Math.max(delay, 0), DELAY_CLASSES.length - 1)];

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none ${delayClass} ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
}
