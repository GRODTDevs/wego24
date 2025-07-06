
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import ProductOwnerDashboard from "./pages/ProductOwnerDashboard";
import PartnerRegister from "./pages/PartnerRegister";
import PartnerDashboard from "./pages/PartnerDashboard";
import LocationPage from "./pages/LocationPage";
import CourierRequest from "./pages/CourierRequest";
import CourierSuccess from "./pages/CourierSuccess";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TranslationProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/courier-request" element={<CourierRequest />} />
                <Route path="/courier-success" element={<CourierSuccess />} />
                <Route path="/partner-register" element={<PartnerRegister />} />
                <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                <Route path="/restaurant/login" element={<RestaurantLogin />} />
                <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
                <Route path="/location/:name" element={<LocationPage />} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
                <Route path="/admin/dashboard" element={<ProductOwnerDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TranslationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
