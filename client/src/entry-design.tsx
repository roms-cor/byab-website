/**
 * entry-design.tsx — client entry for the /design shell
 * (client/design/index.html, built to dist/public/design/index.html).
 *
 * Imports the Components page eagerly — no lazy route, no Suspense — so the
 * remount replaces the prerendered static HTML with an identical DOM and the
 * empty route fallback can never flash. The homepage SPA (main.tsx/App.tsx)
 * keeps its own lazy-loaded /design route for client-side navigation and for
 * the dev server, which serves every path from the SPA shell; this entry is
 * only used by the built static page.
 */
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/tooltip";
import Components from "./pages/components";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Components />
    </TooltipProvider>
  </QueryClientProvider>,
);
