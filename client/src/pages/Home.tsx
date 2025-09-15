import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useViewMode } from '@/hooks/useViewMode';
import UnifiedAuth from '@/components/UnifiedAuth';
import TechParkSelection from '@/components/TechParkSelection';
import FoodPlaces from '@/components/FoodPlaces';
import RestaurantMenu from '@/components/RestaurantMenu';
import Cart from '@/components/Cart';
import Payment from '@/components/Payment';
import OrderTracking from '@/components/OrderTracking';
import ManagerDashboard from '@/components/ManagerDashboard';
import NotificationCenter from '@/components/NotificationCenter';
import { Bell as Notifications } from 'lucide-react';
import type { TechPark, Restaurant, CartItem, MenuItem, Order, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type UserFlow = 'login' | 'tech-parks' | 'restaurants' | 'menu' | 'cart' | 'payment' | 'tracking';

export default function Home() {
  const { user, userType } = useAuth();
  const { viewMode } = useViewMode();
  const { toast } = useToast();
  
  const [userFlow, setUserFlow] = useState<UserFlow>('login');
  const [selectedPark, setSelectedPark] = useState<TechPark | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Reset flow when user changes
  if (user && userType === 'employee' && userFlow === 'login') {
    setUserFlow('tech-parks');
  }

  const handleSelectPark = (park: TechPark) => {
    setSelectedPark(park);
    setUserFlow('restaurants');
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setUserFlow('menu');
  };

  const handleUpdateCart = (menuItem: MenuItem, action: 'add' | 'remove' | 'increment' | 'decrement') => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.menuItem.id === menuItem.id);
      const newCart = [...prevCart];

      switch (action) {
        case 'add':
          if (existingItemIndex >= 0) {
            newCart[existingItemIndex].quantity += 1;
          } else {
            newCart.push({ menuItem, quantity: 1 });
          }
          break;
        
        case 'increment':
          if (existingItemIndex >= 0) {
            newCart[existingItemIndex].quantity += 1;
          }
          break;
        
        case 'decrement':
          if (existingItemIndex >= 0) {
            if (newCart[existingItemIndex].quantity > 1) {
              newCart[existingItemIndex].quantity -= 1;
            } else {
              newCart.splice(existingItemIndex, 1);
            }
          }
          break;
        
        case 'remove':
          if (existingItemIndex >= 0) {
            newCart.splice(existingItemIndex, 1);
          }
          break;
      }

      return newCart;
    });
  };

  const handleUpdateCartById = (menuItemId: string, action: 'increment' | 'decrement' | 'remove') => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.menuItem.id === menuItemId);
      if (existingItemIndex < 0) return prevCart;

      const newCart = [...prevCart];
      
      switch (action) {
        case 'increment':
          newCart[existingItemIndex].quantity += 1;
          break;
        
        case 'decrement':
          if (newCart[existingItemIndex].quantity > 1) {
            newCart[existingItemIndex].quantity -= 1;
          } else {
            newCart.splice(existingItemIndex, 1);
          }
          break;
        
        case 'remove':
          newCart.splice(existingItemIndex, 1);
          break;
      }

      return newCart;
    });
  };

  const handleViewCart = () => {
    setUserFlow('cart');
  };

  const handleProceedToPayment = (orderData: any) => {
    setPaymentData(orderData);
    setUserFlow('payment');
  };

  const handlePaymentConfirm = async (paymentMethod: string) => {
    if (!user || !selectedRestaurant || cart.length === 0 || !paymentData) {
      toast({
        variant: 'destructive',
        title: 'Order Error',
        description: 'Missing required information to place order.',
      });
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
        total: item.menuItem.price * item.quantity,
      }));

      const orderRequest = {
        order: {
          userId: user.id,
          restaurantId: selectedRestaurant.id,
          orderType: paymentData.orderType,
          subtotal: paymentData.subtotal,
          deliveryCharge: paymentData.deliveryCharge,
          gst: paymentData.gst,
          total: paymentData.total,
          paymentMethod: paymentMethod,
          paymentStatus: 'completed',
          deliveryAddress: paymentData.orderType === 'delivery' ? 'Block A, Office 204' : null,
          estimatedTime: selectedRestaurant.preparationTime,
        },
        items: orderItems,
      };

      const response = await apiRequest('POST', '/api/orders', orderRequest);
      const newOrder = await response.json();
      
      setCurrentOrder(newOrder);
      setCart([]); // Clear cart
      setUserFlow('tracking');
      
      toast({
        title: 'Order Placed Successfully',
        description: `Your order ${newOrder.orderNumber} has been confirmed!`,
      });
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
      });
    }
  };

  const handleBackToCart = () => {
    setUserFlow('cart');
  };

  // Show appropriate view based on view mode and authentication
  if (!user) {
    return (
      <div key={`auth-${viewMode}`}>
        <UnifiedAuth />
      </div>
    );
  }

  if (userType === 'manager') {
    return (
      <div>
        {/* Manager Header with Notifications */}
        <div className="fixed top-0 right-0 p-4 z-40">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Notifications className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        
        <ManagerDashboard />
        
        <NotificationCenter
          userType="manager"
          isVisible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    );
  }

  // User flow - wrap with notification header
  const renderEmployeeContent = () => {
    switch (userFlow) {
      case 'tech-parks':
        return <TechParkSelection onSelectPark={handleSelectPark} />;
    
    case 'restaurants':
      return selectedPark ? (
        <FoodPlaces 
          selectedPark={selectedPark} 
          onSelectRestaurant={handleSelectRestaurant} 
        />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    case 'menu':
      return selectedRestaurant ? (
        <RestaurantMenu
          restaurant={selectedRestaurant}
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onViewCart={handleViewCart}
        />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    case 'cart':
      return selectedRestaurant ? (
        <Cart
          cart={cart}
          restaurant={selectedRestaurant}
          onUpdateCart={handleUpdateCartById}
          onProceedToPayment={handleProceedToPayment}
        />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    case 'payment':
      return selectedRestaurant && paymentData ? (
        <Payment
          orderData={paymentData}
          restaurant={selectedRestaurant}
          onPaymentConfirm={handlePaymentConfirm}
          onBack={handleBackToCart}
        />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    case 'tracking':
      return currentOrder ? (
        <OrderTracking order={currentOrder} />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    default:
      return <TechParkSelection onSelectPark={handleSelectPark} />;
    }
  };

  return (
    <div>
      {/* Employee Header with Notifications */}
      <div className="fixed top-0 right-0 p-4 z-40">
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <Notifications className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </button>
      </div>
      
      {renderEmployeeContent()}
      
      <NotificationCenter
        userType="employee"
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
