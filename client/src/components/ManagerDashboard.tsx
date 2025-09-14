import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { Manager, Restaurant, Order } from '@/types';

export default function ManagerDashboard() {
  const { user } = useAuth() as { user: Manager };
  const { toast } = useToast();

  const { data: restaurant, isLoading: restaurantLoading } = useQuery<Restaurant>({
    queryKey: ['/api/manager', user.id, 'restaurant'],
    enabled: !!user?.id,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders/restaurant', restaurant?.id],
    enabled: !!restaurant?.id,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/restaurant'] });
      toast({
        title: 'Order Updated',
        description: 'Order status has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update order status. Please try again.',
      });
    },
  });

  const handleOrderStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  if (restaurantLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-store-slash text-4xl text-muted-foreground mb-4"></i>
        <h3 className="text-lg font-semibold text-foreground mb-2">Restaurant Not Found</h3>
        <p className="text-muted-foreground">No restaurant is associated with your account.</p>
      </div>
    );
  }

  const newOrders = orders?.filter(order => order.status === 'placed') || [];
  const preparingOrders = orders?.filter(order => order.status === 'preparing') || [];
  const readyOrders = orders?.filter(order => order.status === 'ready') || [];

  const todayOrders = orders?.filter(order => {
    const orderDate = new Date(order.createdAt!);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }) || [];

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-restaurant-name">
            {restaurant.name} Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your menu and orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge 
            variant={restaurant.isOpen ? "default" : "destructive"}
            className="px-4 py-2"
            data-testid="badge-restaurant-status"
          >
            <i className={`fas fa-circle mr-2 ${restaurant.isOpen ? 'text-chart-2' : 'text-destructive'}`}></i>
            Restaurant {restaurant.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" data-testid="tab-live-orders">Live Orders</TabsTrigger>
          <TabsTrigger value="menu" data-testid="tab-menu-management">Menu Management</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {ordersLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* New Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>New Orders</CardTitle>
                    <Badge variant="outline" data-testid="badge-new-orders">
                      {newOrders.length} pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-inbox text-2xl text-muted-foreground mb-2"></i>
                      <p className="text-muted-foreground">No new orders</p>
                    </div>
                  ) : (
                    newOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-chart-3">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-foreground" data-testid={`text-order-${order.id}`}>
                              {order.orderNumber}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold">Total: ₹{order.total}</span>
                            <Badge 
                              variant={order.orderType === 'delivery' ? 'default' : 'secondary'}
                              data-testid={`badge-order-type-${order.id}`}
                            >
                              {order.orderType}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-chart-2 hover:bg-chart-2/90"
                              onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                              data-testid={`button-accept-${order.id}`}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                              data-testid={`button-reject-${order.id}`}
                            >
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Preparing Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Preparing</CardTitle>
                    <Badge variant="outline" data-testid="badge-preparing-orders">
                      {preparingOrders.length} active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preparingOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-clock text-2xl text-muted-foreground mb-2"></i>
                      <p className="text-muted-foreground">No orders preparing</p>
                    </div>
                  ) : (
                    preparingOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-chart-3 bg-chart-3/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-foreground">
                              {order.orderNumber}
                            </span>
                            <span className="text-sm text-chart-3 font-medium">
                              {order.estimatedTime || 'In progress'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold">Total: ₹{order.total}</span>
                            <Badge variant="secondary">{order.orderType}</Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-chart-2 hover:bg-chart-2/90"
                            onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                            data-testid={`button-ready-${order.id}`}
                          >
                            Mark as Ready
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Ready Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ready</CardTitle>
                    <Badge variant="outline" data-testid="badge-ready-orders">
                      {readyOrders.length} ready
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readyOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-check-circle text-2xl text-muted-foreground mb-2"></i>
                      <p className="text-muted-foreground">No orders ready</p>
                    </div>
                  ) : (
                    readyOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-chart-2 bg-chart-2/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-foreground">
                              {order.orderNumber}
                            </span>
                            <span className="text-sm text-chart-2 font-medium">Ready</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold">Total: ₹{order.total}</span>
                            <Badge variant="secondary">{order.orderType}</Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleOrderStatusUpdate(order.id, order.orderType === 'delivery' ? 'dispatched' : 'delivered')}
                            data-testid={`button-dispatch-${order.id}`}
                          >
                            {order.orderType === 'delivery' ? 'Mark as Dispatched' : 'Mark as Completed'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Menu Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <i className="fas fa-list-ul mr-2 text-primary"></i>
                    Current Menu
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <i className="fas fa-plus mr-2"></i>
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <i className="fas fa-seedling text-chart-2"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Paneer Butter Masala</h4>
                        <p className="text-sm text-muted-foreground">₹120 • Available</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2">
                        <i className="fas fa-eye mr-1"></i>
                        Active
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <i className="fas fa-bread-slice text-chart-3"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Butter Naan</h4>
                        <p className="text-sm text-muted-foreground">₹25 • Available</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2">
                        <i className="fas fa-eye mr-1"></i>
                        Active
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <i className="fas fa-drumstick-bite text-chart-5"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Chicken Curry</h4>
                        <p className="text-sm text-muted-foreground">₹160 • Out of Stock</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        <i className="fas fa-eye-slash mr-1"></i>
                        Inactive
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-warehouse mr-2 text-primary"></i>
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-chart-2/5 border border-chart-2/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-bread-slice text-2xl text-chart-2"></i>
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
                      <i className="fas fa-cheese text-2xl text-chart-3"></i>
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
                      <i className="fas fa-drumstick-bite text-2xl text-destructive"></i>
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
                      <i className="fas fa-seedling text-2xl text-chart-1"></i>
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
                  <Button className="w-full" variant="outline">
                    <i className="fas fa-plus mr-2"></i>
                    Update Inventory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2" data-testid="text-orders-today">
                  {todayOrders.length}
                </div>
                <div className="text-sm text-muted-foreground">Orders Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-2 mb-2" data-testid="text-revenue-today">
                  ₹{todayRevenue}
                </div>
                <div className="text-sm text-muted-foreground">Revenue Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-3 mb-2">
                  {restaurant.preparationTime}
                </div>
                <div className="text-sm text-muted-foreground">Avg Prep Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-5 mb-2">
                  {restaurant.rating}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-chart-pie mr-2 text-primary"></i>
                  Order Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['delivery', 'dine-in', 'takeaway'].map((type) => {
                    const typeOrders = todayOrders.filter(order => order.orderType === type);
                    const percentage = todayOrders.length > 0 ? Math.round((typeOrders.length / todayOrders.length) * 100) : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className={`fas ${
                            type === 'delivery' ? 'fa-truck' : 
                            type === 'dine-in' ? 'fa-utensils' : 'fa-shopping-bag'
                          } text-primary`}></i>
                          <span className="text-muted-foreground capitalize">{type}</span>
                        </div>
                        <span className="text-foreground font-medium">
                          {typeOrders.length} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-star mr-2 text-primary"></i>
                  Popular Items & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Popular Items Section */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Most Ordered Today</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-chart-2/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-medal text-chart-2"></i>
                          <span className="font-medium">Masala Dosa</span>
                        </div>
                        <span className="text-sm text-chart-2 font-medium">8 orders</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-chart-3/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-award text-chart-3"></i>
                          <span className="font-medium">Paneer Butter Masala</span>
                        </div>
                        <span className="text-sm text-chart-3 font-medium">6 orders</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-chart-1/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-trophy text-chart-1"></i>
                          <span className="font-medium">Cold Coffee</span>
                        </div>
                        <span className="text-sm text-chart-1 font-medium">5 orders</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {orders?.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">{order.orderNumber}</span>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'preparing' ? 'secondary' :
                              'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      )) || []}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
