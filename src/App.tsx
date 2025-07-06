
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { DeveloperProtectedRoute } from "@/components/DeveloperProtectedRoute";
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
import PartnerInfo from "./pages/PartnerInfo";
import LocationPage from "./pages/LocationPage";
import CourierRequest from "./pages/CourierRequest";
import CourierSuccess from "./pages/CourierSuccess";
import DeveloperLogin from "./pages/DeveloperLogin";

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
                <Route path="/dev-login" element={<DeveloperLogin />} />
                <Route path="/" element={
                  <DeveloperProtectedRoute>
                    <Index />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/auth" element={
                  <DeveloperProtectedRoute>
                    <Auth />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/courier-request" element={
                  <DeveloperProtectedRoute>
                    <CourierRequest />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/courier-success" element={
                  <DeveloperProtectedRoute>
                    <CourierSuccess />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/partner-info" element={
                  <DeveloperProtectedRoute>
                    <PartnerInfo />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/partner-register" element={
                  <DeveloperProtectedRoute>
                    <PartnerRegister />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/partner/dashboard" element={
                  <DeveloperProtectedRoute>
                    <PartnerDashboard />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/restaurant/login" element={
                  <DeveloperProtectedRoute>
                    <RestaurantLogin />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/restaurant/dashboard" element={
                  <DeveloperProtectedRoute>
                    <RestaurantDashboard />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/location/:name" element={
                  <DeveloperProtectedRoute>
                    <LocationPage />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/driver/login" element={
                  <DeveloperProtectedRoute>
                    <DriverLogin />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/driver/dashboard" element={
                  <DeveloperProtectedRoute>
                    <DriverDashboard />
                  </DeveloperProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <DeveloperProtectedRoute>
                    <ProductOwnerDashboard />
                  </DeveloperProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={
                  <DeveloperProtectedRoute>
                    <NotFound />
                  </DeveloperProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TranslationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
