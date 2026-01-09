import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

// Datos Mock (Falsos) para probar la visualización
const MOCK_HISTORY = [
    { id: 1, fecha: '2026-01-08', tecnico: 'Juan Perez', turno: 'A', horno: 'HF1', pendientes: 2 },
    { id: 2, fecha: '2026-01-08', tecnico: 'Maria Lopez', turno: 'B', horno: 'HF2', pendientes: 0 },
];

export const HistorialView = () => {
    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4 text-gray-700">Historial de Reportes</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Horno</TableCell>
                        <TableCell>Técnico</TableCell>
                        <TableCell>Turno</TableCell>
                        <TableCell>Pendientes Activos</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {MOCK_HISTORY.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell>{row.fecha}</TableCell>
                            <TableCell><Chip label={row.horno} size="small" color="primary" variant="outlined"/></TableCell>
                            <TableCell>{row.tecnico}</TableCell>
                            <TableCell>{row.turno}</TableCell>
                            <TableCell>
                                {row.pendientes > 0 
                                    ? <Chip label={`${row.pendientes} Pendientes`} color="error" size="small" />
                                    : <Chip label="OK" color="success" size="small" />
                                }
                            </TableCell>
                            <TableCell align="center">
                                <span className="text-blue-600 cursor-pointer text-sm font-bold">Ver Detalles</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};