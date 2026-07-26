/**
 * entry-prerender.tsx
 *
 * Build-time prerender entry. script/build.ts compiles this file with Vite
 * (SSR mode) and calls render() / renderDesign() / renderWhy() to produce
 * the full static HTML of the homepage, the /design design-system page and
 * the /why page, injected into dist/public/index.html,
 * dist/public/design/index.html and dist/public/why/index.html in place of
 * the <!--ssr-outlet--> marker inside <div id="root">.
 *
 * The client entries (main.tsx for the homepage SPA, entry-design.tsx for
 * the /design shell, entry-why.tsx for the /why shell) re-render into #root
 * on load; each pair of renders
 * comes from the same components and content/, so the visible result is
 * identical. This file is never shipped to the browser.
 */
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Components from "@/pages/components";
import Why from "@/pages/why";

function renderPage(ssrPath: string, page: ReactElement): string {
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router ssrPath={ssrPath}>{page}</Router>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

/** Homepage — injected into dist/public/index.html. */
export function render(): string {
  return renderPage("/", <Home />);
}

/** Design-system page — injected into dist/public/design/index.html. */
export function renderDesign(): string {
  return renderPage("/design", <Components />);
}

/** /why page — injected into dist/public/why/index.html. */
export function renderWhy(): string {
  return renderPage("/why", <Why />);
}
