import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Restaurant, CartItem } from '@/types';

interface OrderSchedulerProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onScheduleOrder: (scheduledData: ScheduledOrderData) => void;
  onCancel: () => void;
}

interface ScheduledOrderData {
  scheduledDate: string;
  scheduledTime: string;
  orderType: 'delivery' | 'dine-in' | 'takeaway';
  deliveryAddress?: string;
  specialInstructions?: string;
  reminderTime?: string;
}

export default function OrderScheduler({ restaurant, cart, onScheduleOrder, onCancel }: OrderSchedulerProps) {
  const { toast } = useToast();
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in' | 'takeaway'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [reminderTime, setReminderTime] = useState('15');

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If scheduling for today, start from next available slot
    const startHour = scheduledDate === now.toISOString().split('T')[0] ? 
      Math.max(currentHour + 1, 8) : 8;
    
    // Restaurant hours: 8 AM to 10 PM
    for (let hour = startHour; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip past times for today
        if (scheduledDate === now.toISOString().split('T')[0] && 
            (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
          continue;
        }
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          value: timeString,
          label: new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Calculate total cart value
  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryCharge = orderType === 'delivery' ? 25 : 0;
  const gst = Math.round((cartTotal + deliveryCharge) * 0.05);
  const total = cartTotal + deliveryCharge + gst;

  const handleScheduleOrder = () => {
    if (!scheduledDate || !scheduledTime) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select both date and time for your order.',
      });
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast({
        variant: 'destructive',
        title: 'Delivery Address Required',
        description: 'Please provide a delivery address.',
      });
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      toast({
        variant: 'destructive',
        title: 'Invalid Schedule Time',
        description: 'Please select a future date and time.',
      });
      return;
    }

    const scheduledData: ScheduledOrderData = {
      scheduledDate,
      scheduledTime,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      reminderTime,
    };

    onScheduleOrder(scheduledData);

    toast({
      title: 'Order Scheduled Successfully!',
      description: `Your order has been scheduled for ${new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}`,
    });
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'fa-truck';
      case 'dine-in':
        return 'fa-utensils';
      case 'takeaway':
        return 'fa-shopping-bag';
      default:
        return 'fa-question';
    }
  };

  const getOrderTypeDescription = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'Delivered to your location';
      case 'dine-in':
        return 'Dine at the restaurant';
      case 'takeaway':
        return 'Pick up from restaurant';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-calendar-plus mr-2 text-primary"></i>
            Schedule Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Restaurant Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <i className="fas fa-store text-primary"></i>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                <div className="flex items-center mt-1">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span className="text-sm">{restaurant.rating}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    <i className="fas fa-clock mr-1"></i>
                    {restaurant.preparationTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">
              <i className="fas fa-shopping-cart mr-2"></i>
              Order Summary ({cart.length} items)
            </h4>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.menuItem.name} × {item.quantity}
                  </span>
                  <span>₹{item.menuItem.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">
              <i className="fas fa-calendar mr-2"></i>
              Select Date
            </Label>
            <Input
              id="scheduled-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 7 days from now
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              You can schedule orders up to 7 days in advance
            </p>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-time">
              <i className="fas fa-clock mr-2"></i>
              Select Time
            </Label>
            <Select value={scheduledTime} onValueChange={setScheduledTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Available time slots based on restaurant hours (8 AM - 10 PM)
            </p>
          </div>

          {/* Order Type Selection */}
          <div className="space-y-3">
            <Label>
              <i className="fas fa-shipping-fast mr-2"></i>
              Order Type
            </Label>
            <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as any)}>
              {(['delivery', 'dine-in', 'takeaway'] as const).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className={`fas ${getOrderTypeIcon(type)} text-primary`}></i>
                        <span className="capitalize">{type.replace('-', ' ')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getOrderTypeDescription(type)}
                      </Badge>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <div className="space-y-2">
              <Label htmlFor="delivery-address">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Delivery Address
              </Label>
              <Input
                id="delivery-address"
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="special-instructions">
              <i className="fas fa-sticky-note mr-2"></i>
              Special Instructions (Optional)
            </Label>
            <Input
              id="special-instructions"
              placeholder="Any special requests or instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          {/* Reminder Settings */}
          <div className="space-y-2">
            <Label htmlFor="reminder-time">
              <i className="fas fa-bell mr-2"></i>
              Reminder Before Order
            </Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <i className="fas fa-times mr-2"></i>
              Cancel
            </Button>
            <Button onClick={handleScheduleOrder} className="flex-1">
              <i className="fas fa-calendar-check mr-2"></i>
              Schedule Order
            </Button>
          </div>

          {/* Schedule Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Scheduled Order Information
                </p>
                <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <li>• Your order will be prepared and ready at the scheduled time</li>
                  <li>• You'll receive a reminder notification before your order time</li>
                  <li>• You can modify or cancel your scheduled order up to 2 hours before the scheduled time</li>
                  <li>• Payment will be processed when the order is confirmed</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
