import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    // Check current session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Monitoreo de Maquinaria
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión o regístrate para continuar
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 bg-card p-6 rounded-lg shadow-sm border">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                    inputText: 'white',
                    inputBackground: 'rgb(var(--background))',
                    inputBorder: 'rgb(var(--border))',
                  },
                },
              },
              className: {
                input: 'text-white',
                label: 'text-white',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            onError={(error) => {
              console.error('Auth error:', error);
              setError(error.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;