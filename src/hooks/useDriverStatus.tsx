
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

/**
 * Custom hook to manage driver status and real-time updates
 * 
 * Provides:
 * - Driver registration status
 * - Online/offline status management
 * - Real-time location updates
 * - Performance metrics
 */
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
      setupRealtimeUpdates();
    } else {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  /**
   * Checks if the current user is a registered driver
   */
  const checkDriverStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No driver record found
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
        isActive: data.is_active,
        isAvailable: data.is_available,
        registrationStatus: data.registration_status,
        loading: false
      });
    } catch (error) {
      console.error('Error checking driver status:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  /**
   * Sets up real-time updates for driver status changes
   */
  const setupRealtimeUpdates = () => {
    const channel = supabase
      .channel('driver-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          const updatedDriver = payload.new as any;
          setStatus(prev => ({
            ...prev,
            isActive: updatedDriver.is_active,
            isAvailable: updatedDriver.is_available,
            registrationStatus: updatedDriver.registration_status
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return status;
}
