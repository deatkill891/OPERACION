import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './modules/Dashboard/DashboardPage';

// --- CAMBIOS FUSIONADOS ---
// 1. Traemos el tema que configuró tu equipo
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from './core/ui/theme';

// 2. Traemos TU módulo de Acería
import { AceriaPage } from './modules/Aceria/pages/AceriaPage';

// 3. Importamos MGC
import { MgcDashboard } from './modules/mgc/pages/MgcDashboard';

function App() {
  return (
    // Usamos el ThemeProvider de tu equipo
    <ThemeProvider theme={appTheme}> 
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            
            {/* Ruta MGC */}
            <Route path="/mgc" element={<MgcDashboard />} />

            {/* Ruta ACERÍA */}
            <Route path="/aceria" element={<AceriaPage />} />

            {/* Otros módulos (Placeholders) */}
            <Route path="/ibi" element={<div className="p-8">Módulo IBI (Próximamente)</div>} />
            <Route path="/mantenimiento" element={<div className="p-8">Módulo Mantenimiento (Próximamente)</div>} />
            <Route path="/calidad" element={<div className="p-8">Módulo Calidad (Próximamente)</div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;