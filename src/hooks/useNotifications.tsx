
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
      // Using raw SQL query since the notifications table might not be in the generated types yet
      const { data, error } = await supabase.rpc('get_user_notifications', { user_id: user.id });
      
      if (error && error.code === '42883') {
        // Function doesn't exist, try direct query
        console.log('Notifications function not found, using direct query approach');
        return;
      }
      
      if (error) throw error;
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // For now, just set empty array to prevent errors
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Use raw update for now
      const { error } = await supabase.rpc('mark_notification_read', { 
        notification_id: notificationId 
      });

      if (error && error.code === '42883') {
        console.log('Mark read function not found, feature not available yet');
        return;
      }

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('mark_all_notifications_read', { 
        user_id: user.id 
      });

      if (error && error.code === '42883') {
        console.log('Mark all read function not found, feature not available yet');
        return;
      }

      if (error) throw error;
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
      const { error } = await supabase.rpc('create_notification', {
        user_id: userId,
        order_id: orderId,
        notification_type: type,
        title: title,
        message: message
      });

      if (error && error.code === '42883') {
        console.log('Create notification function not found, feature not available yet');
        return;
      }

      if (error) throw error;
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
