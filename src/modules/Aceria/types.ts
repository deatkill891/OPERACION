/**
 * @file types.ts
 * @author Dnavarro
 * @description Definiciones de tipos TypeScript para el módulo de Acería.
 * Alineado con el esquema JSON del SP [dbo].[sp_Guardar_Reporte_Aceria].
 */

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
  id: string;
  noOlla: string;
  coladas: string;
}

export interface Participante {
  id: string;
  nombre: string;
}

export interface ReporteDiario {
  id?: string;
  tecnico: string; // Nombre completo (o ID si el backend lo requiere)
  turno: string;   // 'A', 'B', 'C'
  fecha: string;   // YYYY-MM-DD
  horno: 'HF1' | 'HF2';
  
  // Estructura coincidente con JSON_VALUE(..., '$.pendientes')
  pendientes: Pendiente[];
  
  // Estructura coincidente con JSON_VALUE(..., '$.platicaSeguridad')
  platicaSeguridad: {
    tema: string;
    impartidaPor: string;
    puntos: string;
  };
  
  // Estructura coincidente con JSON_VALUE(..., '$.bitacora')
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
  
  // Estructura coincidente con JSON_VALUE(..., '$.participacion')
  participacion: {
    ideasA2: Participante[];
    observaciones: Participante[];
  };
}

export interface TecnicoCatalogo {
    id: number;
    nombre_completo: string;
    area_operativa_id: number;
}