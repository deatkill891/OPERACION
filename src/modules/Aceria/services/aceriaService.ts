import type { ReporteDiario, TecnicoCatalogo } from "../types";

// Apuntamos al backend en el puerto 3000 (Node.js)
// Si configuraste VITE_API_URL en tu .env, lo usará; si no, usa localhost:3000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/aceria'; 

export const aceriaService = {
    
    /**
     * Envía el reporte completo al backend.
     */
    saveReporte: async (reporte: ReporteDiario) => {
        try {
            const response = await fetch(`${API_URL}/reportes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reporte) // <--- Aquí usamos la variable 'reporte'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar reporte');
            }
            
            return await response.json();
        } catch (error) {
            console.error("[Service] Error en saveReporte:", error);
            throw error;
        }
    },

    /**
     * Obtiene el historial de reportes aplicando filtros.
     */
    getReportes: async (filtros: any) => {
        try {
            // Limpiamos filtros vacíos antes de enviarlos
            const filtrosLimpios = Object.fromEntries(
                Object.entries(filtros).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );
            
            const params = new URLSearchParams(filtrosLimpios as any).toString(); // <--- Aquí usamos 'filtros'
            
            const response = await fetch(`${API_URL}/reportes?${params}`);
            
            if (!response.ok) throw new Error('Error al obtener historial');
            return await response.json();
        } catch (error) {
            console.error("[Service] Error en getReportes:", error);
            return []; // Retorna vacío para no romper la UI
        }
    },

    /**
     * Carga el catálogo de técnicos filtrado por área.
     */
    getTecnicosPorArea: async (areaClave: string): Promise<TecnicoCatalogo[]> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/tecnicos?area=${areaClave}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.warn("[Service] Fallo carga de técnicos.", error);
            return [];
        }
    },

    /**
     * Registra un nuevo técnico en la base de datos (Ventana Flotante).
     */
    createTecnico: async (nombre: string, areaClave: string): Promise<TecnicoCatalogo | null> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/tecnicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_completo: nombre, area_clave: areaClave })
            });

            if (!response.ok) throw new Error("Error al crear técnico");
            return await response.json(); // Retorna el técnico creado
        } catch (error) {
            console.error("[Service] Error creando técnico:", error);
            return null;
        }
    },
  
    getTurnos: async (): Promise<{ id: number; nombre: string }[]> => {
        try {
            const response = await fetch(`${API_URL}/catalogos/turnos`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.warn("[Service] Fallo carga de turnos.", error);
            return [];
        }
    },
    
};