import { useState } from 'react';
import { 
    Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, 
    Grid, TextField, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, 
    DialogActions, Divider, IconButton // <--- CORRECCIÓN: Agregado IconButton
} from '@mui/material';
import { FileText, Filter, X } from 'lucide-react';

// Tipos locales para el historial
interface HistorialReporte {
    id: string;
    fecha: string;
    tecnico: string;
    turno: string;
    horno: string;
    pendientes: number;
    severidadAlta: boolean;
    estatus: 'Abierto' | 'Cerrado';
    // Datos extra para el modal (simulados)
    detalle?: {
        acciones: string;
        ollas: string;
        participacion: string[];
    }
}

const MOCK_DATA: HistorialReporte[] = [
    { 
        id: '1', fecha: '2026-01-08', tecnico: 'Juan Perez', turno: 'A', horno: 'HF1', 
        pendientes: 2, severidadAlta: false, estatus: 'Abierto',
        detalle: {
            acciones: 'Se realizó cambio de electrodo fase 1. Limpieza de escoria normal.',
            ollas: 'Olla 1 (3 coladas), Olla 4 (1 colada)',
            participacion: ['Idea A2: Mejorar iluminación pasillo', 'Obs: Piso resbaloso en zona 3']
        }
    },
    { 
        id: '2', fecha: '2026-01-08', tecnico: 'Maria Lopez', turno: 'B', horno: 'HF2', 
        pendientes: 0, severidadAlta: false, estatus: 'Cerrado',
        detalle: {
            acciones: 'Operación normal sin contratiempos.',
            ollas: 'Olla 2 (5 coladas)',
            participacion: []
        }
    },
    { 
        id: '3', fecha: '2026-01-07', tecnico: 'Carlos Ruiz', turno: 'C', horno: 'HF1', 
        pendientes: 5, severidadAlta: true, estatus: 'Abierto',
        detalle: {
            acciones: 'Falla en sistema hidráulico de bóveda. Se detuvo operación 2 horas.',
            ollas: 'Olla 1 (1 colada)',
            participacion: ['Obs: Fuga de aceite detectada']
        }
    },
];

