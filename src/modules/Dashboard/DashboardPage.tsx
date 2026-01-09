import { 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Chip, 
    LinearProgress, 
    Box, 
    Avatar 
} from '@mui/material';
import { 
    TrendingUp, 
    Users, 
    AlertTriangle, 
    ArrowRight,
    Calendar
} from 'lucide-react';

export const DashboardPage = () => {
    return (
        <div className="space-y-8 pb-10">
            
            {/* 1. Header de Bienvenida Corporativo */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-deacero-blue p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                
                {/* Decoración de fondo sutil */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-deacero-orange opacity-10 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

                <div className="relative z-10">
                    <Typography variant="overline" className="opacity-90 tracking-widest text-deacero-orange font-bold">
                        Panel de Control
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: 'Infra' }}>
                        Hola, Navarro
                    </Typography>
                    <Typography variant="body1" className="opacity-80 mt-1 max-w-xl text-slate-100 font-light">
                        Aquí tienes el resumen operativo de hoy en Planta Celaya. Tienes <span className="font-bold text-white">3 alertas</span> pendientes en Mantenimiento.
                    </Typography>
                </div>
                
                <Button 
                    variant="contained" 
                    // Usamos el color secundario (Naranja) definido en el theme.ts
                    color="secondary"
                    startIcon={<Calendar size={18} />}
                    sx={{ 
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(255, 107, 0, 0.39)', // Sombra naranja brillante
                        color: 'white'
                    }}
                >
                    Ver Agenda
                </Button>
            </div>

            {/* 2. KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* KPI 1: IBI (Acento Azul) */}
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Avatar sx={{ bgcolor: '#e0e7ff', color: '#002D6F' }}>
                                <TrendingUp size={20} />
                            </Avatar>
                            <Chip label="+2.4%" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 'bold' }} />
                        </div>
                        <Typography variant="h3" fontWeight="900" sx={{ color: '#002D6F', fontFamily: 'Infra' }}>
                            83%
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#808081', fontWeight: 600 }}>
                            Índice de Favorabilidad (IBI)
                        </Typography>
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={83} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 5, 
                                    bgcolor: '#f1f5f9', 
                                    '& .MuiLinearProgress-bar': { bgcolor: '#002D6F' } 
                                }} 
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* KPI 2: Personal (Acento Naranja) */}
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Avatar sx={{ bgcolor: '#fff7ed', color: '#FF6B00' }}>
                                <Users size={20} />
                            </Avatar>
                            <Chip label="Turno A" size="small" variant="outlined" sx={{ borderColor: '#FF6B00', color: '#FF6B00', fontWeight: 'bold' }} />
                        </div>
                        <Typography variant="h3" fontWeight="900" sx={{ color: '#002D6F', fontFamily: 'Infra' }}>
                            1,240
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#808081', fontWeight: 600 }}>
                            Personal Activo en Planta
                        </Typography>
                         <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={65} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 5, 
                                    bgcolor: '#f1f5f9', 
                                    '& .MuiLinearProgress-bar': { bgcolor: '#FF6B00' } 
                                }} 
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* KPI 3: Riesgos (Acento Amarillo/Alerta) */}
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent className="p-6 relative overflow-hidden">
                        {/* Círculo decorativo */}
                        <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-full -mr-8 -mt-8 opacity-50"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <Avatar sx={{ bgcolor: '#fffbeb', color: '#f59e0b' }}>
                                <AlertTriangle size={20} />
                            </Avatar>
                            <Chip label="Atención" size="small" color="warning" sx={{ fontWeight: 'bold' }} />
                        </div>
                        <Typography variant="h3" fontWeight="900" sx={{ color: '#002D6F', fontFamily: 'Infra' }} className="relative z-10">
                            3
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#808081', fontWeight: 600 }} className="relative z-10">
                            Incidencias Abiertas
                        </Typography>
                        <Button 
                            endIcon={<ArrowRight size={16} />} 
                            sx={{ mt: 1, p: 0, color: '#d97706', fontWeight: 'bold', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                        >
                            Ver reporte
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Sección de Accesos Rápidos */}
            <div>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#4B4A4B' }}>
                    Accesos Directos
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Generar Reporte', 'Consultar Bitácora', 'Solicitar Vacaciones', 'Soporte TI'].map((text, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-deacero-blue/50 cursor-pointer transition-all flex items-center justify-between group">
                            <span className="font-bold text-deacero-blue text-sm">{text}</span>
                            <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-deacero-orange group-hover:text-white transition-colors">
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};