import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import GoogleMap from './GoogleMap';
import type { Order } from '@/types';

interface OrderTrackingProps {
  order: Order;
}

const orderStatuses = [
  { key: 'placed', label: 'Order Placed', icon: 'fa-receipt', color: 'text-chart-1' },
  { key: 'confirmed', label: 'Order Confirmed', icon: 'fa-check-circle', color: 'text-chart-2' },
  { key: 'preparing', label: 'Preparing Order', icon: 'fa-clock', color: 'text-chart-3' },
  { key: 'ready', label: 'Order Ready', icon: 'fa-utensils', color: 'text-chart-2' },
  { key: 'dispatched', label: 'Out for Delivery', icon: 'fa-truck', color: 'text-chart-1' },
  { key: 'delivered', label: 'Delivered', icon: 'fa-home', color: 'text-chart-2' }
];

export default function OrderTracking({ order }: OrderTrackingProps) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('15-20 min');
  const { toast } = useToast();

  useEffect(() => {
    const statusIndex = orderStatuses.findIndex(status => status.key === order.status);
    setCurrentStatusIndex(statusIndex >= 0 ? statusIndex : 0);
  }, [order.status]);

  // Simulate real-time order progression for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        // Auto-progress through statuses for demo
        if (prev < orderStatuses.length - 1) {
          const nextIndex = Math.min(prev + 1, orderStatuses.length - 1);
          const nextStatus = orderStatuses[nextIndex];
          
          // Update estimated time based on progress
          const timeRemaining = Math.max(1, 20 - (nextIndex * 4));
          setEstimatedTime(`${timeRemaining}-${timeRemaining + 5} min`);
          
          // Show notification for status update
          const getStatusMessage = (status: typeof nextStatus) => {
            switch (status.key) {
              case 'confirmed':
                return {
                  title: '✅ Order Confirmed!',
                  description: 'Your order has been confirmed by the restaurant. We\'re starting preparation!',
                  icon: '🎉'
                };
              case 'preparing':
                return {
                  title: '👨‍🍳 Preparing Your Order',
                  description: `The chef is now preparing your delicious meal. Estimated time: ${timeRemaining}-${timeRemaining + 5} min`,
                  icon: '🔥'
                };
              case 'ready':
                return {
                  title: '🍽️ Order Ready!',
                  description: order.orderType === 'delivery' ? 'Your order is ready and will be dispatched shortly.' : 'Your order is ready for pickup!',
                  icon: '✨'
                };
              case 'dispatched':
                return {
                  title: '🚛 Out for Delivery',
                  description: 'Your order is on its way! Our delivery partner will reach you soon.',
                  icon: '📍'
                };
              case 'delivered':
                return {
                  title: '🎊 Order Delivered!',
                  description: 'Your order has been delivered successfully. Enjoy your meal!',
                  icon: '🥳'
                };
              default:
                return {
                  title: 'Order Update',
                  description: `Your order status has been updated to ${status.label}`,
                  icon: '📝'
                };
            }
          };

          const message = getStatusMessage(nextStatus);
          toast({
            title: message.title,
            description: message.description,
            duration: 5000,
          });
          
          return nextIndex;
        }
        return prev;
      });
    }, 30000); // Progress every 30 seconds for demo

    return () => clearInterval(interval);
  }, [toast, order.orderType]);

  // Use simulated progress for demo, fallback to actual order status
  const displayStatusIndex = Math.max(currentStatusIndex, simulatedProgress);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-2xl text-chart-2"></i>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground">
          Your order <span className="font-semibold" data-testid="text-order-number">{order.orderNumber}</span> has been placed successfully
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orderStatuses.map((status, index) => {
                const isCompleted = index <= displayStatusIndex;
                const isCurrent = index === displayStatusIndex;
                
                return (
                  <div key={status.key} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-chart-2 text-white' 
                        : isCurrent 
                        ? 'bg-chart-3 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <i className={`fas ${status.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isCurrent ? status.color : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`} data-testid={`text-status-${status.key}`}>
                        {status.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted 
                          ? index === 0 
                            ? new Date(order.createdAt!).toLocaleTimeString()
                            : 'Completed'
                          : isCurrent && status.key === 'preparing'
                          ? `Estimated completion: ${order.estimatedTime || '15-20 min'}`
                          : 'Pending'
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Map / Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {order.orderType === 'delivery' ? 'Live Tracking' : 'Order Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.orderType === 'delivery' ? (
              <>
                <div className="bg-muted h-64 rounded-lg flex items-center justify-center mb-4" data-testid="delivery-map">
                  <div className="text-center">
                    <i className="fas fa-map-marked-alt text-4xl text-muted-foreground mb-2"></i>
                    <p className="text-muted-foreground font-medium">Live Delivery Tracking</p>
                    <p className="text-sm text-muted-foreground">Real-time location updates</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Delivery Address</span>
                    <span className="text-sm font-medium text-foreground">
                      {order.deliveryAddress || 'Block A, Office 204'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Time</span>
                    <span className="text-sm font-medium text-chart-2" data-testid="text-estimated-time">
                      {estimatedTime}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <i className={`fas ${
                    order.orderType === 'dine-in' ? 'fa-utensils' : 'fa-shopping-bag'
                  } text-4xl text-muted-foreground mb-4`}></i>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {order.orderType === 'dine-in' ? 'Dine-in Order' : 'Takeaway Order'}
                  </h3>
                  <p className="text-muted-foreground">
                    {order.orderType === 'dine-in' 
                      ? 'Your table will be ready when your order is prepared'
                      : 'You can collect your order when ready'
                    }
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order Type</span>
                    <Badge variant="outline" data-testid="badge-order-type">
                      {order.orderType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-sm font-medium text-foreground">₹{order.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Ready Time</span>
                    <span className="text-sm font-medium text-chart-2">
                      {order.estimatedTime || '15-20 minutes'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
