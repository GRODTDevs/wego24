import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { OperationsDashboard } from "./components/dashboard/OperationsDashboard";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import PartnerDashboard from "./pages/PartnerDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import AdvancedAnalyticsPanel from "@/components/admin/AdvancedAnalyticsPanel";
import AdminRegionsPanel from "@/components/admin/AdminRegionsPanel";
import AdminIssueResolutionPanel from "@/components/admin/AdminIssueResolutionPanel";
import Index from './pages/Index';
import CourierRequest from './pages/CourierRequest';
import PartnerInfo from './pages/PartnerInfo';
import PartnerRegister from './pages/PartnerRegister';
import Auth from './pages/Auth';
import { DriverDashboard } from "./components/driver/DriverDashboard";
import DriverRegistrationPage from "./pages/DriverRegistration";
import NotFound from './pages/NotFound';
import { useState, useEffect } from "react";
import "./App.css";
import { PartnerApprovalPanel } from "./components/admin/PartnerApprovalPanel";

const queryClient = new QueryClient();

function App() {
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = sessionStorage.getItem("auth_token");
    return isAuthenticated ? children : <Navigate to="/auth" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <SystemSettingsProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/partner-info" element={<Navigate to="/auth" />} />
                    <Route path="/partner-register" element={<Navigate to="/auth" />} />
                    <Route path="/driver-registration" element={<Navigate to="/auth" />} />
                    <Route path="/courier-request" element={<Navigate to="/auth" />} />
                    <Route path="/courier-success" element={<Navigate to="/auth" />} />
                    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </Router>
          </SystemSettingsProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;
