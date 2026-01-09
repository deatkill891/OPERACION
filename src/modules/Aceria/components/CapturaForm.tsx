import React, { useState, useEffect } from 'react';
import { 
  Paper, Grid, TextField, MenuItem, Button, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  IconButton, Typography, Box, RadioGroup, FormControlLabel, Radio, 
  CircularProgress, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { Plus, Trash2, Save, UserPlus } from 'lucide-react';

import type { ReporteDiario, Pendiente, TecnicoCatalogo } from '../types';
import { aceriaService } from '../services/aceriaService';

// Tipo simple para el turno cargado desde BD
interface TurnoCatalogo {
  id: number;
  nombre: string;
}

export const CapturaForm = () => {
  // --- ESTADOS DE UI ---
  const [isSaving, setIsSaving] = useState(false);
  
  // Catálogos cargados desde Base de Datos
  const [tecnicosDB, setTecnicosDB] = useState<TecnicoCatalogo[]>([]);
  const [turnosDB, setTurnosDB] = useState<TurnoCatalogo[]>([]);
  
  // Estados para el Modal de Nuevo Técnico
  const [showNewTechModal, setShowNewTechModal] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [isSavingTech, setIsSavingTech] = useState(false);

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState<ReporteDiario>({
    tecnico: '', 
    turno: '', 
    fecha: new Date().toISOString().split('T')[0],
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

  // --- EFECTO: CARGAR CATÁLOGOS ---
  const fetchCatalogos = async () => {
      // 1. Cargar Técnicos (depende del horno seleccionado)
      const dataTecnicos = await aceriaService.getTecnicosPorArea(formData.horno);
      setTecnicosDB(dataTecnicos);

      // 2. Cargar Turnos (solo si no se han cargado aún)
      if (turnosDB.length === 0) {
          const dataTurnos = await aceriaService.getTurnos();
          setTurnosDB(dataTurnos);
      }
  };

  useEffect(() => {
      // Limpiamos el técnico al cambiar de horno para evitar inconsistencias
      setFormData(prev => ({ ...prev, tecnico: '' }));
      fetchCatalogos();
  }, [formData.horno]);

  // --- HANDLER: GUARDAR NUEVO TÉCNICO (MODAL) ---
  const handleSaveNewTech = async () => {
      if (!newTechName.trim()) return;
      
      setIsSavingTech(true);
      const nuevoTecnico = await aceriaService.createTecnico(newTechName, formData.horno);
      setIsSavingTech(false);

      if (nuevoTecnico) {
          // Recargamos solo la lista de técnicos
          const dataTecnicos = await aceriaService.getTecnicosPorArea(formData.horno);
          setTecnicosDB(dataTecnicos);
          
          // Seleccionamos al nuevo técnico automáticamente
          setFormData(prev => ({ ...prev, tecnico: nuevoTecnico.nombre_completo }));
          
          // Cerramos modal
          setShowNewTechModal(false);
          setNewTechName('');
          alert(`✅ Técnico "${newTechName}" registrado en ${formData.horno}`);
      } else {
          alert("❌ Error al registrar técnico. Intente de nuevo.");
      }
  };

  // --- HANDLERS FORMULARIO ---
  const addPendiente = () => {
    const newPendiente: Pendiente = { id: crypto.randomUUID(), descripcion: '', fDeteccion: '', responsable: 'Operación', severidad: 'Baja', fCompromiso: '', comentarios: '', estatus: 'Pendiente' };
    setFormData(prev => ({ ...prev, pendientes: [...prev.pendientes, newPendiente] }));
  };
  const updatePendiente = (index: number, field: keyof Pendiente, value: unknown) => {
    const updated = [...formData.pendientes];
    updated[index] = { ...updated[index], [field]: value as any };
    setFormData(prev => ({ ...prev, pendientes: updated }));
  };
  const removePendiente = (index: number) => {
    setFormData(prev => ({ ...prev, pendientes: prev.pendientes.filter((_, i) => i !== index) }));
  };
  const addParticipante = (type: 'ideasA2' | 'observaciones') => {
    setFormData(prev => ({ ...prev, participacion: { ...prev.participacion, [type]: [...prev.participacion[type], { id: crypto.randomUUID(), nombre: '' }] } }));
  };
  const updateParticipante = (type: 'ideasA2' | 'observaciones', id: string, value: string) => {
    setFormData(prev => ({ ...prev, participacion: { ...prev.participacion, [type]: prev.participacion[type].map(p => p.id === id ? { ...p, nombre: value } : p) } }));
  };
  const removeParticipante = (type: 'ideasA2' | 'observaciones', idToRemove: string) => {
    setFormData(prev => ({ ...prev, participacion: { ...prev.participacion, [type]: prev.participacion[type].filter(p => p.id !== idToRemove) } }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tecnico || !formData.turno) { alert("⚠️ Selecciona Técnico y Turno."); return; }
    
    setIsSaving(true);
    try {
        // CORRECCIÓN SONARLINT: Eliminado "as any" innecesario
        const result = await aceriaService.saveReporte(formData);
        
        if (result?.status === 'SUCCESS') {
            alert(`✅ Reporte guardado. ID: ${result.reporte_id}`);
            // Opcional: Limpiar formulario aquí
        } else {
            alert("⚠️ Error: " + (result?.message || 'Desconocido'));
        }
    } catch (e: any) { 
        alert("❌ Error: " + e.message); 
    } finally { 
        setIsSaving(false); 
    }
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
            <Box display="flex" gap={1}>
                <TextField 
                    select fullWidth label="Técnico" 
                    value={formData.tecnico} 
                    onChange={e => setFormData({...formData, tecnico: e.target.value})}
                    disabled={tecnicosDB.length === 0}
                >
                    {tecnicosDB.map((t) => (
                        <MenuItem key={t.id} value={t.nombre_completo}>{t.nombre_completo}</MenuItem>
                    ))}
                    {tecnicosDB.length === 0 && <MenuItem disabled>Cargando...</MenuItem>}
                </TextField>
                <Button variant="contained" color="primary" sx={{ minWidth: '50px', height: '56px' }} onClick={() => setShowNewTechModal(true)} title="Nuevo Técnico">
                    <Plus />
                </Button>
            </Box>
          </Grid>

          {/* SELECTOR DE TURNO DINÁMICO */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField 
                select fullWidth label="Turno" 
                value={formData.turno} 
                onChange={e => setFormData({...formData, turno: e.target.value})}
                disabled={turnosDB.length === 0}
            >
                {turnosDB.map((t) => (
                    <MenuItem key={t.id} value={t.nombre}>{t.nombre}</MenuItem>
                ))}
                {turnosDB.length === 0 && <MenuItem disabled>Cargando turnos...</MenuItem>}
            </TextField>
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. PENDIENTES */}
      <Paper className="p-6 border-l-4 border-red-500 bg-red-50/10">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className="text-red-800 font-bold">2. Pendientes del Día</Typography>
            <Button startIcon={<Plus />} variant="outlined" color="error" size="small" onClick={addPendiente}>Añadir Pendiente</Button>
        </Box>
        <Table size="small">
          <TableHead className="bg-red-50">
            <TableRow>
                <TableCell>Pendiente</TableCell><TableCell>Responsable</TableCell><TableCell>Severidad</TableCell><TableCell>Comentarios</TableCell><TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.pendientes.map((p, idx) => (
              <TableRow key={p.id}>
                <TableCell><TextField fullWidth size="small" value={p.descripcion} onChange={e => updatePendiente(idx, 'descripcion', e.target.value)} /></TableCell>
                <TableCell>
                    <TextField select fullWidth size="small" value={p.responsable} onChange={e => updatePendiente(idx, 'responsable', e.target.value)}>
                        <MenuItem value="Operación">Operación</MenuItem><MenuItem value="Mecánico">Mecánico</MenuItem><MenuItem value="Eléctrico">Eléctrico</MenuItem><MenuItem value="Servicios">Servicios</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell>
                    <TextField select fullWidth size="small" value={p.severidad} onChange={e => updatePendiente(idx, 'severidad', e.target.value)}>
                        <MenuItem value="Alta">Alta</MenuItem><MenuItem value="Media">Media</MenuItem><MenuItem value="Baja">Baja</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell><TextField fullWidth size="small" value={p.comentarios} onChange={e => updatePendiente(idx, 'comentarios', e.target.value)} /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => removePendiente(idx)}><Trash2 size={16}/></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 3. SEGURIDAD */}
      <Paper className="p-6 border-l-4 border-yellow-500 bg-yellow-50/10">
        <Typography variant="h6" className="mb-4 text-yellow-800 font-bold">3. Plática de Seguridad</Typography>
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Tema Visto" value={formData.platicaSeguridad.tema} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, tema: e.target.value}})} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Impartida Por" value={formData.platicaSeguridad.impartidaPor} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, impartidaPor: e.target.value}})} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Puntos Relevantes" value={formData.platicaSeguridad.puntos} onChange={e => setFormData({...formData, platicaSeguridad: {...formData.platicaSeguridad, puntos: e.target.value}})} /></Grid>
        </Grid>
      </Paper>

      {/* 4. BITÁCORA */}
      <Paper className="p-6 border-l-4 border-green-500 bg-green-50/10">
        <Typography variant="h6" className="mb-4 text-green-800 font-bold">4. Bitácora Operativa</Typography>
        <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth multiline rows={4} label="Problemas Turno Anterior" value={formData.bitacora.problemasTurnoAnterior} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, problemasTurnoAnterior: e.target.value}})} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth multiline rows={4} label="Bitácora de Turno" value={formData.bitacora.accionesTurno} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, accionesTurno: e.target.value}})} /></Grid>
        </Grid>
        
        <Typography variant="subtitle2" className="mb-2 text-gray-500 font-bold">Control de Ollas</Typography>
        <Grid container spacing={2} className="mb-6">
             {formData.bitacora.ollas.map((olla, i) => (
                <Grid size={{ xs: 6, md: 2.4 }} key={olla.id}>
                    <Paper variant="outlined" className="p-2 bg-white">
                        <Typography variant="caption" className="block text-center font-bold">Olla {i+1}</Typography>
                        <TextField placeholder="No." size="small" fullWidth margin="dense" value={olla.noOlla} onChange={e => { const no = [...formData.bitacora.ollas]; no[i].noOlla=e.target.value; setFormData({...formData, bitacora: {...formData.bitacora, ollas: no}})}} />
                        <TextField placeholder="Coladas" size="small" fullWidth margin="dense" value={olla.coladas} onChange={e => { const no = [...formData.bitacora.ollas]; no[i].coladas=e.target.value; setFormData({...formData, bitacora: {...formData.bitacora, ollas: no}})}} />
                    </Paper>
                </Grid>
             ))}
        </Grid>
        
        <Box sx={{ my: 4, borderBottom: '1px solid #e0e0e0' }} />

        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" className="p-4 bg-white h-full">
                    <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700">Captura de Bobinas</Typography>
                    <Typography variant="caption" className="font-bold text-gray-500">Bobina 1</Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid size={{ xs: 6 }}><TextField label="Código" size="small" fullWidth value={formData.bitacora.bobina1.codigo} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina1: {...formData.bitacora.bobina1, codigo: e.target.value}}})} /></Grid>
                        <Grid size={{ xs: 6 }}><TextField label="Colada Entrada" size="small" fullWidth value={formData.bitacora.bobina1.colada} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina1: {...formData.bitacora.bobina1, colada: e.target.value}}})} /></Grid>
                    </Grid>
                    <Typography variant="caption" className="font-bold text-gray-500">Bobina 2</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}><TextField label="Código" size="small" fullWidth value={formData.bitacora.bobina2.codigo} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina2: {...formData.bitacora.bobina2, codigo: e.target.value}}})} /></Grid>
                        <Grid size={{ xs: 6 }}><TextField label="Colada Entrada" size="small" fullWidth value={formData.bitacora.bobina2.colada} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, bobina2: {...formData.bitacora.bobina2, colada: e.target.value}}})} /></Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                 <Paper variant="outlined" className="p-4 bg-white h-full">
                    <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700">Inventario y Lanza Activa</Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid size={{ xs: 6 }}><TextField label="Inv. Vesuvius" type="number" size="small" fullWidth value={formData.bitacora.lanzas.invVesuvius} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, lanzas: {...formData.bitacora.lanzas, invVesuvius: +e.target.value}}})} /></Grid>
                        <Grid size={{ xs: 6 }}><TextField label="Inv. Electronite" type="number" size="small" fullWidth value={formData.bitacora.lanzas.invElectronite} onChange={e => setFormData({...formData, bitacora: {...formData.bitacora, lanzas: {...formData.bitacora.lanzas, invElectronite: +e.target.value}}})} /></Grid>
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

      {/* 5. PARTICIPACIÓN */}
      <Paper className="p-6 border-l-4 border-blue-500 bg-blue-50/10">
        <Typography variant="h6" className="mb-4 text-blue-800 font-bold">5. Participación y Seguridad</Typography>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" justifyContent="space-between" mb={2}><Typography variant="subtitle2" className="font-bold">Ideas A2</Typography><Button startIcon={<Plus/>} size="small" variant="contained" onClick={() => addParticipante('ideasA2')}>Añadir</Button></Box>
                {formData.participacion.ideasA2.map(p => (
                    <Box key={p.id} display="flex" gap={1} mb={1}>
                        <TextField size="small" fullWidth value={p.nombre} onChange={e => updateParticipante('ideasA2', p.id, e.target.value)} placeholder="Colaborador" slotProps={{ input: { startAdornment: <InputAdornment position="start"><UserPlus size={16} className="text-gray-400"/></InputAdornment> } }} />
                        <IconButton size="small" color="error" onClick={() => removeParticipante('ideasA2', p.id)}><Trash2 size={16}/></IconButton>
                    </Box>
                ))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" justifyContent="space-between" mb={2}><Typography variant="subtitle2" className="font-bold">Observaciones</Typography><Button startIcon={<Plus/>} size="small" variant="contained" color="warning" onClick={() => addParticipante('observaciones')}>Añadir</Button></Box>
                {formData.participacion.observaciones.map(p => (
                    <Box key={p.id} display="flex" gap={1} mb={1}>
                        <TextField size="small" fullWidth value={p.nombre} onChange={e => updateParticipante('observaciones', p.id, e.target.value)} placeholder="Colaborador" slotProps={{ input: { startAdornment: <InputAdornment position="start"><UserPlus size={16} className="text-gray-400"/></InputAdornment> } }} />
                        <IconButton size="small" color="error" onClick={() => removeParticipante('observaciones', p.id)}><Trash2 size={16}/></IconButton>
                    </Box>
                ))}
            </Grid>
        </Grid>
      </Paper>

      <Button variant="contained" size="large" fullWidth startIcon={isSaving ? <CircularProgress size={24} color="inherit"/> : <Save />} type="submit" disabled={isSaving} sx={{ py: 2, bgcolor: '#002D6F', fontSize: '1.1rem' }}>
        {isSaving ? 'GUARDANDO EN BASE DE DATOS...' : 'GUARDAR Y ENVIAR REPORTE'}
      </Button>

      {/* --- MODAL PARA REGISTRAR NUEVO TÉCNICO --- */}
      <Dialog open={showNewTechModal} onClose={() => setShowNewTechModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="bg-indigo-50 text-indigo-900 font-bold border-b">Registrar Nuevo Técnico en {formData.horno}</DialogTitle>
          <DialogContent className="pt-6">
              <Typography variant="body2" className="mb-4 text-gray-600 mt-4">El técnico se guardará en el catálogo del área <strong>{formData.horno}</strong> y aparecerá disponible inmediatamente.</Typography>
              <TextField autoFocus fullWidth label="Nombre Completo del Técnico" variant="outlined" value={newTechName} onChange={(e) => setNewTechName(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><UserPlus size={20} className="text-gray-400"/></InputAdornment> } }} />
          </DialogContent>
          <DialogActions className="p-4 border-t bg-gray-50">
              <Button onClick={() => setShowNewTechModal(false)} color="inherit">Cancelar</Button>
              <Button onClick={handleSaveNewTech} variant="contained" color="primary" disabled={!newTechName.trim() || isSavingTech} startIcon={isSavingTech ? <CircularProgress size={16} color="inherit"/> : <Save size={18}/>}>
                  {isSavingTech ? 'Guardando...' : 'Registrar Técnico'}
              </Button>
          </DialogActions>
      </Dialog>

    </form>
  );
};