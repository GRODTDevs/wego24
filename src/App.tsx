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
import SecureDeveloperLogin from './pages/SecureDeveloperLogin';
import NotFound from './pages/NotFound';
import { useState, useEffect } from "react";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [isDevSession, setIsDevSession] = useState(false);

  useEffect(() => {
    const devSession = sessionStorage.getItem("dev_session");
    if (devSession) {
      const sessionData = JSON.parse(devSession);
      setIsDevSession(sessionData.authenticated);
    }
  }, []);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isDevSession ? children : <Navigate to="/dev-login" />;
  };

  const DriverLogin = () => <div>Driver Login (Coming Soon)</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <SystemSettingsProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                {isDevSession && <Header />}
                <main className="flex-1">
                  <Routes>
                    <Route path="/dev-login" element={<SecureDeveloperLogin />} />
                    <Route path="/partner-register" element={<ProtectedRoute><PartnerRegister /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                    <Route path="/auth" element={<ProtectedRoute><Auth /></ProtectedRoute>} />
                    <Route path="/operations" element={<ProtectedRoute><OperationsDashboard /></ProtectedRoute>} />
                    <Route path="/driver-dashboard" element={<ProtectedRoute><div>Driver Dashboard (Coming Soon)</div></ProtectedRoute>} />
                    <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
                    <Route path="/partner-dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
                    <Route path="/restaurant-dashboard" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
                    <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                    <Route path="/subscription/success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute><AdvancedAnalyticsPanel /></ProtectedRoute>} />
                    <Route path="/admin/regions" element={<ProtectedRoute><AdminRegionsPanel /></ProtectedRoute>} />
                    <Route path="/admin/issues" element={<ProtectedRoute><AdminIssueResolutionPanel /></ProtectedRoute>} />
                    <Route path="/courier-request" element={<ProtectedRoute><CourierRequest /></ProtectedRoute>} />
                    <Route path="/partner-info" element={<ProtectedRoute><PartnerInfo /></ProtectedRoute>} />
                    <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
                    <Route path="/driver-login" element={<ProtectedRoute><DriverLogin /></ProtectedRoute>} />
                    <Route path="/driver-registration" element={<ProtectedRoute><DriverRegistrationPage /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                {isDevSession && <Footer />}
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
