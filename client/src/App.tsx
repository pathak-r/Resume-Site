import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import GeoAgenticInt from "@/pages/geo-agentic-int";
import SectionBlendPreview from "@/pages/section-blend-preview";
import HeroNlPreview from "@/pages/hero-nl-preview";
import HeroWallPreview from "@/pages/hero-wall-preview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/geo-agentic-int" component={GeoAgenticInt} />
      <Route path="/section-blend-preview" component={SectionBlendPreview} />
      <Route path="/hero-nl-preview" component={HeroNlPreview} />
      <Route path="/hero-wall-preview" component={HeroWallPreview} />
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
