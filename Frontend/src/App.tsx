import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Games from "./pages/Games";
import Quiz from "./pages/Quiz";
import Activities from "./pages/Activities";
import Progress from "./pages/Progress";
import Social from "./pages/Social";
import NotFound from "./pages/NotFound";
import Assignment from "./pages/Assignment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/games" element={<Games />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/social" element={<Social />} />
          <Route path="/assignments" element={<Assignment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
