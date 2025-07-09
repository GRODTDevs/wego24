
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SecureProtectedRouteProps {
  children: React.ReactNode;
}

export const SecureProtectedRoute = ({ children }: SecureProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean>(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const sessionData = sessionStorage.getItem('dev_session');
        
        if (!sessionData) {
          setIsAuthenticated(false);
          return;
        }

        const session = JSON.parse(sessionData);
        const now = Date.now();

        // Check if session is expired
        if (!session.expires || now > session.expires) {
          sessionStorage.removeItem('dev_session');
          
          // Log session expiry
          await supabase.rpc('log_security_event', {
            p_user_id: null,
            p_action: 'dev_session_expired',
            p_resource_type: 'authentication',
            p_details: { 
              timestamp: new Date().toISOString(),
              expired_at: new Date(session.expires).toISOString()
            }
          });

          setIsAuthenticated(false);
          return;
        }

        // Validate session structure
        if (!session.token || !session.authenticated) {
          sessionStorage.removeItem('dev_session');
          setIsAuthenticated(false);
          return;
        }

        setSessionValid(true);
        setIsAuthenticated(true);

      } catch (error) {
        console.error('Session validation error:', error);
        sessionStorage.removeItem('dev_session');
        setIsAuthenticated(false);
      }
    };

    validateSession();

    // Set up session refresh interval
    const interval = setInterval(validateSession, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !sessionValid) {
    return <Navigate to="/dev-login" replace />;
  }

  return <>{children}</>;
};
