
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  order_id?: string;
  type: 'order_status' | 'driver_assignment' | 'payment' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
  delivery_method: string[];
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(current => [payload.new as Notification, ...current]);
            setUnreadCount(current => current + 1);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(current =>
              current.map(notif =>
                notif.id === payload.new.id ? { ...notif, ...payload.new } : notif
              )
            );
            
            if (payload.old?.is_read === false && payload.new.is_read === true) {
              setUnreadCount(current => Math.max(0, current - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Since notifications table doesn't exist yet, just set empty arrays
      console.log('Notifications table not available yet');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Placeholder for when notifications table exists
      console.log('Mark notification as read not available yet');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Placeholder for when notifications table exists
      console.log('Mark all notifications as read not available yet');
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'general',
    orderId?: string
  ) => {
    try {
      // Placeholder for when notifications table exists
      console.log('Create notification not available yet');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    refetch: fetchNotifications
  };
}
