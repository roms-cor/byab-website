import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Rotation state for the hero team slider: active/previous indices, a
 * 4-second auto-advance interval, and manual navigation via goTo.
 *
 * `hasAdvanced` stays false until the first transition so the initial photo
 * renders with opacity:1 and NO CSS transition on first paint (LCP
 * optimization — see replit.md).
 */
export function useTeamSlider(count: number) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAdvanced = useRef(false);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    hasAdvanced.current = true;
    setPrev(active);
    setActive(index);
  }, [active]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      hasAdvanced.current = true;
      setActive((a) => {
        setPrev(a);
        return (a + 1) % count;
      });
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  return { active, prev, goTo, hasAdvanced };
}
