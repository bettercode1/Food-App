import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { Manager } from '@/types';

const managerLoginSchema = z.object({
  username: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type ManagerLoginForm = z.infer<typeof managerLoginSchema>;

export default function ManagerLogin() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ManagerLoginForm>({
    resolver: zodResolver(managerLoginSchema),
    defaultValues: {
      username: 'manager@spicegarden.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: ManagerLoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/manager/login', data);
      const result = await response.json();

      if (result.success) {
        login(result.manager as Manager, 'manager');
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${result.manager.restaurantName}!`,
        });
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Manager Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Manager Email</Label>
              <Input
                {...form.register('username')}
                type="email"
                placeholder="manager@restaurant.com"
                data-testid="input-manager-email"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                {...form.register('password')}
                type="password"
                placeholder="Enter password"
                data-testid="input-password"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-manager-login"
            >
              {isLoading ? 'Logging in...' : 'Login as Manager'}
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Demo credentials:</p>
              <p>Email: manager@spicegarden.com</p>
              <p>Password: password123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
