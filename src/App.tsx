import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './modules/Dashboard/DashboardPage';
import { AceriaPage } from './modules/Aceria/pages/AceriaPage';

// 1. IMPORTAR EL NUEVO COMPONENTE MGC
import { MgcDashboard } from './modules/mgc/pages/MgcDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Principal que engloba el sistema */}
        <Route element={<MainLayout />}>
          
          {/* Ruta raíz = Dashboard */}
          <Route path="/" element={<DashboardPage />} />
          
          {/* 2. NUEVA RUTA REGISTRADA AQUÍ */}
          <Route path="/mgc" element={<MgcDashboard />} />

          {/* Otros módulos */}
          <Route path="/ibi" element={<div className="p-8">Módulo IBI (Próximamente)</div>} />
          <Route path="/aceria" element={<AceriaPage />} />
          <Route path="/mantenimiento" element={<div className="p-8">Módulo Mantenimiento (Próximamente)</div>} />
          <Route path="/calidad" element={<div className="p-8">Módulo Calidad (Próximamente)</div>} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;