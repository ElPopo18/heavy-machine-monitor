import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Equipos from "@/pages/Equipos";
import EquiposRegistro from "@/pages/EquiposRegistro";
import EquiposEditar from "@/pages/EquiposEditar";
import Operarios from "@/pages/Operarios";
import OperariosRegistro from "@/pages/OperariosRegistro";
import OperariosEditar from "@/pages/OperariosEditar";
import Marcas from "@/pages/Marcas";
import MantenimientoRegistro from "@/pages/MantenimientoRegistro";
import MantenimientoCalendario from "@/pages/MantenimientoCalendario";
import MantenimientoEditar from "@/pages/MantenimientoEditar";
import Auth from "@/pages/Auth";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={session ? <Index /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/equipos"
            element={session ? <Equipos /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/equipos/registro"
            element={session ? <EquiposRegistro /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/equipos/editar/:id"
            element={session ? <EquiposEditar /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/operarios"
            element={session ? <Operarios /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/operarios/registro"
            element={
              session ? <OperariosRegistro /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/operarios/editar/:id"
            element={
              session ? <OperariosEditar /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/marcas"
            element={session ? <Marcas /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/mantenimiento/registro"
            element={
              session ? <MantenimientoRegistro /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/mantenimiento/calendario"
            element={
              session ? (
                <MantenimientoCalendario />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/mantenimiento/editar/:id"
            element={
              session ? <MantenimientoEditar /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/auth"
            element={!session ? <Auth /> : <Navigate to="/" replace />}
          />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
}

export default App;