import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TranslationProvider, useTranslation } from './contexts/TranslationContext';
import { Toaster } from 'sonner';
import { ErrorViewer } from './components/ErrorViewer';
import { DeveloperLogin } from "@/components/auth/DeveloperLogin";
import { DeveloperProtectedRoute } from "@/components/DeveloperProtectedRoute";
import { DemoDataManager } from "@/components/admin/DemoDataManager";
import CustomerDashboard from "@/components/customer/CustomerDashboard";
import SupportChat from "@/components/support/SupportChat";
import DriverDashboardMobile from "@/components/driver/DriverDashboardMobile";
import AdvancedAnalyticsPanel from "@/components/admin/AdvancedAnalyticsPanel";
import AdminRegionsPanel from "@/components/admin/AdminRegionsPanel";
import AdminIssueResolutionPanel from "@/components/admin/AdminIssueResolutionPanel";
import MobileMenu from "@/components/MobileMenu";
import Index from './pages/Index';
import CourierRequest from './pages/CourierRequest';
import PartnerInfo from './pages/PartnerInfo';
import Auth from './pages/Auth';
import DriverRegistrationPage from './pages/DriverRegistration';
import { ProtectedRoute } from './components/ProtectedRoute';
import DriverDashboard from "./pages/DriverDashboard";
import { OperationsDashboard } from "./components/dashboard/OperationsDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import './utils/errorLogger'; // Initialize error logging
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.error('Query failed:', error);
        return failureCount < 3;
      },
    },
  },
});


function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <SystemSettingsProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Toaster />
                <main>
                  <Routes>
                    <Route path="/dev-login" element={<DeveloperLogin />} />
                    <Route
                      path="*"
                      element={
                        <DeveloperProtectedRoute>
                          <AppRoutes />
                        </DeveloperProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <ErrorViewer />
              </div>
            </BrowserRouter>
          </QueryClientProvider>
        </SystemSettingsProvider>
      </TranslationProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/courier-request" element={<CourierRequest />} />
      <Route path="/partner-info" element={<PartnerInfo />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/driver-registration" element={<DriverRegistrationPage />} />
      <Route path="/driver-dashboard" element={
        <ProtectedRoute>
          <DriverDashboard />
        </ProtectedRoute>
      } />
      <Route path="/operations" element={
        <ProtectedRoute>
          <OperationsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/restaurant-dashboard" element={
        <ProtectedRoute>
          <RestaurantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/demo-data" element={<DemoDataManager />} />
      <Route path="/admin/analytics" element={<AdvancedAnalyticsPanel />} />
      <Route path="/admin/regions" element={<AdminRegionsPanel />} />
      <Route path="/admin/issues" element={<AdminIssueResolutionPanel />} />
      <Route path="/dashboard" element={<CustomerDashboard user={user} />} />
      <Route path="/support-chat" element={<SupportChat />} />
      <Route path="/driver" element={<DriverDashboardMobile user={user} />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default App;
