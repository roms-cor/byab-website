/**
 * entry-prerender.tsx
 *
 * Build-time prerender entry. script/build.ts compiles this file with Vite
 * (SSR mode) and calls render() to produce the full static HTML of the
 * homepage, which is injected into dist/public/index.html in place of the
 * <!--ssr-outlet--> marker inside <div id="root">.
 *
 * The client entry (main.tsx) re-renders into #root on load; both renders
 * come from the same components and content/, so the visible result is
 * identical. This file is never shipped to the browser.
 */
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";

export function render(): string {
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router ssrPath="/">
          <Home />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}
