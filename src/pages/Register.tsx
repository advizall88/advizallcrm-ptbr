import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";

// Esquema de validação para o formulário de registro
const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório e deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  confirmPassword: z.string().min(1, { message: "Por favor, confirme sua senha." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { forceDefaultTheme } = useTheme();
  
  // Forçar tema light para a página de registro
  useEffect(() => {
    forceDefaultTheme();
  }, [forceDefaultTheme]);
  
  // Se o usuário já estiver autenticado, redirecione
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Configuração do formulário com validação
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Função de envio do formulário
  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Register: Registrando novo usuário", data.email);
    
    setIsLoading(true);
    setError("");
    
    try {
      // Registrar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });
      
      if (authError) {
        console.error("Error during registration:", authError.message);
        setError(authError.message);
        toast({
          title: "Erro no Cadastro",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }
      
      if (authData.user) {
        // Normalmente não precisamos criar o registro na tabela users manualmente
        // porque o trigger on_auth_user_created o fará automaticamente
        // Mas podemos adicionar campos customizados se necessário
        
        setRegistrationSuccess(true);
        toast({
          title: "Cadastro Realizado com Sucesso",
          description: "Por favor, verifique seu e-mail para confirmar sua conta antes de fazer login.",
        });
        
        // Reset the form
        form.reset();
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    } catch (error: any) {
      console.error("Unexpected error during registration:", error);
      setError(error.message);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
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
          <CardTitle className="text-2xl text-center font-semibold">Criar uma Conta</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Digite seus dados para se cadastrar no Advizall CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Success message */}
          {registrationSuccess && (
            <Alert className="bg-green-50 border-green-100">
              <AlertDescription className="text-green-800">
                Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar sua conta antes de fazer login.
                Você será redirecionado para a página de login em breve.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Registration form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome"
                        autoComplete="name"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
                        disabled={registrationSuccess || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        autoComplete="email"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
                        disabled={registrationSuccess || isLoading}
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
                        autoComplete="new-password"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
                        disabled={registrationSuccess || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-gray-200"
                        disabled={registrationSuccess || isLoading}
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
                disabled={registrationSuccess || isLoading}
              >
                {isLoading ? "Criando Conta..." : "Criar Conta"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                Entrar
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

export default Register; 