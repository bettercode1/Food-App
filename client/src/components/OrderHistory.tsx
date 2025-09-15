import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { Order, User } from '@/types';

interface OrderHistoryProps {
  onReorder?: (order: Order) => void;
}

export default function OrderHistory({ onReorder }: OrderHistoryProps) {
  const { user } = useAuth() as { user: User };
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders/user', user.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/orders/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      return response.json();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (order: Order) => {
      // Simulate reorder by creating a new order with the same items
      const orderItems = order.items?.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })) || [];

      const response = await apiRequest('POST', '/api/orders', {
        order: {
          userId: user.id,
          restaurantId: order.restaurantId,
          orderType: order.orderType,
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          gst: order.gst,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: 'pending',
          deliveryAddress: order.deliveryAddress,
          estimatedTime: order.estimatedTime,
        },
        items: orderItems,
      });
      
      return response.json();
    },
    onSuccess: (newOrder) => {
      toast({
        title: 'Order Recreated',
        description: `Order ${newOrder.orderNumber} has been added to your cart.`,
      });
      if (onReorder) {
        onReorder(newOrder);
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Reorder Failed',
        description: error.message || 'Failed to recreate order. Please try again.',
      });
    },
  });

  const filteredOrders = orders?.filter(order => {
    switch (activeTab) {
      case 'completed':
        return order.status === 'delivered';
      case 'pending':
        return ['placed', 'confirmed', 'preparing', 'ready', 'dispatched'].includes(order.status);
      case 'cancelled':
        return order.status === 'cancelled';
      default:
        return true;
    }
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return 'fa-receipt';
      case 'confirmed':
        return 'fa-check-circle';
      case 'preparing':
        return 'fa-clock';
      case 'ready':
        return 'fa-utensils';
      case 'dispatched':
        return 'fa-truck';
      case 'delivered':
        return 'fa-home';
      case 'cancelled':
        return 'fa-times-circle';
      default:
        return 'fa-question-circle';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'text-chart-1';
      case 'confirmed':
        return 'text-chart-2';
      case 'preparing':
        return 'text-chart-3';
      case 'ready':
        return 'text-chart-2';
      case 'dispatched':
        return 'text-chart-1';
      case 'delivered':
        return 'text-chart-2';
      case 'cancelled':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Order History</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Order History</h2>
          <p className="text-muted-foreground mt-1">
            <i className="fas fa-history mr-1"></i>
            {orders?.length || 0} total orders
          </p>
        </div>
        <Button variant="outline" className="flex items-center">
          <i className="fas fa-download mr-2"></i>
          Export
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center">
            <i className="fas fa-list mr-2"></i>
            All ({orders?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Completed ({orders?.filter(o => o.status === 'delivered').length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <i className="fas fa-clock mr-2"></i>
            Pending ({orders?.filter(o => ['placed', 'confirmed', 'preparing', 'ready', 'dispatched'].includes(o.status)).length || 0})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center">
            <i className="fas fa-times-circle mr-2"></i>
            Cancelled ({orders?.filter(o => o.status === 'cancelled').length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'}
                          className="flex items-center"
                        >
                          <i className={`fas ${getStatusIcon(order.status)} mr-1 ${getStatusColor(order.status)}`}></i>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <i className="fas fa-calendar mr-1"></i>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">₹{order.total}</p>
                      <p className="text-sm text-muted-foreground">
                        <i className="fas fa-credit-card mr-1"></i>
                        {order.paymentMethod || 'Payment method not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <i className="fas fa-store mr-1"></i>
                      Restaurant ID: {order.restaurantId}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <i className="fas fa-shipping-fast mr-1"></i>
                      Order Type: {order.orderType}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-sm text-muted-foreground">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {order.deliveryAddress}
                      </p>
                    )}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        <i className="fas fa-list-ul mr-1"></i>
                        Items ({order.items.length})
                      </h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-muted-foreground">
                            <span>Item {index + 1}</span>
                            <span>Qty: {item.quantity} × ₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {/* Navigate to order details */}}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => reorderMutation.mutate(order)}
                          disabled={reorderMutation.isPending}
                        >
                          {reorderMutation.isPending ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-1"></i>
                              Reordering...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-redo mr-1"></i>
                              Reorder
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.estimatedTime && (
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          Est: {order.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No ${activeTab} orders found.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
