
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface DeveloperProtectedRouteProps {
  children: React.ReactNode;
}

export const DeveloperProtectedRoute = ({ children }: DeveloperProtectedRouteProps) => {
  const [isDevAuthenticated, setIsDevAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const devAuth = localStorage.getItem("dev_authenticated");
    setIsDevAuthenticated(devAuth === "true");
  }, []);

  if (isDevAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isDevAuthenticated) {
    return <Navigate to="/dev-login" replace />;
  }

  return <>{children}</>;
};
