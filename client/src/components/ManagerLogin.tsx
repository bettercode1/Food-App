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
      username: 'manager@canteendelight.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: ManagerLoginForm) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password, 'manager');
      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
      });
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="username">Manager Email</Label>
        <Input
          {...form.register('username')}
          type="email"
          placeholder="manager@restaurant.com"
          data-testid="input-manager-email"
          autoComplete="email"
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
          autoComplete="current-password"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl" 
        disabled={isLoading}
        data-testid="button-manager-login"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
            Logging in...
          </div>
        ) : (
          'Login as Manager'
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
        </div>
      </div>

      <div className="text-center p-3 bg-muted/30 rounded-lg border border-muted-foreground/10">
        <p className="text-sm font-medium text-foreground mb-1">Pre-filled Demo Credentials:</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="font-medium">Email:</span> manager@canteendelight.com</p>
          <p><span className="font-medium">Password:</span> password123</p>
        </div>
        <p className="text-xs text-muted-foreground/80 mt-2">Just click "Login as Manager" above!</p>
      </div>
    </form>
  );
}
