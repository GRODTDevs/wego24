
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { UserProfile as Profile } from "./components/UserProfile";
import ProductOwnerDashboard from "./pages/ProductOwnerDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CourierRequest from "./pages/CourierRequest";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TranslationProvider } from "./contexts/TranslationContext";
import { UsageMonitor } from "./components/subscription/UsageMonitor";
import NotFound from "./pages/NotFound";
import SubscriptionPage from "@/pages/SubscriptionPage";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TranslationProvider>
          <UsageMonitor>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/forgot-password" element={<Auth />} />
                <Route path="/courier-request" element={<CourierRequest />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <ProductOwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurant/dashboard"
                  element={
                    <ProtectedRoute>
                      <RestaurantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/driver/dashboard"
                  element={
                    <ProtectedRoute>
                      <DriverDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription/success"
                  element={
                    <ProtectedRoute>
                      <SubscriptionSuccess />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </UsageMonitor>
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
