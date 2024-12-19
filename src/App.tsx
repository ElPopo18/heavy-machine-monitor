import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Equipos from "@/pages/Equipos";
import Operarios from "@/pages/Operarios";
import MantenimientoRegistro from "@/pages/MantenimientoRegistro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/operarios" element={<Operarios />} />
        <Route path="/mantenimiento/registro" element={<MantenimientoRegistro />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;