export const HistorialView = () => {
    // --- ESTADOS ---
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        tecnico: '',
        estatus: ''
    });

    // Estado para el Modal
    const [openModal, setOpenModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<HistorialReporte | null>(null);

    // --- LÓGICA ---
    const reportesFiltrados = MOCK_DATA.filter(repo => {
        if (filtros.fechaInicio && repo.fecha < filtros.fechaInicio) return false;
        if (filtros.fechaFin && repo.fecha > filtros.fechaFin) return false;
        if (filtros.tecnico && repo.tecnico !== filtros.tecnico) return false;
        if (filtros.estatus && repo.estatus !== filtros.estatus) return false;
        return true;
    });

    const handleOpenModal = (reporte: HistorialReporte) => {
        setSelectedReport(reporte);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedReport(null);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-10">
            {/* PANEL DE FILTROS */}
            <Paper className="p-6 bg-white shadow-md">
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Filter size={20} className="text-gray-500"/>
                    <Typography variant="h6" className="text-gray-700 font-bold">Filtros de Búsqueda</Typography>
                </Box>
                
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField 
                            type="date" fullWidth label="F. Inicio" 
                            slotProps={{ inputLabel: { shrink: true } }} 
                            value={filtros.fechaInicio}
                            onChange={e => setFiltros({...filtros, fechaInicio: e.target.value})}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField 
                            type="date" fullWidth label="F. Fin" 
                            slotProps={{ inputLabel: { shrink: true } }} 
                            value={filtros.fechaFin}
                            onChange={e => setFiltros({...filtros, fechaFin: e.target.value})}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth label="Técnico" value={filtros.tecnico} onChange={e => setFiltros({...filtros, tecnico: e.target.value})}>
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Juan Perez">Juan Perez</MenuItem>
                            <MenuItem value="Maria Lopez">Maria Lopez</MenuItem>
                            <MenuItem value="Carlos Ruiz">Carlos Ruiz</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth label="Estatus" value={filtros.estatus} onChange={e => setFiltros({...filtros, estatus: e.target.value})}>
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Abierto">Abiertos</MenuItem>
                            <MenuItem value="Cerrado">Cerrados</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* TABLA DE RESULTADOS */}
            <Paper className="p-6 overflow-hidden">
                <Typography variant="h6" className="mb-4 text-gray-700 font-bold">Resultados ({reportesFiltrados.length})</Typography>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Horno</TableCell>
                                <TableCell>Técnico</TableCell>
                                <TableCell>Turno</TableCell>
                                <TableCell align="center">Pendientes</TableCell>
                                <TableCell align="center">Estatus</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportesFiltrados.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.fecha}</TableCell>
                                    <TableCell><Chip label={row.horno} size="small" variant="outlined" /></TableCell>
                                    <TableCell>{row.tecnico}</TableCell>
                                    <TableCell>{row.turno}</TableCell>
                                    <TableCell align="center">
                                        {row.pendientes > 0 
                                            ? <Chip label={row.pendientes} color={row.severidadAlta ? "error" : "warning"} size="small" />
                                            : <span className="text-gray-400">-</span>
                                        }
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={row.estatus} color={row.estatus === 'Abierto' ? "warning" : "success"} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            startIcon={<FileText size={16}/>} 
                                            size="small" 
                                            variant="text"
                                            onClick={() => handleOpenModal(row)}
                                        >
                                            Ver Bitácora
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reportesFiltrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" className="py-8 text-gray-500">
                                        No se encontraron reportes con estos filtros.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>

            {/* MODAL DE DETALLE (BITÁCORA COMPLETA) */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                {selectedReport && (
                    <>
                        <DialogTitle className="bg-gray-50 border-b flex justify-between items-center">
                            <span className="font-bold text-gray-800">
                                Bitácora del {selectedReport.fecha} - {selectedReport.tecnico}
                            </span>
                            <IconButton onClick={handleCloseModal} size="small"><X /></IconButton>
                        </DialogTitle>
                        <DialogContent className="py-6">
                            <Box className="space-y-4 mt-2">
                                {/* Sección 1: Info General */}
                                <Paper variant="outlined" className="p-3 bg-blue-50">
                                    <Typography variant="subtitle2" className="text-blue-800 font-bold">Información General</Typography>
                                    <Typography variant="body2">
                                        <strong>Horno:</strong> {selectedReport.horno} | <strong>Turno:</strong> {selectedReport.turno} | <strong>Estatus:</strong> {selectedReport.estatus}
                                    </Typography>
                                </Paper>

                                {/* Sección 2: Bitácora */}
                                <Box>
                                    <Typography variant="subtitle2" className="text-gray-700 font-bold mb-1">Acciones del Turno</Typography>
                                    <Paper variant="outlined" className="p-3 bg-gray-50">
                                        <Typography variant="body2" className="whitespace-pre-line">
                                            {selectedReport.detalle?.acciones || "Sin registro de acciones."}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <Divider />

                                {/* Sección 3: Ollas */}
                                <Box>
                                    <Typography variant="subtitle2" className="text-gray-700 font-bold mb-1">Ollas Reportadas</Typography>
                                    <Typography variant="body2">{selectedReport.detalle?.ollas || "Ninguna"}</Typography>
                                </Box>

                                <Divider />

                                {/* Sección 4: Participación */}
                                <Box>
                                    <Typography variant="subtitle2" className="text-gray-700 font-bold mb-1">Participación y Seguridad</Typography>
                                    {selectedReport.detalle?.participacion && selectedReport.detalle.participacion.length > 0 ? (
                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {/* CORRECCIÓN SONARLINT: Key única combinada */}
                                            {selectedReport.detalle.participacion.map((p, i) => (
                                                <li key={`${i}-${p}`}>{p}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Typography variant="caption" className="text-gray-400">Sin registros</Typography>
                                    )}
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions className="border-t p-3">
                            <Button onClick={handleCloseModal} color="primary">Cerrar</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};