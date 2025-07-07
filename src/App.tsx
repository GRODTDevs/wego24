import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import Home from './pages/Home';
import CourierRequest from './pages/CourierRequest';
import PartnerInfo from './pages/PartnerInfo';
import Auth from './pages/Auth';
import DriverRegistrationPage from './pages/DriverRegistration';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import DriverDashboard from "@/pages/DriverDashboard";

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <AuthProvider>
          <TranslationProvider>
            <div className="min-h-screen bg-background">
              <Toaster />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courier-request" element={<CourierRequest />} />
                <Route path="/partner-info" element={<PartnerInfo />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/driver-registration" element={<DriverRegistrationPage />} />
                <Route path="/driver-dashboard" element={
                  <ProtectedRoute>
                    <DriverDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </TranslationProvider>
        </AuthProvider>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
