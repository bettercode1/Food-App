import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewMode } from '@/hooks/useViewMode';
import UserLogin from '@/components/UserLogin';
import ManagerLogin from '@/components/ManagerLogin';
import { Users, UserCog } from 'lucide-react';

export default function UnifiedAuth() {
  const { viewMode, setViewMode } = useViewMode();
  const [activeTab, setActiveTab] = useState<string>(viewMode === 'manager' ? 'manager' : 'employee');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setViewMode(value === 'manager' ? 'manager' : 'user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <div className="text-primary-foreground text-2xl font-bold">🍽️</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Food App</h1>
          <p className="text-muted-foreground">Tech Park Food Ordering System</p>
        </div>

        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Welcome</CardTitle>
            <CardDescription className="text-center">
              Choose your access type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger 
                  value="employee" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
                >
                  <Users className="h-4 w-4" />
                  Employee
                </TabsTrigger>
                <TabsTrigger 
                  value="manager" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
                >
                  <UserCog className="h-4 w-4" />
                  Manager
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="employee" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Employee Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Login or register to order food from your tech park
                    </p>
                  </div>
                  <UserLogin />
                </div>
              </TabsContent>
              
              <TabsContent value="manager" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Manager Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Login to manage your restaurant operations
                    </p>
                  </div>
                  <ManagerLogin />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Secure • Fast • Reliable</p>
        </div>
      </div>
    </div>
  );
}