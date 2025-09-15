
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
  const { login, register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: '9876543210',
      password: 'employee123',
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
      role: 'employee' as 'employee' | 'manager',
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data.mobile, data.password, 'employee');
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      await register({
        ...data,
        email: data.mobile + '@techpark.local', // Create email from mobile
      }, data.password, data.role);
      
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
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                {...loginForm.register('mobile')}
                placeholder="Enter mobile number"
                data-testid="input-mobile"
                autoComplete="tel"
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
                autoComplete="current-password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl" data-testid="button-login">
              Login
            </Button>
            
            <div className="text-center p-3 bg-muted/30 rounded-lg border border-muted-foreground/10 mt-4">
              <p className="text-sm font-medium text-foreground mb-1">Pre-filled Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Mobile:</span> 9876543210</p>
                <p><span className="font-medium">Password:</span> employee123</p>
              </div>
              <p className="text-xs text-muted-foreground/80 mt-2">Just click "Login" above!</p>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div>
              <Label>Role</Label>
              <RadioGroup 
                value={registerForm.watch('role')} 
                onValueChange={(value: 'employee' | 'manager') => registerForm.setValue('role', value)}
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
                autoComplete="tel"
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
                autoComplete="new-password"
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl" data-testid="button-register">
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
      </div>
    </div>
  );
}
