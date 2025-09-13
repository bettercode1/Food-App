import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

const userLoginSchema = z.object({
  techPark: z.string().min(1, 'Tech Park is required'),
  company: z.string().min(1, 'Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  employeeName: z.string().min(1, 'Employee name is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
});

type UserLoginForm = z.infer<typeof userLoginSchema>;

export default function UserLogin() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserLoginForm>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      techPark: '',
      company: '',
      designation: '',
      employeeName: '',
      mobile: '',
    },
  });

  const onSubmit = async (data: UserLoginForm) => {
    setIsLoading(true);
    try {
      // Create username from mobile number for uniqueness
      const loginData = {
        ...data,
        username: data.mobile,
        password: 'temp-password', // In real app, implement proper auth
      };

      const response = await apiRequest('POST', '/api/auth/user/login', loginData);
      const result = await response.json();

      if (result.success) {
        login(result.user as User, 'employee');
        toast({
          title: 'Login Successful',
          description: `Welcome, ${result.user.employeeName}!`,
        });
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your details and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Employee Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="techPark">Tech Park Name</Label>
              <Select
                value={form.watch('techPark')}
                onValueChange={(value) => form.setValue('techPark', value)}
              >
                <SelectTrigger data-testid="select-tech-park">
                  <SelectValue placeholder="Select Tech Park" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manyata Tech Park">Manyata Tech Park</SelectItem>
                  <SelectItem value="Whitefield Tech Park">Whitefield Tech Park</SelectItem>
                  <SelectItem value="Electronic City">Electronic City</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.techPark && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.techPark.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                {...form.register('company')}
                placeholder="Enter company name"
                data-testid="input-company"
              />
              {form.formState.errors.company && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                {...form.register('designation')}
                placeholder="Your designation"
                data-testid="input-designation"
              />
              {form.formState.errors.designation && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.designation.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input
                {...form.register('employeeName')}
                placeholder="Your full name"
                data-testid="input-employee-name"
              />
              {form.formState.errors.employeeName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.employeeName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                {...form.register('mobile')}
                type="tel"
                placeholder="Your mobile number"
                data-testid="input-mobile"
              />
              {form.formState.errors.mobile && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.mobile.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
