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
import { PartnerApprovalPanel } from "@/components/admin/PartnerApprovalPanel";
import Index from './pages/Index';
import CourierRequest from './pages/CourierRequest';
import PartnerInfo from './pages/PartnerInfo';
import PartnerRegister from './pages/PartnerRegister';
import Auth from './pages/Auth';
import { DriverDashboard } from "./components/driver/DriverDashboard";
import DriverRegistrationPage from "./pages/DriverRegistration";
import NotFound from './pages/NotFound';
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import "./App.css";
import MaintenanceGate from "@/components/MaintenanceGate";
import { Button } from "@/components/ui/button";
import { PartnersManagementPanel } from "@/components/admin/PartnersManagementPanel";
import ShopPage from "./pages/ShopPage";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    console.log('[App] Mounted');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <SystemSettingsProvider>
            <Router>
              <MaintenanceGate>
                <AuthGate />
              </MaintenanceGate>
            </Router>
          </SystemSettingsProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { isAdmin, loading: roleLoading, userRole } = useUserRole();
  const { user, signOut } = useAuth();

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (typeof window !== 'undefined') {
      console.log('[ProtectedRoute] user:', user, 'isAdmin:', isAdmin, 'roleLoading:', roleLoading);
    }
    if (!user) {
      if (typeof window !== 'undefined') {
        console.log('[ProtectedRoute] No user, redirecting to /auth');
      }
      return <Navigate to="/auth" />;
    }
    if (roleLoading) {
      if (typeof window !== 'undefined') {
        console.log('[ProtectedRoute] Role loading, showing spinner');
      }
      return <div className="flex justify-center items-center h-full"><span>Loading...</span></div>;
    }
    if (!isAdmin) {
      if (typeof window !== 'undefined') {
        console.log('[ProtectedRoute] Not admin, redirecting to /auth');
      }
      return <Navigate to="/auth" />;
    }
    if (typeof window !== 'undefined') {
      console.log('[ProtectedRoute] Access granted, rendering child');
    }
    return children;
  };

  if (roleLoading) {
    return <div className="flex justify-center items-center h-screen"><span>Loading user role...</span></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/partner-info" element={<PartnerInfo />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/driver-registration" element={<DriverRegistrationPage />} />
          <Route path="/courier-request" element={<CourierRequest />} />
          <Route path="/courier-success" element={<div>Courier Success (Coming Soon)</div>} />
          <Route path="/operations" element={<ProtectedRoute><OperationsDashboard /></ProtectedRoute>} />
          <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
          <Route path="/partner-dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path="/restaurant-dashboard" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/subscription/success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AdvancedAnalyticsPanel /></ProtectedRoute>} />
          <Route path="/regions" element={<ProtectedRoute><AdminRegionsPanel /></ProtectedRoute>} />
          <Route path="/issues" element={<ProtectedRoute><AdminIssueResolutionPanel /></ProtectedRoute>} />
          <Route path="/partners" element={<ProtectedRoute><PartnerApprovalPanel /></ProtectedRoute>} />
          <Route path="/partners-management" element={<ProtectedRoute><PartnersManagementPanel /></ProtectedRoute>} />
          <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
          <Route path="/partner-dashboard/:partnerId" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path="/shop/:slug" element={<ShopPage />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
