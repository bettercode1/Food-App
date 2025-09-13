import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, userType, logout } = useAuth();
  const [viewMode, setViewMode] = useState<'user' | 'manager'>('user');

  const handleViewSwitch = (mode: 'user' | 'manager') => {
    setViewMode(mode);
    // If switching views and user is logged in as different type, logout
    if (user && userType !== mode) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-utensils text-2xl text-primary"></i>
                <h1 className="text-xl font-bold text-foreground">TechPark Food</h1>
              </div>
            </div>
            
            {/* User/Manager Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'user' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewSwitch('user')}
                  data-testid="button-user-view"
                >
                  User View
                </Button>
                <Button
                  variant={viewMode === 'manager' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewSwitch('manager')}
                  data-testid="button-manager-view"
                >
                  Manager View
                </Button>
              </div>
              {user && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <i className="fas fa-user-circle text-lg"></i>
                  <span className="text-sm" data-testid="text-user-name">
                    {'employeeName' in user ? user.employeeName : user.restaurantName}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    data-testid="button-logout"
                  >
                    Logout
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
