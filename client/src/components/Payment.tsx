import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Smartphone as PhoneAndroid, CreditCard, Building2 as AccountBalance, Handshake, Store, Truck as LocalShipping, Store as RestaurantIcon, ShoppingBag, Receipt, Lock, Shield as Security, ArrowLeft as ArrowBack, RotateCcw as Refresh } from 'lucide-react';
import type { Restaurant } from '@/types';

interface PaymentProps {
  orderData: {
    orderType: 'delivery' | 'dine-in' | 'takeaway';
    subtotal: number;
    deliveryCharge: number;
    gst: number;
    total: number;
  };
  restaurant: Restaurant;
  onPaymentConfirm: (paymentMethod: string) => void;
  onBack: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export default function Payment({ orderData, restaurant, onPaymentConfirm, onBack }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPaymentFailed, setLastPaymentFailed] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: 'user@paytm',
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/26',
    cvv: '***',
    netbankingBank: 'HDFC Bank'
  });
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    setLastPaymentFailed(false);
    
    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment success (99% success rate for demo - reduced failure for better UX)
    const isSuccess = Math.random() > 0.01;
    
    if (isSuccess) {
      toast({
        title: 'Payment Successful!',
        description: `Your payment of ₹${orderData.total} has been processed successfully.`,
      });
      onPaymentConfirm(paymentMethod);
    } else {
      setLastPaymentFailed(true);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: 'Your payment could not be processed. Please try again with a different method or retry.',
        action: (
          <Button variant="outline" size="sm" onClick={() => setLastPaymentFailed(false)}>
            Try Again
          </Button>
        ),
      });
      setIsProcessing(false);
    }
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case 'upi':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-chart-1/20 to-chart-2/20 rounded-lg border-2 border-dashed border-chart-1/30">
              <div className="text-center">
                <QrCode className="h-10 w-10 text-chart-1 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">Use any UPI app to scan and pay</p>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1">
                  <PhoneAndroid className="h-4 w-4 mr-1" />
                  UPI ID: {paymentDetails.upiId}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <PhoneAndroid className="h-8 w-8 text-chart-1 mb-2" />
                <span className="text-xs text-muted-foreground">Paytm</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <PhoneAndroid className="h-8 w-8 text-chart-2 mb-2" />
                <span className="text-xs text-muted-foreground">GPay</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <PhoneAndroid className="h-8 w-8 text-chart-3 mb-2" />
                <span className="text-xs text-muted-foreground">PhonePe</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <AccountBalance className="h-8 w-8 text-chart-5 mb-2" />
                <span className="text-xs text-muted-foreground">BHIM</span>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-chart-2/20 to-chart-3/20 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Saved Card</h3>
                <CreditCard className="h-8 w-8 text-chart-2" />
              </div>
              <p className="text-lg font-mono tracking-wider mb-2">{paymentDetails.cardNumber}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Expires: {paymentDetails.expiryDate}</span>
                <span>CVV: {paymentDetails.cvv}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name on Card"
                defaultValue="John Doe"
                className="bg-muted"
                readOnly
              />
              <Input
                placeholder="CVV"
                defaultValue="***"
                className="bg-muted"
                readOnly
              />
            </div>
            <div className="flex space-x-3">
              <Badge variant="outline" className="bg-chart-2/10">
                <CreditCard className="h-4 w-4 mr-1" />
                Visa
              </Badge>
              <Badge variant="outline" className="bg-chart-3/10">
                <CreditCard className="h-4 w-4 mr-1" />
                Mastercard
              </Badge>
              <Badge variant="outline" className="bg-chart-1/10">
                <CreditCard className="h-4 w-4 mr-1" />
                Amex
              </Badge>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-chart-3/10">
              <div className="flex items-center space-x-3 mb-3">
                <AccountBalance className="h-8 w-8 text-chart-3" />
                <div>
                  <h3 className="font-semibold">{paymentDetails.netbankingBank}</h3>
                  <p className="text-sm text-muted-foreground">Internet Banking</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">You will be redirected to your bank's secure website to complete the payment.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank) => (
                <div key={bank} className="flex items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <AccountBalance className="h-5 w-5 text-chart-3 mr-3" />
                  <span className="text-sm">{bank}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="space-y-4">
            <div className="p-6 text-center bg-chart-5/10 border rounded-lg">
              <Handshake className="h-10 w-10 text-chart-5 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Cash on Delivery</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pay with cash when your order arrives
              </p>
              <div className="inline-flex items-center px-3 py-2 bg-chart-5/20 border border-chart-5/30 rounded-lg">
                <Security className="h-4 w-4 text-chart-5 mr-2" />
                <span className="text-sm">Please keep exact change ready</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Security className="h-4 w-4 text-chart-2 mr-2" />
                No advance payment
              </span>
              <span className="flex items-center">
                <Lock className="h-4 w-4 text-chart-2 mr-2" />
                Secure & convenient
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
        <Button variant="ghost" onClick={onBack}>
          <ArrowBack className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <Label 
                  htmlFor="upi"
                  className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                >
                  <RadioGroupItem value="upi" id="upi" className="sr-only" />
                  <PhoneAndroid className="h-8 w-8 mb-2 text-chart-1" />
                  <span className="font-medium">UPI</span>
                  <span className="text-xs text-muted-foreground">Instant & Secure</span>
                </Label>

                <Label 
                  htmlFor="card"
                  className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                >
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <CreditCard className="h-8 w-8 mb-2 text-chart-2" />
                  <span className="font-medium">Card</span>
                  <span className="text-xs text-muted-foreground">Debit/Credit</span>
                </Label>

                <Label 
                  htmlFor="netbanking"
                  className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                >
                  <RadioGroupItem value="netbanking" id="netbanking" className="sr-only" />
                  <AccountBalance className="h-8 w-8 mb-2 text-chart-3" />
                  <span className="font-medium">Net Banking</span>
                  <span className="text-xs text-muted-foreground">All Banks</span>
                </Label>

                {orderData.orderType === 'delivery' && (
                  <Label 
                    htmlFor="cod"
                    className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                  >
                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                    <Handshake className="h-8 w-8 mb-2 text-chart-5" />
                    <span className="font-medium">Cash on Delivery</span>
                    <span className="text-xs text-muted-foreground">Pay at doorstep</span>
                  </Label>
                )}
              </RadioGroup>

              {renderPaymentMethodDetails()}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Store className="h-5 w-5 text-chart-1" />
                    <div>
                      <h4 className="font-medium">{restaurant.name}</h4>
                      <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={orderData.orderType === 'delivery' ? 'default' : 'secondary'}
                    className="flex items-center w-fit"
                  >
                    {orderData.orderType === 'delivery' ? (
                      <LocalShipping className="h-4 w-4 mr-1" />
                    ) : orderData.orderType === 'dine-in' ? (
                      <RestaurantIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ShoppingBag className="h-4 w-4 mr-1" />
                    )}
                    {orderData.orderType}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{orderData.subtotal}</span>
                  </div>
                  {orderData.deliveryCharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery charge</span>
                      <span>₹{orderData.deliveryCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (5%)</span>
                    <span>₹{orderData.gst}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total Amount</span>
                  <span>₹{orderData.total}</span>
                </div>

                {lastPaymentFailed && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center text-destructive text-sm">
                      <Security className="h-4 w-4 mr-2" />
                      <span>Payment failed. Please try again or use a different payment method.</span>
                    </div>
                  </div>
                )}

                <Button 
                  className={`w-full ${lastPaymentFailed ? 'bg-destructive hover:bg-destructive/90 border-2 border-destructive/50' : 'bg-chart-3 hover:bg-chart-3/90'}`}
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Refresh className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : lastPaymentFailed ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Retry Payment ₹{orderData.total}
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay ₹{orderData.total}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Security className="h-4 w-4 text-chart-2 mr-1" />
                    Secure
                  </span>
                  <span className="flex items-center">
                    <Lock className="h-4 w-4 text-chart-2 mr-1" />
                    Encrypted
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
