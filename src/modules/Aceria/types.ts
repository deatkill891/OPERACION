export interface Pendiente {
  id: string;
  descripcion: string;
  fDeteccion: string;
  responsable: 'Operación' | 'Mecánico' | 'Eléctrico' | 'Servicios';
  severidad: 'Baja' | 'Media' | 'Alta';
  fCompromiso: string;
  comentarios: string;
  estatus: 'Pendiente' | 'En Proceso' | 'Terminado';
}

export interface Olla {
  id?: string;
  noOlla: string;
  coladas: string;
}

export interface Participante {
  id: string;
  nombre: string;
}

export interface ReporteDiario {
  id?: string;
  tecnico: string;
  turno: string;
  fecha: string;
  horno: 'HF1' | 'HF2';
  pendientes: Pendiente[];
  platicaSeguridad: {
    tema: string;
    impartidaPor: string;
    puntos: string;
  };
  bitacora: {
    problemasTurnoAnterior: string;
    accionesTurno: string;
    ollas: Olla[];
    bobina1: { codigo: string; colada: string };
    bobina2: { codigo: string; colada: string };
    lanzas: {
      invVesuvius: number;
      invElectronite: number;
      funcionando: 'Vesuvius' | 'Electronite';
    };
  };
  participacion: {
    ideasA2: Participante[];        // CAMBIO: Ahora es objeto
    observaciones: Participante[];  // CAMBIO: Ahora es objeto
  };
}