import React, { useState } from 'react';
import { 
    Paper, Typography, Grid, TextField, MenuItem, Button, 
    Table, TableHead, TableRow, TableCell, TableBody, Chip 
} from '@mui/material';
import { Save, Flame } from 'lucide-react';

interface FaseAfino {
    id: string;
    fase: '1' | '2' | '3';
    coladaInicial: number;
    coladaFinal: number;
    duracion: number; // Calculado
    tecnico: string;
    timestamp: string;
}

export const FasesAfinoView = () => {
    // Estado local para el formulario pequeño de esta vista
    const [faseForm, setFaseForm] = useState({
        fase: '1',
        coladaInicial: 100, // Valor inicial simulado
        coladaFinal: ''
    });

    const [historialFases, setHistorialFases] = useState<FaseAfino[]>([
        { id: '1', fase: '1', coladaInicial: 100, coladaFinal: 105, duracion: 5, tecnico: 'Juan Perez', timestamp: '2026-01-08 10:00' }
    ]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Parsing seguro con base decimal
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
            tecnico: 'Usuario Actual', // Tomar del contexto de auth
            timestamp: new Date().toLocaleString()
        };

        setHistorialFases([nuevaFase, ...historialFases]);
        
        // Resetear form y simular que la siguiente inicia donde terminó esta
        setFaseForm({ ...faseForm, coladaFinal: '', coladaInicial: final });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* FORMULARIO DE REGISTRO */}
            <Paper className="p-6 border-l-4 border-yellow-500 bg-yellow-50/20">
                <Typography variant="h6" className="text-yellow-800 font-bold mb-4 flex items-center gap-2">
                    <Flame size={24} /> Registro de Sección de Electrodo
                </Typography>
                
                <form onSubmit={handleSave}>
                    {/* CORRECCIÓN: Usamos size={{ xs: 12, md: 3 }} para compatibilidad con MUI v6 */}
                    <Grid container spacing={3} alignItems="flex-end">
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

            {/* TABLA DE HISTORIAL */}
            <Paper className="p-6">
                <Typography variant="h6" className="mb-4 text-gray-700">Historial de Secciones</Typography>
                <Table size="small">
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>Fase</TableCell>
                            <TableCell>Colada Inicial</TableCell>
                            <TableCell>Colada Final</TableCell>
                            <TableCell>Duración</TableCell>
                            <TableCell>Técnico</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historialFases.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-bold text-yellow-700">FASE {row.fase}</TableCell>
                                <TableCell>{row.coladaInicial}</TableCell>
                                <TableCell>{row.coladaFinal}</TableCell>
                                <TableCell>
                                    <Chip label={`${row.duracion} coladas`} size="small" className="font-bold" />
                                </TableCell>
                                <TableCell>{row.tecnico}</TableCell>
                                <TableCell className="text-gray-500 text-xs">{row.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
};