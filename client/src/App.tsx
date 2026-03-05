import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import ComingSoon from "@/pages/coming-soon";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

const Components = lazy(() => import("@/pages/components"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={ComingSoon} />
      <Route path="/home" component={Home} />
      <Route path="/design">
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Components />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
