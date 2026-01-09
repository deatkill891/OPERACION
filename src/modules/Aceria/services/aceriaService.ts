import type { ReporteDiario, TecnicoCatalogo } from "../types";

// Apuntamos al backend (puerto 3000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/aceria'; 

export const aceriaService = {
    
    // Guardar Reporte
    saveReporte: async (reporte: ReporteDiario) => {
        try {
            const response = await fetch(`${API_URL}/reportes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reporte)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar reporte');
            }
            return await response.json();
        } catch (error) {
            // CORRECCIÓN: Logueamos el error antes de lanzarlo
            console.error("[Service] Error crítico en saveReporte:", error);
            throw error;
        }
    },

    // Obtener Historial
    getReportes: async (filtros: any) => {
        try {
             // Limpiar filtros vacíos
            const filtrosLimpios = Object.fromEntries(
                Object.entries(filtros).filter(([_, v]) => v !== '' && v !== null)
            );
            const params = new URLSearchParams(filtrosLimpios as any).toString();
            
            const response = await fetch(`${API_URL}/reportes?${params}`);
            if (!response.ok) throw new Error('Error al obtener historial');
            return await response.json();
        } catch (error) {
            // CORRECCIÓN: Manejo del error
            console.error("[Service] Fallo al obtener reportes:", error);
            return []; // Retornamos array vacío para no romper la tabla
        }
    },

    // Obtener Técnicos
    getTecnicosPorArea: async (areaClave: string): Promise<TecnicoCatalogo[]> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/tecnicos?area=${areaClave}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            // CORRECCIÓN: Manejo del error
            console.error(`[Service] Fallo al cargar técnicos para ${areaClave}:`, error);
            return [];
        }
    },

    // Crear Nuevo Técnico
    createTecnico: async (nombre: string, areaClave: string): Promise<TecnicoCatalogo | null> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/tecnicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_completo: nombre, area_clave: areaClave })
            });

            if (!response.ok) throw new Error("Error al crear técnico");
            return await response.json();
        } catch (error) {
            // CORRECCIÓN: Manejo del error
            console.error("[Service] Error al crear nuevo técnico:", error);
            return null;
        }
    },

    // Obtener Turnos
    getTurnos: async (): Promise<{ id: number; nombre: string }[]> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/turnos`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            // CORRECCIÓN: Manejo del error
            console.error("[Service] Fallo al cargar catálogo de turnos:", error);
            return [];
        }
    },
};