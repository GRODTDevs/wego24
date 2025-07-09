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
import "./App.css";
import MaintenanceGate from "@/components/MaintenanceGate";

const queryClient = new QueryClient();

function App() {
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
  const isAuthenticated = sessionStorage.getItem("auth_token");

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) return <Navigate to="/auth" />;
    if (roleLoading) return <div className="flex justify-center items-center h-full"><span>Loading role...</span></div>;
    // Debug output
    if (typeof window !== 'undefined') {
      console.log('AuthGate: isAdmin', isAdmin, 'userRole', userRole, 'isAuthenticated', isAuthenticated);
    }
    if (!isAdmin) return <Navigate to="/auth" />;
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
          <Route path="/admin/analytics" element={<ProtectedRoute><AdvancedAnalyticsPanel /></ProtectedRoute>} />
          <Route path="/admin/regions" element={<ProtectedRoute><AdminRegionsPanel /></ProtectedRoute>} />
          <Route path="/admin/issues" element={<ProtectedRoute><AdminIssueResolutionPanel /></ProtectedRoute>} />
          <Route path="/admin/partners" element={<ProtectedRoute><PartnerApprovalPanel /></ProtectedRoute>} />
          <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
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
