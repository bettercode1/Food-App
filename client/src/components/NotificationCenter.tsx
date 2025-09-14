import { useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

export default function NotificationCenter() {
  const { toast } = useToast();

  useEffect(() => {
    // Simulate order status updates
    const notifications = [
      { 
        title: 'Order Update', 
        message: 'Your order #ORD-001 is being prepared',
        delay: 5000 
      },
      { 
        title: 'Order Ready', 
        message: 'Your order #ORD-002 is ready for pickup',
        delay: 10000 
      }
    ];

    notifications.forEach(({ title, message, delay }) => {
      setTimeout(() => {
        toast({
          title,
          description: message,
          duration: 4000,
        });
      }, delay);
    });
  }, [toast]);

  return null; // This component only manages notifications
}