import React, { useState } from 'react';
import { 
  Paper, Grid, 
  TextField, MenuItem, Button, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  IconButton, Typography, Divider, Box, RadioGroup, FormControlLabel, Radio, Chip
} from '@mui/material';
import { Plus, Trash2, Save, UserPlus } from 'lucide-react';
import type { ReporteDiario, Pendiente } from '../types';

export const CapturaForm = () => {
  // --- ESTADO INICIAL ---
  const [formData, setFormData] = useState<ReporteDiario>({
    tecnico: '', turno: '', fecha: new Date().toISOString().split('T')[0],
    horno: 'HF1',
    pendientes: [],
    platicaSeguridad: { tema: '', impartidaPor: '', puntos: '' },
    bitacora: {
      problemasTurnoAnterior: '', accionesTurno: '',
      ollas: Array.from({ length: 5 }, (_, i) => ({ id: `olla-init-${i}`, noOlla: '', coladas: '' })),
      bobina1: { codigo: '', colada: '' },
      bobina2: { codigo: '', colada: '' },
      lanzas: { invVesuvius: 0, invElectronite: 0, funcionando: 'Vesuvius' }
    },
    participacion: { ideasA2: [], observaciones: [] }
  });

  // Estados locales para inputs temporales
  const [tempIdeaName, setTempIdeaName] = useState('');
  const [tempObsName, setTempObsName] = useState('');

  // --- HANDLERS ---
  const addPendiente = () => {
    const newPendiente: Pendiente = {
      id: crypto.randomUUID(), descripcion: '', fDeteccion: '', 
      responsable: 'Operación', severidad: 'Baja', fCompromiso: '', 
      comentarios: '', estatus: 'Pendiente'
    };
    setFormData(prev => ({ ...prev, pendientes: [...prev.pendientes, newPendiente] }));
  };

  const updatePendiente = (index: number, field: keyof Pendiente, value: unknown) => {
    const updated = [...formData.pendientes];
    updated[index] = { ...updated[index], [field]: value as any };
    setFormData(prev => ({ ...prev, pendientes: updated }));
  };

  const addParticipante = (type: 'ideasA2' | 'observaciones', name: string) => {
    if (!name.trim()) return;
    
    // Generamos un ID único para el participante
    const nuevoParticipante = { id: crypto.randomUUID(), nombre: name };

    setFormData(prev => ({
      ...prev,
      participacion: {
        ...prev.participacion,
        [type]: [...prev.participacion[type], nuevoParticipante]
      }
    }));

    if (type === 'ideasA2') setTempIdeaName('');
    else setTempObsName('');
  };

  const removeParticipante = (type: 'ideasA2' | 'observaciones', idToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      participacion: {
        ...prev.participacion,
        [type]: prev.participacion[type].filter(p => p.id !== idToRemove)
      }
    }));
  };

  // Handler para el Enter en los inputs de participación
  const handleKeyDownParticipante = (e: React.KeyboardEvent, type: 'ideasA2' | 'observaciones', value: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipante(type, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando reporte completo:", formData);
    alert("Reporte guardado. Verifica la consola para ver el JSON completo.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. EQUIPO DEL DÍA */}
      <Paper className="p-6 border-l-4 border-indigo-500 bg-indigo-50/10">
        <Typography variant="h6" className="mb-4 text-indigo-800 font-bold">1. Equipo del Día</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
             <TextField select fullWidth label="Horno" value={formData.horno} onChange={e => setFormData({...formData, horno: e.target.value as any})}>
                <MenuItem value="HF1">Horno Fusión 1</MenuItem>
                <MenuItem value="HF2">Horno Fusión 2</MenuItem>
             </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Técnico" value={formData.tecnico} onChange={e => setFormData({...formData, tecnico: e.target.value})} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField select fullWidth label="Turno" value={formData.turno} onChange={e => setFormData({...formData, turno: e.target.value})}>
                <MenuItem value="A">Turno A</MenuItem>
                <MenuItem value="B">Turno B</MenuItem>
                <MenuItem value="C">Turno C</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField 
                type="date" 
                fullWidth 
                label="Fecha" 
                slotProps={{ inputLabel: { shrink: true } }} 
                value={formData.fecha} 
                onChange={e => setFormData({...formData, fecha: e.target.value})} 
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. PENDIENTES DEL DÍA */}
      <Paper className="p-6 border-l-4 border-red-500 bg-red-50/10">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className="text-red-800 font-bold">2. Pendientes del Día</Typography>
            <Button startIcon={<Plus />} variant="outlined" color="error" size="small" onClick={addPendiente}>Añadir Pendiente</Button>
        </Box>
        <Table size="small">
          <TableHead className="bg-red-50">
            <TableRow>
              <TableCell width="30%">Pendiente</TableCell>
              <TableCell width="20%">Responsable</TableCell>
              <TableCell width="15%">Severidad</TableCell>
              <TableCell width="30%">Comentarios</TableCell>
              <TableCell width="5%">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.pendientes.map((p, idx) => (
              <TableRow key={p.id}>
                <TableCell><TextField fullWidth size="small" placeholder="Descripción" value={p.descripcion} onChange={e => updatePendiente(idx, 'descripcion', e.target.value)} /></TableCell>
                <TableCell>
                    <TextField select fullWidth size="small" value={p.responsable} onChange={e => updatePendiente(idx, 'responsable', e.target.value)}>
                        <MenuItem value="Operación">Operación</MenuItem>
                        <MenuItem value="Mecánico">Mecánico</MenuItem>
                        <MenuItem value="Eléctrico">Eléctrico</MenuItem>
                        <MenuItem value="Servicios">Servicios</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell>
                    <TextField select fullWidth size="small" value={p.severidad} onChange={e => updatePendiente(idx, 'severidad', e.target.value)}>
                        <MenuItem value="Alta">Alta</MenuItem>
                        <MenuItem value="Media">Media</MenuItem>
                        <MenuItem value="Baja">Baja</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell><TextField fullWidth size="small" placeholder="Opcional" value={p.comentarios} onChange={e => updatePendiente(idx, 'comentarios', e.target.value)} /></TableCell>
                <TableCell>
                    <IconButton size="small" color="error" onClick={() => {
                        const upd = formData.pendientes.filter((_, i) => i !== idx);
                        setFormData({...formData, pendientes: upd});
                    }}><Trash2 size={16}/></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {formData.pendientes.length === 0 && <TableRow><TableCell colSpan={5} align="center" className="text-gray-400 italic">No hay pendientes registrados hoy</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      {/* 3. PLÁTICA DE SEGURIDAD */}
      <Paper className="p-6 border-l-4 border-yellow-500 bg-yellow-50/10">
        <Typography variant="h6" className="mb-4 text-yellow-800 font-bold">3. Plática de Seguridad</Typography>
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Tema Visto" value={formData.platicaSeguridad.tema} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, tema: e.target.value}})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Impartida Por" value={formData.platicaSeguridad.impartidaPor} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, impartidaPor: e.target.value}})} />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={2} label="Puntos Relevantes" value={formData.platicaSeguridad.puntos} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, puntos: e.target.value}})} />
            </Grid>
        </Grid>
      </Paper>

      {/* 4. BITÁCORA OPERATIVA */}
      <Paper className="p-6 border-l-4 border-green-500 bg-green-50/10">
        <Typography variant="h6" className="mb-4 text-green-800 font-bold">4. Bitácora Operativa</Typography>
        
        {/* Text Areas */}
        <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth multiline rows={4} label="Problemas Turno Anterior" placeholder="Describa problemas o fallas..." 
                    value={formData.bitacora.problemasTurnoAnterior} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, problemasTurnoAnterior: e.target.value}})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth multiline rows={4} label="Bitácora de Turno (Acciones)" placeholder="Acciones operativas clave..." 
                    value={formData.bitacora.accionesTurno} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, accionesTurno: e.target.value}})} />
            </Grid>
        </Grid>

        {/* Ollas */}
        <Typography variant="subtitle2" className="mb-2 text-gray-500 font-bold">Control de Ollas</Typography>
        <Grid container spacing={2} className="mb-6">
            {formData.bitacora.ollas.map((olla, i) => (
                <Grid size={{ xs: 6, md: 2.4 }} key={olla.id}>
                    <Paper variant="outlined" className="p-2 bg-white">
                        <Typography variant="caption" className="block text-center font-bold mb-1">Olla {i + 1}</Typography>
                        <TextField placeholder="No." size="small" fullWidth margin="dense" value={olla.noOlla} 
                            onChange={e => {
                                const newOllas = [...formData.bitacora.ollas];
                                newOllas[i] = { ...newOllas[i], noOlla: e.target.value };
                                setFormData({ ...formData, bitacora: { ...formData.bitacora, ollas: newOllas } });
                            }}
                        />
                        <TextField placeholder="Coladas" size="small" fullWidth margin="dense" value={olla.coladas}
                             onChange={e => {
                                const newOllas = [...formData.bitacora.ollas];
                                newOllas[i] = { ...newOllas[i], coladas: e.target.value };
                                setFormData({ ...formData, bitacora: { ...formData.bitacora, ollas: newOllas } });
                            }}
                        />
                    </Paper>
                </Grid>
            ))}
        </Grid>

        <Divider className="my-4" />

        {/* Bobinas y Lanzas */}
        <Grid container spacing={4}>
            {/* BOBINAS */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" className="p-4 bg-white h-full">
                    <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700">Captura de Bobinas</Typography>
                    
                    <Typography variant="caption" className="font-bold text-gray-500">Bobina 1</Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Código" size="small" fullWidth value={formData.bitacora.bobina1.codigo}
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina1: {...formData.bitacora.bobina1, codigo: e.target.value}}})} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Colada Entrada" size="small" fullWidth value={formData.bitacora.bobina1.colada}
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina1: {...formData.bitacora.bobina1, colada: e.target.value}}})} />
                        </Grid>
                    </Grid>

                    <Typography variant="caption" className="font-bold text-gray-500">Bobina 2</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Código" size="small" fullWidth value={formData.bitacora.bobina2.codigo}
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina2: {...formData.bitacora.bobina2, codigo: e.target.value}}})} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Colada Entrada" size="small" fullWidth value={formData.bitacora.bobina2.colada}
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina2: {...formData.bitacora.bobina2, colada: e.target.value}}})} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* LANZAS */}
            <Grid size={{ xs: 12, md: 6 }}>
                 <Paper variant="outlined" className="p-4 bg-white h-full">
                    <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700">Inventario y Lanza Activa</Typography>
                    
                    <Grid container spacing={2} mb={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Inv. Vesuvius" type="number" size="small" fullWidth value={formData.bitacora.lanzas.invVesuvius} 
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, lanzas: {...formData.bitacora.lanzas, invVesuvius: +e.target.value}}})} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Inv. Electronite" type="number" size="small" fullWidth value={formData.bitacora.lanzas.invElectronite}
                                onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, lanzas: {...formData.bitacora.lanzas, invElectronite: +e.target.value}}})} />
                        </Grid>
                    </Grid>

                    <Typography variant="caption" className="block mb-1 font-bold text-gray-500">Lanza Funcionando</Typography>
                    <RadioGroup row value={formData.bitacora.lanzas.funcionando} onChange={e => setFormData({
                        ...formData, bitacora: { ...formData.bitacora, lanzas: { ...formData.bitacora.lanzas, funcionando: e.target.value as any } }
                    })}>
                        <FormControlLabel value="Vesuvius" control={<Radio color="success"/>} label="Vesuvius" />
                        <FormControlLabel value="Electronite" control={<Radio color="success"/>} label="Electronite" />
                    </RadioGroup>
                 </Paper>
            </Grid>
        </Grid>
      </Paper>

      {/* 5. PARTICIPACIÓN Y SEGURIDAD */}
      <Paper className="p-6 border-l-4 border-blue-500 bg-blue-50/10">
        <Typography variant="h6" className="mb-4 text-blue-800 font-bold">5. Participación y Seguridad</Typography>
        
        <Grid container spacing={4}>
            {/* Ideas A2 */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" className="p-4 bg-white">
                    <Typography variant="subtitle2" className="mb-2 font-bold text-gray-700">Nombres Colaboradores Idea A2</Typography>
                    <Box display="flex" gap={1} mb={2}>
                        <TextField size="small" fullWidth placeholder="Nombre colaborador" value={tempIdeaName} onChange={e => setTempIdeaName(e.target.value)} 
                            onKeyDown={(e) => handleKeyDownParticipante(e, 'ideasA2', tempIdeaName)}
                        />
                        <Button variant="contained" size="small" onClick={() => addParticipante('ideasA2', tempIdeaName)}><Plus/></Button>
                    </Box>
                    <Box className="flex flex-wrap gap-2">
                        {formData.participacion.ideasA2.map((item) => (
                            <Chip key={item.id} label={item.nombre} onDelete={() => removeParticipante('ideasA2', item.id)} color="primary" variant="outlined" icon={<UserPlus size={14}/>} />
                        ))}
                        {formData.participacion.ideasA2.length === 0 && <span className="text-xs text-gray-400">Sin registros</span>}
                    </Box>
                </Paper>
            </Grid>

            {/* Observaciones */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" className="p-4 bg-white">
                    <Typography variant="subtitle2" className="mb-2 font-bold text-gray-700">Nombres Colaboradores Observación Seguridad</Typography>
                    <Box display="flex" gap={1} mb={2}>
                        <TextField size="small" fullWidth placeholder="Nombre colaborador" value={tempObsName} onChange={e => setTempObsName(e.target.value)}
                            onKeyDown={(e) => handleKeyDownParticipante(e, 'observaciones', tempObsName)}
                        />
                        <Button variant="contained" size="small" color="warning" onClick={() => addParticipante('observaciones', tempObsName)}><Plus/></Button>
                    </Box>
                    <Box className="flex flex-wrap gap-2">
                        {formData.participacion.observaciones.map((item) => (
                            <Chip key={item.id} label={item.nombre} onDelete={() => removeParticipante('observaciones', item.id)} color="warning" variant="outlined" icon={<UserPlus size={14}/>} />
                        ))}
                        {formData.participacion.observaciones.length === 0 && <span className="text-xs text-gray-400">Sin registros</span>}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
      </Paper>

      {/* BOTÓN FINAL */}
      <Button variant="contained" size="large" fullWidth startIcon={<Save />} type="submit" sx={{ py: 2, bgcolor: '#002D6F', fontSize: '1.1rem' }}>
        GUARDAR Y ENVIAR REPORTE
      </Button>

    </form>
  );
};