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

// Esquema de validação para o formulário de login (comentário em português)
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  // Estado para controlar o carregamento e erros (comentário em português)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Hooks para autenticação e navegação (comentário em português)
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Obtém a rota original que o usuário tentou acessar (comentário em português)
  const from = location.state?.from?.pathname || "/";
  
  // Se o usuário já estiver autenticado, redirecione (comentário em português)
  useEffect(() => {
    if (user) {
      console.log("Login: Usuário já autenticado, redirecionando para:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Log para depuração (comentário em português)
  useEffect(() => {
    console.log("Login: Componente montado");
    console.log("Login: Rota original =", from);
    return () => {
      console.log("Login: Componente desmontado");
    };
  }, [from]);

  // Configuração do formulário com validação (comentário em português)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "admin@advizall.com",
      password: "advizall-admin-123",
    },
  });

  // Função de envio do formulário (comentário em português)
  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login: Tentando login com", data.email);
    
    // Limpa erros e define carregando (comentário em português)
    setIsLoading(true);
    setError("");
    
    try {
      // Chama a função de login do contexto de autenticação (comentário em português)
      const { error, success } = await signIn(data.email, data.password, navigate);
      
      if (error || !success) {
        // Em caso de erro, exibe mensagem (comentário em português)
        setError(error?.message || "Login failed. Check your credentials.");
        toast({
          title: "Login Error",
          description: error?.message || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Em caso de sucesso, exibe notificação (comentário em português)
      toast({
        title: "Login successful",
        description: "Welcome to Advizall CRM",
      });
      
      console.log("Login: Login bem-sucedido, redirecionamento será feito pelo useEffect");
      // O redirecionamento é feito pelo useEffect quando user é definido (comentário em português)
    } catch (error: any) {
      // Captura erros inesperados (comentário em português)
      setError(error?.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: error?.message || "Error during login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Renderiza o formulário de login (comentário em português)
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
          {/* Exibe erros se houver (comentário em português) */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Informações de login para desenvolvimento (comentário em português) */}
          <Alert className="bg-blue-50 border-blue-100">
            <AlertDescription className="text-blue-800">
              <strong>Development login:</strong><br />
              Email: admin@advizall.com<br />
              Password: advizall-admin-123
            </AlertDescription>
          </Alert>
          
          {/* Formulário de login (comentário em português) */}
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