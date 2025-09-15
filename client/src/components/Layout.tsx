import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileNavigation from '@/components/MobileNavigation';
import { Store as Restaurant, Sun, Moon, User, Shield, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, userType, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile Navigation */}
              <MobileNavigation />
              
              <div className="flex items-center space-x-2">
                <Restaurant className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">TechPark Food</h1>
                </div>
              </div>
            </div>
            
            {/* Theme Toggle and User Info */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
                data-testid="button-theme-toggle"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    {userType === 'employee' ? (
                      <User className={`h-5 w-5 ${userType === 'employee' ? 'text-orange-500' : 'text-blue-500'}`} />
                    ) : (
                      <Shield className={`h-5 w-5 ${userType === 'manager' ? 'text-blue-500' : 'text-orange-500'}`} />
                    )}
                    <span className="text-sm" data-testid="text-user-name">
                      {'employeeName' in user ? user.employeeName : user.restaurantName}
                    </span>
                  </div>
                  <Badge variant={userType === 'employee' ? 'default' : 'secondary'} className="hidden sm:flex">
                    {userType === 'employee' ? (
                      <User className="mr-1 h-4 w-4" />
                    ) : (
                      <Shield className="mr-1 h-4 w-4" />
                    )}
                    {userType === 'employee' ? 'Employee' : 'Manager'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      logout();
                      // Scroll to top to show login form
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-testid="button-logout"
                    className="flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
