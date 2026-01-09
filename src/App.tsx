import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './modules/Dashboard/DashboardPage';
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from './core/ui/theme';

// 1. IMPORTAR EL NUEVO COMPONENTE MGC
import { MgcDashboard } from './modules/mgc/pages/MgcDashboard';

function App() {
  return (
    <ThemeProvider theme={appTheme}> 
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            
            {/* Aquí es donde vive tu nuevo módulo */}
            <Route path="/mgc" element={<MgcDashboard />} />

            <Route path="/ibi" element={<div className="p-8">Módulo IBI</div>} />
            <Route path="/aceria" element={<div className="p-8">Módulo Acería</div>} />
            <Route path="/mantenimiento" element={<div className="p-8">Módulo Mantenimiento</div>} />
            <Route path="/calidad" element={<div className="p-8">Módulo Calidad</div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;