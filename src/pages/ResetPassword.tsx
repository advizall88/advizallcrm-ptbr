import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { forceDefaultTheme } = useTheme();

  // Forçar tema light para a página de redefinição de senha
  useEffect(() => {
    forceDefaultTheme();
  }, [forceDefaultTheme]);

  // Extract the token from the URL when the component mounts
  useEffect(() => {
    try {
      // The URL format from Supabase is like: /reset-password#access_token=XXX&type=recovery
      const hashParams = new URLSearchParams(location.hash.replace('#', ''));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      console.log("Hash params:", { type, tokenExists: !!accessToken });

      if (accessToken && type === 'recovery') {
        // Set session with the recovery token
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '',
        }).then(({ data, error }) => {
          if (error) {
            console.error("Error setting session:", error);
            setError("There was a problem validating your reset link. Please request a new one.");
          } else if (data.session) {
            console.log("Session established successfully");
            setToken(accessToken);
          }
        });
      } else {
        setError("Invalid or expired password reset link. Please request a new one.");
      }
    } catch (err) {
      console.error("Error parsing hash:", err);
      setError("There was a problem with your reset link. Please request a new one.");
    }
  }, [location]);

  // Reset password function
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("No valid reset token found. Please request a new password reset link.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Now that we have established a session with the token,
      // we can use the standard updateUser method
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully. You can now log in with your new password.",
      });
      
      // Sign out to clear the temporary session
      await supabase.auth.signOut();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                disabled={!token || loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                disabled={!token || loading}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!token || loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/login")}
            className="text-sm"
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword; 