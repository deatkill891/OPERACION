import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

// Datos Mock para visualizar (simulando lo que vendría de SQL Server)
const MOCK_PARTICIPATION = [
    { id: 1, colaborador: 'Juan Perez', ideasA2: 3, observaciones: 5 },
    { id: 2, colaborador: 'Maria Lopez', ideasA2: 1, observaciones: 0 },
    { id: 3, colaborador: 'Carlos Ruiz', ideasA2: 4, observaciones: 2 },
];

export const ParticipacionView = () => {
    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4 text-blue-800 font-bold">
                Resumen de Participación por Colaborador
            </Typography>
            
            <Table>
                <TableHead className="bg-blue-50">
                    <TableRow>
                        <TableCell>Nombre del Colaborador</TableCell>
                        <TableCell align="center">Total Ideas A2</TableCell>
                        <TableCell align="center">Total Obs. Seguridad</TableCell>
                        <TableCell align="center">Estatus</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {MOCK_PARTICIPATION.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell className="font-medium">{row.colaborador}</TableCell>
                            <TableCell align="center">
                                <Chip label={row.ideasA2} color="primary" variant={row.ideasA2 > 0 ? "filled" : "outlined"} size="small" />
                            </TableCell>
                            <TableCell align="center">
                                <Chip label={row.observaciones} color="warning" variant={row.observaciones > 0 ? "filled" : "outlined"} size="small" />
                            </TableCell>
                            <TableCell align="center">
                                {row.ideasA2 + row.observaciones > 5 
                                    ? <span className="text-green-600 font-bold text-xs">EXCELENTE</span>
                                    : <span className="text-gray-400 text-xs">NORMAL</span>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};