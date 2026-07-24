import { useEffect, useRef, useState } from "react";

/**
 * Mobile navigation behavior for the fixed header: open/close state, body
 * scroll lock + focus move into the menu on open, auto-close when the
 * viewport reaches the desktop breakpoint, and Escape-to-close with focus
 * restored to the trigger button.
 */
export function useMobileNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const firstLink = menuRef.current?.querySelector("a");
      firstLink?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => { if (mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  const toggle = () => setMobileOpen((open) => !open);

  const closeAndRestoreFocus = () => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  };

  return { mobileOpen, toggle, closeAndRestoreFocus, menuRef, triggerRef };
}
