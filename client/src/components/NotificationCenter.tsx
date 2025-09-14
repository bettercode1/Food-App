import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  icon: string;
}

interface NotificationCenterProps {
  userType: 'employee' | 'manager';
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ userType, isVisible, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Demo notifications based on user type
  useEffect(() => {
    if (userType === 'manager') {
      setNotifications([
        {
          id: '1',
          title: 'New Order Received',
          message: 'Order #ORD-2025-1002 has been placed. Estimated prep time: 15-20 min',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          read: false,
          icon: '🍽️'
        },
        {
          id: '2',
          title: 'Order Ready for Pickup',
          message: 'Order #ORD-2025-1001 is ready for customer pickup',
          type: 'success',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          icon: '✅'
        },
        {
          id: '3',
          title: 'Low Inventory Alert',
          message: 'Chicken stock is running low (0 kg remaining). Please restock soon.',
          type: 'warning',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: true,
          icon: '⚠️'
        },
        {
          id: '4',
          title: 'Daily Revenue Update',
          message: 'Today\'s revenue: ₹2,450 from 8 orders. Great performance!',
          type: 'success',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true,
          icon: '💰'
        }
      ]);
    } else {
      setNotifications([
        {
          id: '1',
          title: 'Order Status Update',
          message: 'Your order #ORD-2025-1001 is now being prepared by the chef',
          type: 'info',
          timestamp: new Date(Date.now() - 1 * 60 * 1000),
          read: false,
          icon: '👨‍🍳'
        },
        {
          id: '2',
          title: 'Payment Successful',
          message: 'Your payment of ₹154 has been processed successfully',
          type: 'success',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: true,
          icon: '✅'
        },
        {
          id: '3',
          title: 'Special Offer',
          message: 'Get 20% off on your next order at South Express. Use code: SAVE20',
          type: 'info',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          read: true,
          icon: '🎉'
        }
      ]);
    }
  }, [userType]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: '✅ All Notifications Read',
      description: 'All notifications have been marked as read.',
      duration: 2000,
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast({
      title: '🗑️ Notifications Cleared',
      description: 'All notifications have been cleared.',
      duration: 2000,
    });
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-l-chart-2 bg-chart-2/5';
      case 'warning': return 'border-l-chart-3 bg-chart-3/5';
      case 'error': return 'border-l-destructive bg-destructive/5';
      default: return 'border-l-chart-1 bg-chart-1/5';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="flex items-center">
                <i className="fas fa-bell mr-2 text-primary"></i>
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onClose}>
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-bell-slash text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 cursor-pointer hover:bg-accent/50 border-l-4 ${getTypeColor(notification.type)} ${
                      !notification.read ? 'bg-accent/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
          
          {notifications.length > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearNotifications}
                className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Clear All Notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}