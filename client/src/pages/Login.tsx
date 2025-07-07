import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigateByRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'driver':
        navigate('/driver/dashboard');
        break;
      case 'owner':
        navigate('/owner/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Login user
      let loginData = {
        email: data.email,
        password: data.password
      }
      const result = await dispatch(login(loginData)).unwrap();
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      navigateByRole(result.role);
    } catch (err) {
      toast({
        title: 'Login Failed',
        description:
          err instanceof Error ? err.message : 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) navigateByRole(user.role);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <GlassCard className="w-full p-6">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail aria-label="email icon" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="off"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock aria-label="password icon" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="off"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>Don't have an account? </span>
              <Link
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Register now
              </Link>
            </div>
          </CardFooter>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
