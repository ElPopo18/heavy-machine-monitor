import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Equipos from "@/pages/Equipos";
import EquiposRegistro from "@/pages/EquiposRegistro";
import Operarios from "@/pages/Operarios";
import OperariosRegistro from "@/pages/OperariosRegistro";
import Marcas from "@/pages/Marcas";
import MarcasRegistro from "@/pages/MarcasRegistro";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/equipos/registro" element={<EquiposRegistro />} />
          <Route path="/operarios" element={<Operarios />} />
          <Route path="/operarios/registro" element={<OperariosRegistro />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/marcas/registro" element={<MarcasRegistro />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;