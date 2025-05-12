import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
import { useTheme } from "@/contexts/ThemeContext";

// Esquema de validação para o formulário de login
const loginFormSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(1, { message: "Senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  // Estado para controlar o carregamento e erros
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Hooks para autenticação e navegação
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { forceDefaultTheme } = useTheme();
  
  // Obtém a rota original que o usuário tentou acessar
  const from = location.state?.from?.pathname || "/";
  
  // Forçar tema light para a página de login
  useEffect(() => {
    forceDefaultTheme();
  }, [forceDefaultTheme]);
  
  // Se o usuário já estiver autenticado, redirecione
  useEffect(() => {
    if (user) {
      console.log("Login: Usuário já autenticado, redirecionando para:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Log para depuração
  useEffect(() => {
    console.log("Login: Componente montado");
    console.log("Login: Rota original =", from);
    return () => {
      console.log("Login: Componente desmontado");
    };
  }, [from]);

  // Configuração do formulário de login com validação
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Função de login
  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login: Tentando login com", data.email);
    
    // Limpa erros e define carregando
    setIsLoading(true);
    setError("");
    
    try {
      // Chama a função de login do contexto de autenticação
      const { error, success } = await signIn(data.email, data.password, navigate);
      
      if (error || !success) {
        // Em caso de erro, exibe mensagem
        setError(error?.message || "Falha no login. Verifique suas credenciais.");
        toast({
          title: "Erro de Login",
          description: error?.message || "Credenciais inválidas",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Em caso de sucesso, exibe notificação
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao Advizall CRM",
      });
      
      console.log("Login: Login bem-sucedido, redirecionamento será feito pelo useEffect");
      // O redirecionamento é feito pelo useEffect quando user é definido
    } catch (error: any) {
      // Captura erros inesperados
      setError(error?.message || "Ocorreu um erro inesperado");
      toast({
        title: "Erro",
        description: error?.message || "Erro durante o login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-100 bg-white/95 backdrop-blur-sm rounded-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="Advizall" className="h-12 drop-shadow-md" />
          </div>
          <CardTitle className="text-2xl text-center font-semibold">Advizall CRM</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exibe erros se houver */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Formulário de login */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        autoComplete="email"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
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
                    <FormLabel className="text-gray-700">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        autoComplete="current-password"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Desenvolvido por <span className="font-medium text-gray-700">Advizall</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 