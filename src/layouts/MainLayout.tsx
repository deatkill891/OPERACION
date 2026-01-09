import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Factory, 
  Wrench, 
  ShieldCheck, 
  Menu, 
  Search, 
  UserCircle,
  LogOut,
  ChevronRight,
  Bell,
  ClipboardCheck // 1. IMPORTAMOS EL ICONO NUEVO
} from 'lucide-react';
import { IconButton, Avatar, Badge, Tooltip } from '@mui/material';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Menú de navegación
  const menuItems = [
    { path: '/', label: 'Inicio', icon: LayoutDashboard },
    
    // 2. AGREGAMOS EL NUEVO MÓDULO AQUÍ
    { path: '/mgc', label: 'Gestión Calidad', icon: ClipboardCheck },

    { path: '/ibi', label: 'Reporte IBI', icon: Activity },
    { path: '/aceria', label: 'Acería', icon: Factory },
    { path: '/mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { path: '/calidad', label: 'Calidad', icon: ShieldCheck },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SIDEBAR IZQUIERDA (CORPORATIVA) --- */}
      <aside 
        className={`
          bg-deacero-blue text-white flex flex-col transition-all duration-300 ease-in-out border-r border-deacero-blue shadow-2xl z-20
          ${isSidebarOpen ? "w-72" : "w-20"}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <div className="flex items-center gap-3 font-bold text-white tracking-wider">
            {/* Logo con fondo Naranja Deacero */}
            <div className="bg-deacero-orange p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <Activity size={22} color="white" />
            </div>
            {isSidebarOpen && <span className="text-lg font-black tracking-widest">OPERACIÓN</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${isActive 
                  ? "bg-deacero-orange text-white shadow-md font-bold" 
                  : "hover:bg-white/10 hover:text-white text-slate-300"}
              `}
            >
              {/* CORRECCIÓN: Usamos una función aquí para poder leer 'isActive' */}
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                  
                  {isSidebarOpen && (
                    <span className="text-sm">{item.label}</span>
                  )}

                  {/* Tooltip flotante cuando está cerrado */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-deacero-blue text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-white/10">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-deacero-blue">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}>
                {/* Avatar usando Naranja como acento */}
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#FF6B00', fontSize: 14, fontWeight: 'bold' }}>DN</Avatar>
                
                {isSidebarOpen && (
                    <div className="flex-1 min-w-0 animate-fadeIn">
                        <p className="text-sm font-bold text-white truncate">D. Navarro</p>
                        <p className="text-xs text-slate-300 truncate">Desarrollador</p>
                    </div>
                )}
                {isSidebarOpen && (
                  <Tooltip title="Cerrar Sesión">
                    <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#FF6B00' } }}>
                      <LogOut size={18} />
                    </IconButton>
                  </Tooltip>
                )}
            </div>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* NAVBAR SUPERIOR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <Menu className="text-deacero-blue" />
                </IconButton>
                
                {/* Breadcrumb */}
                <div className="hidden md:flex items-center text-sm text-slate-500">
                    <span className="opacity-60">Plataforma</span>
                    <ChevronRight size={14} className="mx-2 opacity-40" />
                    <span className="font-bold text-deacero-blue text-lg">{getPageTitle()}</span>
                </div>
            </div>

            {/* Acciones Derecha */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Barra búsqueda */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-deacero-blue/30 focus-within:bg-white transition-all w-64">
                    <Search size={16} className="text-slate-400 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Buscar módulo..." 
                        className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-600 placeholder:text-slate-400"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <Tooltip title="Notificaciones">
                  <IconButton>
                    <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { bgcolor: '#FF6B00' } }}>
                      <Bell size={20} className="text-slate-600" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Perfil">
                  <IconButton>
                    <UserCircle size={24} className="text-slate-600" />
                  </IconButton>
                </Tooltip>
            </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA (Outlet) */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};