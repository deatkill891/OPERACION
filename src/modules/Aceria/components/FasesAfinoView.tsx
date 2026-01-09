import React, { useState, useMemo } from 'react';
import { 
    Paper, Typography, Grid, TextField, MenuItem, Button, 
    Table, TableHead, TableRow, TableCell, TableBody, Chip, Box
} from '@mui/material';
import { Save, Flame, Download, Calculator } from 'lucide-react';

interface FaseAfino {
    id: string;
    fase: '1' | '2' | '3';
    coladaInicial: number;
    coladaFinal: number;
    duracion: number;
    tecnico: string;
    timestamp: string;
}

export const FasesAfinoView = () => {
    // --- ESTADOS ---
    const [faseForm, setFaseForm] = useState({
        fase: '1',
        coladaInicial: 100, 
        coladaFinal: ''
    });

    const [filtroFase, setFiltroFase] = useState(''); // Filtro de la tabla

    // Mock inicial de datos
    const [historialFases, setHistorialFases] = useState<FaseAfino[]>([
        { id: '1', fase: '1', coladaInicial: 100, coladaFinal: 105, duracion: 5, tecnico: 'Juan Perez', timestamp: new Date().toLocaleString() },
        { id: '2', fase: '2', coladaInicial: 105, coladaFinal: 112, duracion: 7, tecnico: 'Maria Lopez', timestamp: new Date().toLocaleString() },
        { id: '3', fase: '1', coladaInicial: 112, coladaFinal: 116, duracion: 4, tecnico: 'Carlos Ruiz', timestamp: new Date().toLocaleString() }
    ]);

    // --- LÓGICA FILTRADO Y CÁLCULOS ---
    
    // 1. Filtrar datos según el select
    const datosFiltrados = useMemo(() => {
        if (!filtroFase) return historialFases;
        return historialFases.filter(f => f.fase === filtroFase);
    }, [historialFases, filtroFase]);

    // 2. Calcular promedio dinámico
    const promedioDuracion = useMemo(() => {
        if (datosFiltrados.length === 0) return 0;
        const suma = datosFiltrados.reduce((acc, curr) => acc + curr.duracion, 0);
        return (suma / datosFiltrados.length).toFixed(1);
    }, [datosFiltrados]);

    // --- HANDLERS ---

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const final = Number.parseInt(faseForm.coladaFinal, 10);
        
        if (Number.isNaN(final) || final < faseForm.coladaInicial) {
            alert("Error: La colada final debe ser mayor o igual a la inicial");
            return;
        }

        const nuevaFase: FaseAfino = {
            id: crypto.randomUUID(),
            fase: faseForm.fase as any,
            coladaInicial: faseForm.coladaInicial,
            coladaFinal: final,
            duracion: final - faseForm.coladaInicial,
            tecnico: 'Usuario Actual',
            timestamp: new Date().toLocaleString()
        };

        setHistorialFases([nuevaFase, ...historialFases]);
        setFaseForm({ ...faseForm, coladaFinal: '', coladaInicial: final });
    };

    const downloadCSV = () => {
        if (datosFiltrados.length === 0) return;

        const headers = ["Fase", "Colada Inicial", "Colada Final", "Duracion", "Tecnico", "Fecha"];
        const rows = datosFiltrados.map(item => 
            [`Fase ${item.fase}`, item.coladaInicial, item.coladaFinal, item.duracion, item.tecnico, item.timestamp].join(";")
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(";"), ...rows].join("\r\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_Fases_Afino_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        
        // CORRECCIÓN SONARLINT: Método moderno para remover
        link.remove();
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-10">
            
            {/* 1. FORMULARIO DE REGISTRO */}
            <Paper className="p-6 border-l-4 border-yellow-500 bg-yellow-50/20">
                <Typography variant="h6" className="text-yellow-800 font-bold mb-4 flex items-center gap-2">
                    <Flame size={24} /> Registro de Sección de Electrodo
                </Typography>
                
                <form onSubmit={handleSave}>
                    <Grid container spacing={3} alignItems="flex-end">
                        {/* CORRECCIÓN GRID: Usamos 'size' en lugar de 'item xs' */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField select fullWidth label="Fase" value={faseForm.fase} onChange={e => setFaseForm({...faseForm, fase: e.target.value})}>
                                <MenuItem value="1">Fase 1</MenuItem>
                                <MenuItem value="2">Fase 2</MenuItem>
                                <MenuItem value="3">Fase 3</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField fullWidth label="Colada Inicial" type="number" disabled value={faseForm.coladaInicial} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField fullWidth label="Colada Final" type="number" required value={faseForm.coladaFinal} onChange={e => setFaseForm({...faseForm, coladaFinal: e.target.value})} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Button variant="contained" color="warning" fullWidth size="large" startIcon={<Save />} type="submit">
                                Registrar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* 2. PANEL DE CONTROL (FILTRO Y PROMEDIO) */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper className="p-4 flex items-center gap-4 bg-gray-50">
                        <Typography className="font-bold text-gray-600">Filtrar por Fase:</Typography>
                        <TextField select size="small" className="w-48" value={filtroFase} onChange={e => setFiltroFase(e.target.value)}>
                            <MenuItem value="">Todas las Fases</MenuItem>
                            <MenuItem value="1">Fase 1</MenuItem>
                            <MenuItem value="2">Fase 2</MenuItem>
                            <MenuItem value="3">Fase 3</MenuItem>
                        </TextField>
                        <Button variant="outlined" color="success" startIcon={<Download />} onClick={downloadCSV}>
                            Exportar CSV
                        </Button>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper className="p-4 bg-yellow-100 border border-yellow-300 flex items-center justify-between">
                        <Box>
                            <Typography variant="caption" className="font-bold text-yellow-800 uppercase block">Promedio Duración</Typography>
                            <Typography variant="h4" className="font-black text-yellow-900">{promedioDuracion}</Typography>
                        </Box>
                        <Calculator size={32} className="text-yellow-600 opacity-50"/>
                    </Paper>
                </Grid>
            </Grid>

            {/* 3. TABLA DE HISTORIAL */}
            <Paper className="p-6">
                <Typography variant="h6" className="mb-4 text-gray-700 font-bold">Historial de Secciones</Typography>
                <Table size="small">
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>Fase</TableCell>
                            <TableCell align="center">Colada Inicial</TableCell>
                            <TableCell align="center">Colada Final</TableCell>
                            <TableCell align="center">Duración</TableCell>
                            <TableCell>Técnico</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosFiltrados.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell className="font-bold text-yellow-700">FASE {row.fase}</TableCell>
                                <TableCell align="center">{row.coladaInicial}</TableCell>
                                <TableCell align="center" className="font-bold">{row.coladaFinal}</TableCell>
                                <TableCell align="center">
                                    <Chip label={`${row.duracion} col`} color="warning" size="small" variant="filled" />
                                </TableCell>
                                <TableCell>{row.tecnico}</TableCell>
                                <TableCell className="text-gray-500 text-xs">{row.timestamp}</TableCell>
                            </TableRow>
                        ))}
                        {datosFiltrados.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-6 text-gray-400">
                                    No hay registros para mostrar
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
};