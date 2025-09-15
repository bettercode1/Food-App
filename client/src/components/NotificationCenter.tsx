import { useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

interface NotificationCenterProps {
  userType: string;
  isVisible: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'delivery' | 'promotion' | 'system';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationCenter({ userType, isVisible, onClose }: NotificationCenterProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch user's notifications
  const { data: userNotifications } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
    queryFn: async () => {
      const response = await fetch(`/api/notifications/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (userNotifications) {
      setNotifications(userNotifications);
    }
  }, [userNotifications]);

  useEffect(() => {
    // Demo notifications disabled - only show real notifications from API
    // Uncomment the code below if you want to re-enable demo notifications for testing
    
    /*
    // Simulate real-time notifications based on user type
    const notificationIntervals: NodeJS.Timeout[] = [];

    if (userType === 'employee') {
      // Employee notifications
      const employeeNotifications = [
        { 
          id: '1',
          title: '🍕 Order Update', 
          message: 'Your order #ORD-001 is being prepared by Canteen Delight',
          type: 'order' as const,
          delay: 5000 
        },
        { 
          id: '2',
          title: '💰 Payment Confirmed', 
          message: 'Your payment of ₹285 has been processed successfully',
          type: 'payment' as const,
          delay: 8000 
        },
        { 
          id: '3',
          title: '🚚 Order Ready', 
          message: 'Your order #ORD-002 is ready for pickup at North Spice Dhaba',
          type: 'delivery' as const,
          delay: 12000 
        },
        { 
          id: '4',
          title: '🎉 Special Offer', 
          message: 'Get 20% off on your next order at South Express!',
          type: 'promotion' as const,
          delay: 15000 
        }
      ];

      employeeNotifications.forEach(({ id, title, message, type, delay }) => {
        const timeout = setTimeout(() => {
          const notification: Notification = {
            id,
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
          };

          setNotifications(prev => [notification, ...prev]);

          toast({
            title,
            description: message,
            duration: 6000,
          });
        }, delay);

        notificationIntervals.push(timeout);
      });
    } else if (userType === 'manager') {
      // Manager notifications
      const managerNotifications = [
        { 
          id: '5',
          title: '📋 New Order', 
          message: 'New order #ORD-003 received from John Doe',
          type: 'order' as const,
          delay: 3000 
        },
        { 
          id: '6',
          title: '⏰ Reminder', 
          message: 'Order #ORD-001 is ready for pickup',
          type: 'system' as const,
          delay: 7000 
        },
        { 
          id: '7',
          title: '📊 Daily Summary', 
          message: 'You received 12 orders today with ₹2,450 revenue',
          type: 'system' as const,
          delay: 10000 
        }
      ];

      managerNotifications.forEach(({ id, title, message, type, delay }) => {
        const timeout = setTimeout(() => {
          const notification: Notification = {
            id,
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
          };

          setNotifications(prev => [notification, ...prev]);

          toast({
            title,
            description: message,
            duration: 6000,
          });
        }, delay);

        notificationIntervals.push(timeout);
      });
    }

    // Cleanup function
    return () => {
      notificationIntervals.forEach(interval => clearTimeout(interval));
    };
    */
  }, [userType, toast]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await apiRequest('PUT', `/api/notifications/${notificationId}/read`, {});
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return null; // This component only manages notifications in the background
}
