
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DriverStatus {
  isDriver: boolean;
  driverId?: string;
  isActive: boolean;
  isAvailable: boolean;
  registrationStatus: string;
  loading: boolean;
}

export function useDriverStatus(): DriverStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<DriverStatus>({
    isDriver: false,
    isActive: false,
    isAvailable: false,
    registrationStatus: 'none',
    loading: true
  });

  useEffect(() => {
    if (user) {
      checkDriverStatus();
    } else {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  const checkDriverStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setStatus(prev => ({ 
            ...prev, 
            isDriver: false, 
            loading: false 
          }));
          return;
        }
        throw error;
      }

      setStatus({
        isDriver: true,
        driverId: data.id,
        isActive: data.is_active || false,
        isAvailable: data.is_available || false,
        registrationStatus: data.registration_status || 'pending',
        loading: false
      });
    } catch (error) {
      console.error('Error checking driver status:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return status;
}
