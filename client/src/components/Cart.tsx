import { useState, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Truck as LocalShipping, Store as RestaurantIcon, ShoppingBag } from 'lucide-react';
import type { CartItem, Restaurant } from '@/types';

interface CartProps {
  cart: CartItem[];
  restaurant: Restaurant;
  onUpdateCart: (menuItemId: string, action: 'increment' | 'decrement' | 'remove') => void;
  onProceedToPayment: (orderData: {
    orderType: 'delivery' | 'dine-in' | 'takeaway';
    subtotal: number;
    deliveryCharge: number;
    gst: number;
    total: number;
  }) => void;
}

const Cart = memo(function Cart({ cart, restaurant, onUpdateCart, onProceedToPayment }: CartProps) {
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in' | 'takeaway'>('delivery');

  // Memoize expensive calculations
  const { subtotal, deliveryCharge, gst, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const delivery = orderType === 'delivery' ? 25 : 0;
    const tax = Math.round((sub + delivery) * 0.05);
    const totalAmount = sub + delivery + tax;
    
    return { 
      subtotal: sub, 
      deliveryCharge: delivery, 
      gst: tax, 
      total: totalAmount 
    };
  }, [cart, orderType]);

  const handleProceedToPayment = () => {
    onProceedToPayment({
      orderType,
      subtotal,
      deliveryCharge,
      gst,
      total,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="text-4xl text-muted-foreground mb-4 mx-auto" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">Add some delicious items to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Order</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={item.menuItem.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          {item.menuItem.imageUrl && (
                            <img 
                              src={item.menuItem.imageUrl} 
                              alt={item.menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground" data-testid={`text-cart-item-${item.menuItem.id}`}>
                            {item.menuItem.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">₹{item.menuItem.price} each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0 bg-destructive/10 text-destructive"
                            onClick={() => onUpdateCart(item.menuItem.id, 'decrement')}
                            data-testid={`button-cart-decrement-${item.menuItem.id}`}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center" data-testid={`text-cart-quantity-${item.menuItem.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0 bg-chart-2/10 text-chart-2"
                            onClick={() => onUpdateCart(item.menuItem.id, 'increment')}
                            data-testid={`button-cart-increment-${item.menuItem.id}`}
                          >
                            +
                          </Button>
                        </div>
                        <span className="font-semibold text-foreground w-16 text-right">
                          ₹{item.menuItem.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    {index < cart.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Options */}
          <Card>
            <CardHeader>
              <CardTitle>Order Options</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={orderType} 
                onValueChange={(value: 'delivery' | 'dine-in' | 'takeaway') => setOrderType(value)}
                className="grid grid-cols-3 gap-4"
              >
                {restaurant.deliveryAvailable && (
                  <Label 
                    htmlFor="delivery"
                    className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                    data-testid="label-delivery-option"
                  >
                    <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                    <LocalShipping className="text-2xl mb-2" />
                    <span className="font-medium">Delivery</span>
                    <span className="text-xs text-muted-foreground">+₹25</span>
                  </Label>
                )}
                {restaurant.dineinAvailable && (
                  <Label 
                    htmlFor="dine-in"
                    className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                    data-testid="label-dinein-option"
                  >
                    <RadioGroupItem value="dine-in" id="dine-in" className="sr-only" />
                    <RestaurantIcon className="text-2xl mb-2" />
                    <span className="font-medium">Dine-in</span>
                    <span className="text-xs text-muted-foreground">Free</span>
                  </Label>
                )}
                {restaurant.takeawayAvailable && (
                  <Label 
                    htmlFor="takeaway"
                    className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                    data-testid="label-takeaway-option"
                  >
                    <RadioGroupItem value="takeaway" id="takeaway" className="sr-only" />
                    <ShoppingBag className="text-2xl mb-2" />
                    <span className="font-medium">Takeaway</span>
                    <span className="text-xs text-muted-foreground">Free</span>
                  </Label>
                )}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">₹{subtotal}</span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery charge</span>
                    <span data-testid="text-delivery-charge">₹{deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (5%)</span>
                  <span data-testid="text-gst">₹{gst}</span>
                </div>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                <span>Total</span>
                <span data-testid="text-total">₹{total}</span>
              </div>
              
              <Button 
                className="w-full bg-chart-3 hover:bg-chart-3/90 mb-4" 
                onClick={handleProceedToPayment}
                data-testid="button-proceed-payment"
              >
                Proceed to Payment
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>Estimated delivery: {restaurant.preparationTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default Cart;
