import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseAvailable } from '@/lib/firebase';
import { getFoodImageForDish, fetchRandomFoodImage } from '@/lib/foodApi';
import { 
  List, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Loader2,
  Store,
  BarChart3,
  Clock,
  Star,
  Truck,
  UtensilsCrossed,
  ShoppingBag,
  Circle,
  CheckCircle,
  Medal,
  Award,
  Trophy,
  Warehouse,
  Wheat,
  Beef,
  Milk,
  Leaf,
  ChefHat,
  PieChart,
  Building,
  Timer,
  Package,
  TrendingUp
} from 'lucide-react';
import type { Manager, Restaurant, Order } from '@/types';

// Live Orders Section Component  
function LiveOrdersSection() {
  const [mockOrders, setMockOrders] = useState<Order[]>([
    {
      id: 'order-1',
      orderNumber: 'ORD-001-2024',
      userId: 'user-1',
      restaurantId: 'restaurant-1',
      orderType: 'delivery',
      status: 'preparing',
      subtotal: 250,
      deliveryCharge: 20,
      gst: 27,
      total: 297,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      deliveryAddress: 'Block A, Office 204, Manyata Tech Park',
      estimatedTime: '15-20 min',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      items: [
        { id: '1', orderId: 'order-1', menuItemId: 'menu-1', quantity: 1, price: 120, total: 120, name: 'Paneer Butter Masala', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&h=80&fit=crop' },
        { id: '2', orderId: 'order-1', menuItemId: 'menu-2', quantity: 2, price: 25, total: 50, name: 'Butter Naan', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&h=80&fit=crop' },
        { id: '3', orderId: 'order-1', menuItemId: 'menu-5', quantity: 1, price: 60, total: 60, name: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop' }
      ]
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-002-2024',
      userId: 'user-2',
      restaurantId: 'restaurant-1',
      orderType: 'takeaway',
      status: 'ready',
      subtotal: 160,
      deliveryCharge: 0,
      gst: 16,
      total: 176,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      estimatedTime: '5-8 min',
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      items: [
        { id: '4', orderId: 'order-2', menuItemId: 'menu-3', quantity: 1, price: 160, total: 160, name: 'Chicken Curry', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=80&h=80&fit=crop' }
      ]
    },
    {
      id: 'order-3',
      orderNumber: 'ORD-003-2024',
      userId: 'user-3',
      restaurantId: 'restaurant-1',
      orderType: 'dine-in',
      status: 'placed',
      subtotal: 105,
      deliveryCharge: 0,
      gst: 11,
      total: 116,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      estimatedTime: '20-25 min',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      items: [
        { id: '5', orderId: 'order-3', menuItemId: 'menu-4', quantity: 1, price: 80, total: 80, name: 'Masala Dosa', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&h=80&fit=crop' },
        { id: '6', orderId: 'order-3', menuItemId: 'menu-2', quantity: 1, price: 25, total: 25, name: 'Butter Naan', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&h=80&fit=crop' }
      ]
    },
    {
      id: 'order-4',
      orderNumber: 'ORD-004-2024',
      userId: 'user-4',
      restaurantId: 'restaurant-1',
      orderType: 'delivery',
      status: 'placed',
      subtotal: 180,
      deliveryCharge: 25,
      gst: 20.5,
      total: 225.5,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      deliveryAddress: 'Block B, Office 105, Manyata Tech Park',
      estimatedTime: 'Not set',
      createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
      items: [
        { id: '7', orderId: 'order-4', menuItemId: 'menu-1', quantity: 1, price: 120, total: 120, name: 'Paneer Butter Masala', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&h=80&fit=crop' },
        { id: '8', orderId: 'order-4', menuItemId: 'menu-5', quantity: 1, price: 60, total: 60, name: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop' }
      ]
    }
  ]);
  const [preparationTimes, setPreparationTimes] = useState<Record<string, string>>({});
  const [showTimeModal, setShowTimeModal] = useState<string | null>(null);

  const { toast } = useToast();

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus, prepTime }: { orderId: string; newStatus: string; prepTime?: string }) => {
      // Mock API call - in real app, this would update the database
      return { success: true, orderId, newStatus, prepTime };
    },
    onSuccess: (result, variables) => {
      setMockOrders(prev => prev.map(order => 
        order.id === variables.orderId 
          ? { 
              ...order, 
              status: variables.newStatus,
              estimatedTime: variables.prepTime || order.estimatedTime
            }
          : order
      ));
      
      const order = mockOrders.find(o => o.id === variables.orderId);
      const statusMessages = {
        'confirmed': 'Order confirmed and kitchen has been notified',
        'preparing': 'Order is now being prepared in the kitchen',
        'ready': 'Order is ready for pickup/delivery',
        'dispatched': 'Order has been dispatched for delivery',
        'delivered': 'Order has been successfully delivered'
      };
      
      toast({
        title: 'Order Status Updated',
        description: statusMessages[variables.newStatus as keyof typeof statusMessages] || `Order ${order?.orderNumber} status updated to ${variables.newStatus}`,
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dispatched': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Package className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <ChefHat className="h-4 w-4" />;
      case 'ready': return <Circle className="h-4 w-4" />;
      case 'dispatched': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      'placed': 'confirmed',
      'confirmed': 'preparing', 
      'preparing': 'ready',
      'ready': 'dispatched',
      'dispatched': 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getStatusButtonText = (currentStatus: string) => {
    const buttonTexts = {
      'placed': 'Accept Order',
      'confirmed': 'Start Preparing',
      'preparing': 'Mark Ready',
      'ready': 'Dispatch Order',
      'dispatched': 'Mark Delivered'
    };
    return buttonTexts[currentStatus as keyof typeof buttonTexts];
  };

  const getOrderTypeIcon = (orderType: string) => {
    switch (orderType) {
      case 'delivery': return <Truck className="h-4 w-4" />;
      case 'dine-in': return <UtensilsCrossed className="h-4 w-4" />;
      case 'takeaway': return <ShoppingBag className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string, prepTime?: string) => {
    updateOrderStatusMutation.mutate({ orderId, newStatus, prepTime });
  };

  const handleAcceptOrder = (orderId: string) => {
    setShowTimeModal(orderId);
  };

  const handleConfirmWithTime = () => {
    if (showTimeModal && preparationTimes[showTimeModal]) {
      handleStatusUpdate(showTimeModal, 'confirmed', preparationTimes[showTimeModal]);
      setShowTimeModal(null);
    }
  };

  const getTimeAgo = (createdAt: string | Date | undefined) => {
    if (!createdAt) return 'Unknown';
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">

      {/* Live Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Active Orders ({mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length === 0 ? (
              <div className="text-center py-8">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                <p className="text-muted-foreground">No active orders at the moment</p>
              </div>
            ) : (
              mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).map((order) => (
                <Card key={order.id} className="bg-muted/20 border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {getOrderTypeIcon(order.orderType)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span className="capitalize">{order.orderType}</span>
                            <span>•</span>
                            <span>{getTimeAgo(order.createdAt)}</span>
                            <span>•</span>
                            <span>₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-background/50 rounded-lg p-2 border">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-sm font-medium">{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address for delivery orders */}
                    {order.orderType === 'delivery' && order.deliveryAddress && (
                      <div className="mb-4 p-3 bg-background/50 rounded-lg border">
                        <div className="flex items-center space-x-2 text-sm">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Delivery Address:</span>
                          <span className="font-medium">{order.deliveryAddress}</span>
                        </div>
                      </div>
                    )}

                    {/* Estimated Time Display */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Prep Time:</span>
                        <span className="font-medium text-foreground">
                          {order.estimatedTime === 'Not set' ? (
                            <span className="text-destructive">Not set</span>
                          ) : (
                            order.estimatedTime
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Payment:</span>
                        <Badge variant="outline" className="text-xs">
                          {order.paymentMethod?.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {order.status === 'placed' && 'New order - needs confirmation'}
                        {order.status === 'confirmed' && 'Confirmed - ready to start cooking'}
                        {order.status === 'preparing' && 'Currently being prepared'}
                        {order.status === 'ready' && 'Ready for pickup/delivery'}
                        {order.status === 'dispatched' && 'Out for delivery'}
                      </div>
                      <div className="flex space-x-2">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <>
                            {order.status === 'placed' ? (
                              <Button
                                size="sm"
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={updateOrderStatusMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                {updateOrderStatusMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Accept & Set Time
                              </Button>
                            ) : (
                              getNextStatus(order.status) && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status)!)}
                                  disabled={updateOrderStatusMutation.isPending}
                                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  {updateOrderStatusMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <>{getStatusIcon(getNextStatus(order.status)!)}<span className="ml-2">{getStatusButtonText(order.status)}</span></>
                                  )}
                                </Button>
                              )
                            )}
                            {order.status !== 'delivered' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                disabled={updateOrderStatusMutation.isPending}
                                className="shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Setting Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Set Preparation Time</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowTimeModal(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Preparation Time</label>
                  <select
                    value={preparationTimes[showTimeModal] || ''}
                    onChange={(e) => setPreparationTimes(prev => ({ ...prev, [showTimeModal!]: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="">Select time...</option>
                    <option value="10-15 min">10-15 minutes</option>
                    <option value="15-20 min">15-20 minutes</option>
                    <option value="20-25 min">20-25 minutes</option>
                    <option value="25-30 min">25-30 minutes</option>
                    <option value="30-35 min">30-35 minutes</option>
                    <option value="35-40 min">35-40 minutes</option>
                  </select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleConfirmWithTime}
                    className="flex-1"
                    disabled={!preparationTimes[showTimeModal]}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Order
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTimeModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Analytics Section Component
function AnalyticsSection() {
  const analyticsData = {
    todayRevenue: 5840,
    ordersCompleted: 47,
    averageOrderValue: 124,
    customerSatisfaction: 4.6,
    weeklyTrend: [120, 150, 180, 200, 250, 180, 297], // Last 7 days revenue
    popularItems: [
      { name: 'Paneer Butter Masala', orders: 12, revenue: 1440 },
      { name: 'Chicken Curry', orders: 8, revenue: 1280 },
      { name: 'Masala Dosa', orders: 15, revenue: 1200 },
      { name: 'Butter Naan', orders: 25, revenue: 625 }
    ],
    ordersByType: {
      delivery: 28,
      takeaway: 12,
      dineIn: 7
    },
    peakHours: [
      { hour: '12:00-13:00', orders: 12 },
      { hour: '13:00-14:00', orders: 18 },
      { hour: '19:00-20:00', orders: 15 },
      { hour: '20:00-21:00', orders: 8 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{analyticsData.todayRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders Completed</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.ordersCompleted}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+5% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-foreground">₹{analyticsData.averageOrderValue}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+8% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Rating</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.customerSatisfaction}/5</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+0.2 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Popular Items Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{item.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Order Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Delivery</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{analyticsData.ordersByType.delivery}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((analyticsData.ordersByType.delivery / analyticsData.ordersCompleted) * 100)}%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Takeaway</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{analyticsData.ordersByType.takeaway}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((analyticsData.ordersByType.takeaway / analyticsData.ordersCompleted) * 100)}%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Dine-in</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{analyticsData.ordersByType.dineIn}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((analyticsData.ordersByType.dineIn / analyticsData.ordersCompleted) * 100)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours & Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Peak Hours Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.peakHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">{hour.hour}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(hour.orders / 20) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-foreground w-8">{hour.orders}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Weekly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground w-8">{day}</span>
                  <div className="flex items-center space-x-2 flex-1 ml-4">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          index === 6 ? 'bg-primary' : 'bg-primary/70'
                        }`}
                        style={{ width: `${(analyticsData.weeklyTrend[index] / 300) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-foreground w-12">₹{analyticsData.weeklyTrend[index]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total this week:</span>
                <span className="font-bold text-foreground">₹{analyticsData.weeklyTrend.reduce((a, b) => a + b, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const { user } = useAuth() as { user: Manager };
  const { toast } = useToast();
  const [mockOrderUpdates, setMockOrderUpdates] = useState<Record<string, string>>({});
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showInventoryUpdate, setShowInventoryUpdate] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock restaurant data
  const mockRestaurant: Restaurant = {
    id: 'restaurant-1',
    name: 'Canteen Delight',
    description: 'Serving delicious, fresh meals for tech park employees with authentic flavors and quick service',
    cuisine: 'Multi-cuisine',
    rating: 4.5,
    preparationTime: '25-30 mins',
    estimatedTime: '25-30 mins',
    priceRange: '₹80-200',
    isOpen: true,
    deliveryAvailable: true,
    takeawayAvailable: true,
    dineinAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center',
    distance: 0.2,
  };

  // Restaurant status state
  const [restaurantStatus, setRestaurantStatus] = useState(mockRestaurant.isOpen);

  // Mock menu items
  const mockMenuItems = [
    {
      id: 'menu-1',
      name: 'Paneer Butter Masala',
      price: 120,
      description: 'Creamy tomato-based curry with fresh paneer',
      category: 'Main Course',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 'menu-2',
      name: 'Butter Naan',
      price: 25,
      description: 'Soft and fluffy bread with butter',
      category: 'Bread',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 'menu-3',
      name: 'Chicken Curry',
      price: 160,
      description: 'Spicy chicken curry with aromatic spices',
      category: 'Main Course',
      isAvailable: false,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 'menu-4',
      name: 'Masala Dosa',
      price: 80,
      description: 'Crispy crepe filled with spiced potatoes',
      category: 'South Indian',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 'menu-5',
      name: 'Cold Coffee',
      price: 60,
      description: 'Refreshing iced coffee with cream',
      category: 'Beverages',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop&crop=center',
    },
  ];

  // Initialize component state
  useEffect(() => {
    setMenuItems(mockMenuItems);
  }, []);

  // CRUD Mutations
  const updateRestaurantStatusMutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      // Mock update for demo - in real app, this would call API
      return { success: true, isOpen: newStatus };
    },
    onSuccess: (result) => {
      setRestaurantStatus(result.isOpen);
      
      toast({
        title: `Restaurant ${result.isOpen ? 'Opened' : 'Closed'}`,
        description: `Your restaurant is now ${result.isOpen ? 'accepting orders' : 'closed for orders'}`,
        variant: result.isOpen ? 'default' : 'destructive',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Status Update Failed',
        description: 'Failed to update restaurant status. Please try again.',
      });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: any }) => {
      // Mock update for demo
      return { success: true, itemId, updates };
    },
    onSuccess: (result, variables) => {
      setMenuItems(prev => prev.map(item => 
        item.id === variables.itemId 
          ? { ...item, ...variables.updates }
          : item
      ));
      
      toast({
        title: 'Item Updated',
        description: 'Menu item has been updated successfully',
      });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      // Mock delete for demo
      return { success: true, itemId };
    },
    onSuccess: (result, itemId) => {
      const item = menuItems.find(item => item.id === itemId);
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: 'Item Deleted',
        description: `${item?.name} has been removed from the menu`,
        variant: 'destructive',
      });
    },
  });

  const addMenuItemMutation = useMutation({
    mutationFn: async (newItem: any) => {
      // Mock create for demo
      return {
        ...newItem,
        id: `menu-${Date.now()}`,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center',
      };
    },
    onSuccess: (newItem) => {
      setMenuItems(prev => [...prev, newItem]);
      setShowAddItemForm(false);
      
      toast({
        title: 'Item Added',
        description: `${newItem.name} has been added to the menu`,
      });
    },
  });

  // Event handlers
  const handleToggleItemAvailability = (itemId: string) => {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    updateMenuItemMutation.mutate({
      itemId,
      updates: { isAvailable: !item.isAvailable }
    });
  };

  const handleDeleteItem = (itemId: string) => {
    deleteMenuItemMutation.mutate(itemId);
  };

  const handleAddItem = (newItem: any) => {
    addMenuItemMutation.mutate(newItem);
  };

  const handleEditItem = (itemId: string, updates: any) => {
    updateMenuItemMutation.mutate({ itemId, updates });
  };

  const handleToggleRestaurantStatus = () => {
    updateRestaurantStatusMutation.mutate(!restaurantStatus);
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-restaurant-name">
              {mockRestaurant.name} Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your menu and orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant={restaurantStatus ? "default" : "destructive"}
              className="px-4 py-2"
            >
              <Circle className={`h-4 w-4 mr-2 ${restaurantStatus ? 'text-chart-2 fill-chart-2' : 'text-destructive fill-destructive'}`} />
              Restaurant {restaurantStatus ? 'Open' : 'Closed'}
            </Badge>
            <Button
              variant={restaurantStatus ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleRestaurantStatus}
              disabled={updateRestaurantStatusMutation.isPending}
              className="min-w-[100px] shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {updateRestaurantStatusMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  {restaurantStatus ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Close Restaurant
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Open Restaurant
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Live Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          {/* Restaurant Status Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-2 text-primary" />
                  Restaurant Status
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={restaurantStatus ? "default" : "destructive"}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    <Circle className={`h-3 w-3 mr-2 ${restaurantStatus ? 'text-chart-2 fill-chart-2' : 'text-destructive fill-destructive'}`} />
                    {restaurantStatus ? 'Currently Open' : 'Currently Closed'}
                  </Badge>
                  <Button
                    variant={restaurantStatus ? "destructive" : "default"}
                    size="sm"
                    onClick={handleToggleRestaurantStatus}
                    disabled={updateRestaurantStatusMutation.isPending}
                    className="min-w-[120px] shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {updateRestaurantStatusMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        {restaurantStatus ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Close Now
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Open Now
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Operating Hours: 8:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Rating: {mockRestaurant.rating}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>{restaurantStatus ? 'Accepting Orders' : 'Not Accepting Orders'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Menu Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <List className="h-5 w-5 mr-2 text-primary" />
                    Current Menu ({menuItems.length} items)
                  </CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddItemForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {menuItems.length === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-muted-foreground">No menu items yet</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setShowAddItemForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          !item.isAvailable ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-border"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=48&h=48&fit=crop&crop=center';
                            }}
                          />
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.price} • {item.isAvailable ? 'Available' : 'Out of Stock'}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={item.isAvailable ? "outline" : "secondary"}
                            className={item.isAvailable ? "bg-chart-2/10 text-chart-2" : ""}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {item.isAvailable ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setEditingItem(item)}
                            title="Edit item"
                            disabled={updateMenuItemMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleToggleItemAvailability(item.id)}
                            title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                            disabled={updateMenuItemMutation.isPending}
                          >
                            {item.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Delete item"
                            className="text-destructive hover:text-destructive"
                            disabled={deleteMenuItemMutation.isPending}
                          >
                            {deleteMenuItemMutation.isPending && deleteMenuItemMutation.variables === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Warehouse className="h-5 w-5 mr-2 text-primary" />
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-chart-2/5 border border-chart-2/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Wheat className="h-8 w-8 text-chart-2" />
                      <div>
                        <h4 className="font-medium">Roti/Naan</h4>
                        <p className="text-sm text-muted-foreground">Wheat flour stock</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-chart-2">85</div>
                      <div className="text-xs text-muted-foreground">units left</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-chart-3/5 border border-chart-3/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Milk className="h-8 w-8 text-chart-3" />
                      <div>
                        <h4 className="font-medium">Paneer</h4>
                        <p className="text-sm text-muted-foreground">Fresh cottage cheese</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-chart-3">12</div>
                      <div className="text-xs text-muted-foreground">kg left</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Beef className="h-8 w-8 text-destructive" />
                      <div>
                        <h4 className="font-medium">Chicken</h4>
                        <p className="text-sm text-muted-foreground">Fresh chicken cuts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-destructive">0</div>
                      <div className="text-xs text-muted-foreground">kg left</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-chart-1/5 border border-chart-1/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Leaf className="h-8 w-8 text-chart-1" />
                      <div>
                        <h4 className="font-medium">Vegetables</h4>
                        <p className="text-sm text-muted-foreground">Mixed vegetables</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-chart-1">28</div>
                      <div className="text-xs text-muted-foreground">kg left</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowInventoryUpdate(true)}
                    disabled={showInventoryUpdate}
                  >
                    {showInventoryUpdate ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Update Inventory
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Add Item Form Modal */}
          {showAddItemForm && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Add New Menu Item</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddItemForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddItemForm 
                  onAddItem={handleAddItem}
                  onCancel={() => setShowAddItemForm(false)}
                  isLoading={addMenuItemMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Edit Item Form Modal */}
          {editingItem && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Menu Item</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingItem(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditItemForm 
                  item={editingItem}
                  onEditItem={(updates: any) => {
                    handleEditItem(editingItem.id, updates);
                    setEditingItem(null);
                  }}
                  onCancel={() => setEditingItem(null)}
                  isLoading={updateMenuItemMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <LiveOrdersSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add Item Form Component
function AddItemForm({ onAddItem, onCancel, isLoading }: { 
  onAddItem: (item: any) => void; 
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Main Course',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || isLoading) {
      return;
    }
    
    onAddItem({
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      category: formData.category,
      isAvailable: true,
    });
    
    setFormData({ name: '', price: '', description: '', category: 'Main Course' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Item Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="e.g., Chicken Biryani"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Price (₹)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="120"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="Brief description of the item"
          rows={3}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          disabled={isLoading}
        >
          <option value="Main Course">Main Course</option>
          <option value="Bread">Bread</option>
          <option value="South Indian">South Indian</option>
          <option value="Beverages">Beverages</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Edit Item Form Component
function EditItemForm({ item, onEditItem, onCancel, isLoading }: {
  item: any;
  onEditItem: (updates: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: item.name || '',
    price: item.price?.toString() || '',
    description: item.description || '',
    category: item.category || 'Main Course',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || isLoading) {
      return;
    }
    
    onEditItem({
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      category: formData.category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Item Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="e.g., Chicken Biryani"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Price (₹)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="120"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="Brief description of the item"
          rows={3}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded-lg bg-background"
          disabled={isLoading}
        >
          <option value="Main Course">Main Course</option>
          <option value="Bread">Bread</option>
          <option value="South Indian">South Indian</option>
          <option value="Beverages">Beverages</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Item
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
