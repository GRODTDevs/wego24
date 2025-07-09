import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import DriverRegistrationPage from './pages/DriverRegistration';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SecureProtectedRoute } from './components/auth/SecureProtectedRoute';
import SecureDeveloperLogin from './pages/SecureDeveloperLogin';
import { useAuth } from './contexts/AuthContext';
import { useUserRole } from './hooks/useUserRole';
import NotFound from './pages/NotFound';
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <SystemSettingsProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <AppContent />
                <Toaster />
              </div>
            </Router>
          </SystemSettingsProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/courier-request" element={<CourierRequest />} />
          <Route path="/partner-info" element={<PartnerInfo />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/driver-registration" element={<DriverRegistrationPage />} />
          
          {/* Secure developer route */}
          <Route path="/dev-login" element={<SecureDeveloperLogin />} />
          <Route 
            path="/operations" 
            element={
              <SecureProtectedRoute>
                <OperationsDashboard />
              </SecureProtectedRoute>
            } 
          />

          {/* Protected routes */}
          <Route path="/driver-dashboard" element={
            <ProtectedRoute>
              <div>Driver Dashboard (Coming Soon)</div>
            </ProtectedRoute>
          } />
          
          <Route path="/customer-dashboard" element={
            <ProtectedRoute>
              <CustomerDashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/partner-dashboard" element={
            <ProtectedRoute>
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/restaurant-dashboard" element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/subscription" element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } />
          
          <Route path="/subscription/success" element={
            <ProtectedRoute>
              <SubscriptionSuccess />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/analytics" element={
            <ProtectedRoute requireAdmin={true}>
              <AdvancedAnalyticsPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/regions" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminRegionsPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/issues" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminIssueResolutionPanel />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
