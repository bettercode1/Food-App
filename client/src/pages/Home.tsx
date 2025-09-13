import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserLogin from '@/components/UserLogin';
import ManagerLogin from '@/components/ManagerLogin';
import TechParkSelection from '@/components/TechParkSelection';
import FoodPlaces from '@/components/FoodPlaces';
import RestaurantMenu from '@/components/RestaurantMenu';
import Cart from '@/components/Cart';
import OrderTracking from '@/components/OrderTracking';
import ManagerDashboard from '@/components/ManagerDashboard';
import type { TechPark, Restaurant, CartItem, MenuItem, Order, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type UserFlow = 'login' | 'tech-parks' | 'restaurants' | 'menu' | 'cart' | 'payment' | 'tracking';

export default function Home() {
  const { user, userType } = useAuth();
  const { toast } = useToast();
  
  const [userFlow, setUserFlow] = useState<UserFlow>('login');
  const [selectedPark, setSelectedPark] = useState<TechPark | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

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
    // Simulate payment processing and create order
    handlePaymentConfirm();
  };

  const handlePaymentConfirm = async () => {
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
          paymentMethod: 'upi',
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

  // Show appropriate view based on user type and authentication
  if (!user) {
    return userType === 'manager' ? <ManagerLogin /> : <UserLogin />;
  }

  if (userType === 'manager') {
    return <ManagerDashboard />;
  }

  // User flow
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
    
    case 'tracking':
      return currentOrder ? (
        <OrderTracking order={currentOrder} />
      ) : <TechParkSelection onSelectPark={handleSelectPark} />;
    
    default:
      return <TechParkSelection onSelectPark={handleSelectPark} />;
  }
}
