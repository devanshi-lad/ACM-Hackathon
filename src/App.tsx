import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthTest from "./pages/AuthTest"; // For authentication testing

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Header with navigation and login button */}
          <Header />

          {/* Main content area */}
          <main className="flex-1 px-4 sm:px-6 py-8">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Index />} />

              {/* Authentication Test Page */}
              <Route path="/auth-test" element={<AuthTest />} />

              {/* 404 Not Found Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer section */}
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
