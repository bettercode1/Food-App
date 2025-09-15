import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Store as RestaurantIcon, User, Shield, LogOut, History, Heart, Settings, HelpCircle } from 'lucide-react';

export default function MobileNavigation() {
  const { user, userType, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <RestaurantIcon className="mr-2 h-5 w-5 text-primary" />
              TechPark Food
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">

            {/* User Info */}
            {user && (
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-foreground mb-3">Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    {userType === 'employee' ? (
                      <User className={`text-lg ${userType === 'employee' ? 'text-orange-500' : 'text-blue-500'}`} />
                    ) : (
                      <Shield className={`text-lg ${userType === 'manager' ? 'text-blue-500' : 'text-orange-500'}`} />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {'employeeName' in user ? user.employeeName : user.restaurantName}
                      </p>
                      <Badge variant={userType === 'employee' ? 'default' : 'secondary'} className="text-xs">
                        {userType === 'employee' ? 'Employee' : 'Manager'}
                      </Badge>
                    </div>
                  </div>
                  
                    <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="mr-2 h-4 w-4" />
                  Order History
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
