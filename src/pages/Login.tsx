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
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "Senha obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Obter a rota original que o usuário tentou acessar
  const from = location.state?.from?.pathname || "/";
  
  // Se o usuário já estiver autenticado, redireciona
  useEffect(() => {
    if (user) {
      console.log("Login: Usuário já autenticado, redirecionando para:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Log para debugging
  useEffect(() => {
    console.log("Login: Montado");
    console.log("Login: Rota original =", from);
    return () => {
      console.log("Login: Desmontado");
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
    console.log("Login: Tentando login com", data.email);
    setIsLoading(true);
    setError("");
    
    try {
      const { error, success } = await signIn(data.email, data.password);
      
      if (error || !success) {
        setError(error?.message || "Falha no login. Verifique suas credenciais.");
        toast({
          title: "Erro de Login",
          description: error?.message || "Credenciais inválidas",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao CRM Advizall",
      });
      
      console.log("Login: Login bem-sucedido, redirecionando será feito pelo useEffect");
      // O redirecionamento agora é feito pelo useEffect quando user for definido
    } catch (error: any) {
      setError(error?.message || "Ocorreu um erro inesperado");
      toast({
        title: "Erro",
        description: error?.message || "Erro ao fazer login",
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
            Entre com suas credenciais para acessar o sistema
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
              <strong>Login para desenvolvimento:</strong><br />
              Email: admin@advizall.com<br />
              Senha: advizall-admin-123
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
                    <FormLabel>Senha</FormLabel>
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
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Desenvolvido por Advizall
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 