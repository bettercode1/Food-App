import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
    
    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment success (95% success rate for demo)
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      toast({
        title: 'Payment Successful!',
        description: `Your payment of ₹${orderData.total} has been processed successfully.`,
      });
      onPaymentConfirm(paymentMethod);
    } else {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: 'Your payment could not be processed. Please try again.',
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
                <i className="fas fa-qrcode text-4xl text-chart-1 mb-4"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">Use any UPI app to scan and pay</p>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1">
                  <i className="fas fa-mobile-alt mr-1"></i>
                  UPI ID: {paymentDetails.upiId}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <i className="fas fa-wallet text-2xl text-chart-1 mb-2"></i>
                <span className="text-xs text-muted-foreground">Paytm</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <i className="fab fa-google-pay text-2xl text-chart-2 mb-2"></i>
                <span className="text-xs text-muted-foreground">GPay</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <i className="fas fa-mobile-alt text-2xl text-chart-3 mb-2"></i>
                <span className="text-xs text-muted-foreground">PhonePe</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <i className="fas fa-university text-2xl text-chart-5 mb-2"></i>
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
                <i className="fab fa-cc-mastercard text-2xl text-chart-2"></i>
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
                <i className="fab fa-cc-visa mr-1"></i>
                Visa
              </Badge>
              <Badge variant="outline" className="bg-chart-3/10">
                <i className="fab fa-cc-mastercard mr-1"></i>
                Mastercard
              </Badge>
              <Badge variant="outline" className="bg-chart-1/10">
                <i className="fab fa-cc-amex mr-1"></i>
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
                <i className="fas fa-university text-2xl text-chart-3"></i>
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
                  <i className="fas fa-building text-chart-3 mr-3"></i>
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
              <i className="fas fa-hand-holding-usd text-4xl text-chart-5 mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cash on Delivery</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pay with cash when your order arrives
              </p>
              <div className="inline-flex items-center px-3 py-2 bg-chart-5/20 border border-chart-5/30 rounded-lg">
                <i className="fas fa-info-circle text-chart-5 mr-2"></i>
                <span className="text-sm">Please keep exact change ready</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <i className="fas fa-check-circle text-chart-2 mr-2"></i>
                No advance payment
              </span>
              <span className="flex items-center">
                <i className="fas fa-shield-alt text-chart-2 mr-2"></i>
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
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-credit-card mr-2 text-primary"></i>
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
                  <i className="fas fa-mobile-alt text-2xl mb-2 text-chart-1"></i>
                  <span className="font-medium">UPI</span>
                  <span className="text-xs text-muted-foreground">Instant & Secure</span>
                </Label>

                <Label 
                  htmlFor="card"
                  className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                >
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <i className="fas fa-credit-card text-2xl mb-2 text-chart-2"></i>
                  <span className="font-medium">Card</span>
                  <span className="text-xs text-muted-foreground">Debit/Credit</span>
                </Label>

                <Label 
                  htmlFor="netbanking"
                  className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                >
                  <RadioGroupItem value="netbanking" id="netbanking" className="sr-only" />
                  <i className="fas fa-university text-2xl mb-2 text-chart-3"></i>
                  <span className="font-medium">Net Banking</span>
                  <span className="text-xs text-muted-foreground">All Banks</span>
                </Label>

                {orderData.orderType === 'delivery' && (
                  <Label 
                    htmlFor="cod"
                    className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                  >
                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                    <i className="fas fa-hand-holding-usd text-2xl mb-2 text-chart-5"></i>
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
                <i className="fas fa-receipt mr-2 text-primary"></i>
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-store text-chart-1"></i>
                    <div>
                      <h4 className="font-medium">{restaurant.name}</h4>
                      <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={orderData.orderType === 'delivery' ? 'default' : 'secondary'}
                    className="flex items-center w-fit"
                  >
                    <i className={`fas ${
                      orderData.orderType === 'delivery' ? 'fa-truck' : 
                      orderData.orderType === 'dine-in' ? 'fa-utensils' : 'fa-shopping-bag'
                    } mr-1`}></i>
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

                <Button 
                  className="w-full bg-chart-3 hover:bg-chart-3/90" 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock mr-2"></i>
                      Pay ₹{orderData.total}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <i className="fas fa-shield-alt text-chart-2 mr-1"></i>
                    Secure
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-lock text-chart-2 mr-1"></i>
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