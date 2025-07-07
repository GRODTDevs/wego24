
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import Index from './pages/Index';
import CourierRequest from './pages/CourierRequest';
import PartnerInfo from './pages/PartnerInfo';
import Auth from './pages/Auth';
import DriverRegistrationPage from './pages/DriverRegistration';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import DriverDashboard from "./pages/DriverDashboard";
import ProductOwnerDashboard from "./pages/ProductOwnerDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { ErrorViewer } from './components/ErrorViewer';
import './utils/errorLogger'; // Initialize error logging

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
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TranslationProvider>
            <div className="min-h-screen bg-background">
              <Toaster />
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
                    <ProductOwnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/restaurant-dashboard" element={
                  <ProtectedRoute>
                    <RestaurantDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
              <ErrorViewer />
            </div>
          </TranslationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
