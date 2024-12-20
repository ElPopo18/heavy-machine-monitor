import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Equipos from "@/pages/Equipos";
import EquiposRegistro from "@/pages/EquiposRegistro";
import Operarios from "@/pages/Operarios";
import OperariosRegistro from "@/pages/OperariosRegistro";
import Marcas from "@/pages/Marcas";
import MantenimientoRegistro from "@/pages/MantenimientoRegistro";
import Auth from "@/pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/equipos/registro" element={<EquiposRegistro />} />
        <Route path="/operarios" element={<Operarios />} />
        <Route path="/operarios/registro" element={<OperariosRegistro />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/mantenimiento/registro" element={<MantenimientoRegistro />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;