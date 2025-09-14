
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import { useToast } from '../hooks/use-toast';

const loginSchema = z.object({
  mobile: z.string().min(10, 'Mobile number must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  techPark: z.string().min(1, 'Tech park is required'),
  company: z.string().min(1, 'Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  employeeName: z.string().min(1, 'Employee name is required'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employee', 'manager'], {
    required_error: 'Please select your role',
  }),
});

export default function UserLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      techPark: '',
      company: '',
      designation: '',
      employeeName: '',
      mobile: '',
      password: '',
      role: 'employee' as const,
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        login(result.user, 'user');
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        setLocation('/');
      } else {
        const error = await response.json();
        toast({
          title: 'Login failed',
          description: error.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      const response = await fetch('/api/auth/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        login(result.user, 'user');
        toast({
          title: 'Registration successful',
          description: 'Account created successfully!',
        });
        
        // Redirect based on role
        if (data.role === 'manager') {
          setLocation('/manager/dashboard');
        } else {
          setLocation('/');
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Registration failed',
          description: error.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Registration failed', 
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <i className="fas fa-user text-primary-foreground text-xl"></i>
          </div>
          <CardTitle>{isLogin ? 'Employee Login' : 'Employee Registration'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to order food' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  {...loginForm.register('mobile')}
                  placeholder="Enter mobile number"
                  data-testid="input-mobile"
                />
                {loginForm.formState.errors.mobile && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="Enter password"
                  data-testid="input-password"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" data-testid="button-login">
                Login
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <Label>Role</Label>
                <RadioGroup 
                  value={registerForm.watch('role')} 
                  onValueChange={(value) => registerForm.setValue('role', value as 'employee' | 'manager')}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee">Employee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manager" id="manager" />
                    <Label htmlFor="manager">Manager</Label>
                  </div>
                </RadioGroup>
                {registerForm.formState.errors.role && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="techPark">Tech Park</Label>
                <Input
                  {...registerForm.register('techPark')}
                  placeholder="Enter tech park name"
                  data-testid="input-tech-park"
                />
                {registerForm.formState.errors.techPark && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.techPark.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  {...registerForm.register('company')}
                  placeholder="Enter company name"
                  data-testid="input-company"
                />
                {registerForm.formState.errors.company && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  {...registerForm.register('designation')}
                  placeholder="Your designation"
                  data-testid="input-designation"
                />
                {registerForm.formState.errors.designation && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.designation.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  {...registerForm.register('employeeName')}
                  placeholder="Your full name"
                  data-testid="input-employee-name"
                />
                {registerForm.formState.errors.employeeName && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.employeeName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  {...registerForm.register('mobile')}
                  placeholder="Enter mobile number"
                  data-testid="input-mobile-register"
                />
                {registerForm.formState.errors.mobile && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  {...registerForm.register('password')}
                  type="password"
                  placeholder="Create password"
                  data-testid="input-password-register"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" data-testid="button-register">
                Register
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)}
              data-testid="button-toggle-form"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
