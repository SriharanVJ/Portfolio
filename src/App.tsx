// This is your portfolio's main router/layout file

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollProgress from "@/components/ScrollProgress"; 
import Chatbot from './components/Chatbot/Chatbot'; // Your Chatbot component

// import ScrollToTopButton from "@/components/ScrollToTopButton";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScrollProgress /> 
      {/* <ScrollToTopButton /> */}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* 🚀 INTEGRATION: Add the Chatbot component here */}
        {/* Placing it here ensures it appears on all routes (Index and NotFound) 
            and remains persistent, typically using fixed positioning for the UI. */}
        <Chatbot /> 
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;