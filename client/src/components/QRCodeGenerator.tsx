import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Restaurant, MenuItem } from '@/types';

interface QRCodeGeneratorProps {
  restaurant?: Restaurant;
  menuItem?: MenuItem;
  onClose?: () => void;
}

interface QRCodeData {
  type: 'menu' | 'order' | 'payment' | 'referral' | 'feedback';
  data: string;
  restaurantId?: string;
  menuItemId?: string;
  orderId?: string;
  referralCode?: string;
}

export default function QRCodeGenerator({ restaurant, menuItem, onClose }: QRCodeGeneratorProps) {
  const { toast } = useToast();
  const [qrType, setQrType] = useState<'menu' | 'order' | 'payment' | 'referral' | 'feedback'>('menu');
  const [qrData, setQrData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customData, setCustomData] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Generate QR code data based on type
  useEffect(() => {
    let data = '';
    
    switch (qrType) {
      case 'menu':
        if (menuItem) {
          data = `https://techpark-food.app/menu/${menuItem.id}`;
        } else if (restaurant) {
          data = `https://techpark-food.app/restaurant/${restaurant.id}/menu`;
        } else {
          data = `https://techpark-food.app/menu`;
        }
        break;
      case 'order':
        data = `https://techpark-food.app/order/${customData}`;
        break;
      case 'payment':
        data = `https://techpark-food.app/payment/${customData}`;
        break;
      case 'referral':
        data = `https://techpark-food.app/register?ref=${referralCode}`;
        break;
      case 'feedback':
        if (restaurant) {
          data = `https://techpark-food.app/feedback/${restaurant.id}`;
        } else {
          data = `https://techpark-food.app/feedback`;
        }
        break;
    }
    
    setQrData(data);
    generateQRCode(data);
  }, [qrType, menuItem, restaurant, customData, referralCode]);

  // Generate QR code using a simple text-based approach (in a real app, you'd use a QR library)
  const generateQRCode = (data: string) => {
    // For demo purposes, we'll create a placeholder QR code
    // In a real implementation, you'd use a library like 'qrcode' or 'react-qr-code'
    const qrCodePlaceholder = `QR Code for: ${data}`;
    setQrCodeUrl(qrCodePlaceholder);
  };

  const handleDownloadQR = () => {
    // In a real implementation, you'd download the actual QR code image
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${qrType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'QR Code Downloaded',
      description: 'QR code has been saved to your device.',
    });
  };

  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TechPark Food QR Code',
        text: 'Check out this QR code from TechPark Food',
        url: qrCodeUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrCodeUrl);
      toast({
        title: 'QR Code URL Copied',
        description: 'QR code URL has been copied to clipboard.',
      });
    }
  };

  const generateReferralCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
  };

  const getQRTypeIcon = (type: string) => {
    switch (type) {
      case 'menu':
        return 'fa-utensils';
      case 'order':
        return 'fa-shopping-cart';
      case 'payment':
        return 'fa-credit-card';
      case 'referral':
        return 'fa-user-plus';
      case 'feedback':
        return 'fa-comment';
      default:
        return 'fa-qrcode';
    }
  };

  const getQRTypeDescription = (type: string) => {
    switch (type) {
      case 'menu':
        return 'Share restaurant menu or specific menu item';
      case 'order':
        return 'Share a specific order for tracking';
      case 'payment':
        return 'Share payment link or UPI details';
      case 'referral':
        return 'Invite friends to join TechPark Food';
      case 'feedback':
        return 'Share feedback form for restaurant';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-qrcode mr-2 text-primary"></i>
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Type Selection */}
          <div className="space-y-2">
            <Label>
              <i className="fas fa-tag mr-2"></i>
              QR Code Type
            </Label>
            <Select value={qrType} onValueChange={(value: any) => setQrType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menu">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-utensils"></i>
                    <span>Menu</span>
                  </div>
                </SelectItem>
                <SelectItem value="order">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shopping-cart"></i>
                    <span>Order</span>
                  </div>
                </SelectItem>
                <SelectItem value="payment">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-credit-card"></i>
                    <span>Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="referral">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-user-plus"></i>
                    <span>Referral</span>
                  </div>
                </SelectItem>
                <SelectItem value="feedback">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-comment"></i>
                    <span>Feedback</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getQRTypeDescription(qrType)}
            </p>
          </div>

          {/* Context Information */}
          {(restaurant || menuItem) && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <i className={`fas ${getQRTypeIcon(qrType)} text-primary`}></i>
                </div>
                <div>
                  {menuItem ? (
                    <>
                      <h4 className="font-medium text-foreground">{menuItem.name}</h4>
                      <p className="text-sm text-muted-foreground">Menu Item</p>
                    </>
                  ) : restaurant ? (
                    <>
                      <h4 className="font-medium text-foreground">{restaurant.name}</h4>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Custom Data Input */}
          {(qrType === 'order' || qrType === 'payment') && (
            <div className="space-y-2">
              <Label htmlFor="custom-data">
                <i className="fas fa-edit mr-2"></i>
                {qrType === 'order' ? 'Order ID' : 'Payment Reference'}
              </Label>
              <Input
                id="custom-data"
                placeholder={qrType === 'order' ? 'Enter order ID' : 'Enter payment reference'}
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
              />
            </div>
          )}

          {/* Referral Code */}
          {qrType === 'referral' && (
            <div className="space-y-2">
              <Label htmlFor="referral-code">
                <i className="fas fa-code mr-2"></i>
                Referral Code
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="referral-code"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
                <Button variant="outline" onClick={generateReferralCode}>
                  <i className="fas fa-dice"></i>
                </Button>
              </div>
            </div>
          )}

          {/* QR Code Display */}
          <div className="text-center space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-qrcode text-4xl text-gray-400 mb-2"></i>
                  <p className="text-xs text-gray-500 dark:text-gray-400">QR Code Preview</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 break-all">
                    {qrData}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary" className="flex items-center w-fit mx-auto">
                <i className={`fas ${getQRTypeIcon(qrType)} mr-1`}></i>
                {qrType.charAt(0).toUpperCase() + qrType.slice(1)} QR Code
              </Badge>
              <p className="text-xs text-muted-foreground">
                Scan this QR code with any QR scanner app
              </p>
            </div>
          </div>

          {/* QR Code Data */}
          <div className="bg-muted/50 rounded-lg p-4">
            <Label className="text-sm font-medium">QR Code Data:</Label>
            <p className="text-xs text-muted-foreground mt-1 break-all font-mono">
              {qrData}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleDownloadQR} className="flex-1">
              <i className="fas fa-download mr-2"></i>
              Download
            </Button>
            <Button variant="outline" onClick={handleShareQR} className="flex-1">
              <i className="fas fa-share mr-2"></i>
              Share
            </Button>
          </div>

          {/* QR Code Usage Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <i className="fas fa-lightbulb text-blue-500 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  QR Code Usage Tips
                </p>
                <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <li>• Place QR codes on tables for easy menu access</li>
                  <li>• Share payment QR codes for quick transactions</li>
                  <li>• Use referral codes to invite friends and earn rewards</li>
                  <li>• QR codes work with any smartphone camera or QR scanner app</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Close Button */}
          {onClose && (
            <Button variant="outline" onClick={onClose} className="w-full">
              <i className="fas fa-times mr-2"></i>
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
