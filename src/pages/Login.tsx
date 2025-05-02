import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the original route that the user tried to access
  const from = location.state?.from?.pathname || "/";
  
  // If the user is already authenticated, redirect
  useEffect(() => {
    if (user) {
      console.log("Login: User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Log for debugging
  useEffect(() => {
    console.log("Login: Mounted");
    console.log("Login: Original route =", from);
    return () => {
      console.log("Login: Unmounted");
    };
  }, [from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "admin@advizall.com",
      password: "advizall-admin-123",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login: Attempting login with", data.email);
    setIsLoading(true);
    setError("");
    
    try {
      const { error, success } = await signIn(data.email, data.password, navigate);
      
      if (error || !success) {
        setError(error?.message || "Login failed. Check your credentials.");
        toast({
          title: "Login Error",
          description: error?.message || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to Advizall CRM",
      });
      
      console.log("Login: Login successful, redirection will be done by useEffect");
      // Redirection is now done by useEffect when user is defined
    } catch (error: any) {
      setError(error?.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: error?.message || "Error during login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Advizall" className="h-12" />
          </div>
          <CardTitle className="text-2xl text-center">Advizall CRM</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Alert className="bg-blue-50 border-blue-100">
            <AlertDescription className="text-blue-800">
              <strong>Development login:</strong><br />
              Email: admin@advizall.com<br />
              Password: advizall-admin-123
            </AlertDescription>
          </Alert>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@advizall.com" 
                        autoComplete="email"
                        {...field} 
                      />
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
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        autoComplete="current-password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Developed by Advizall
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 