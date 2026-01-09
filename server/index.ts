import express from 'express';
import cors from 'cors';
// Importamos 'sql' también para usar los tipos de datos (NVarChar, etc.)
import { getConnection, sql } from './config/db'; 

const app = express();
app.use(cors());
app.use(express.json());

// --- RUTA DE PRUEBA (La que ya tenías) ---
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool?.request().query('SELECT @@VERSION as version');
        res.json({ mensaje: 'Conexión exitosa', version: result?.recordset[0].version });
    } catch (error) {
        res.status(500).send(error);
    }
});

// ==========================================
// RUTAS MÓDULO ACERÍA
// ==========================================

// 1. Guardar Reporte (Llama al SP Maestro)
app.post('/api/aceria/reportes', async (req, res) => {
    try {
        const pool = await getConnection();
        const jsonData = JSON.stringify(req.body);

        // Ejecutamos el Stored Procedure
        const result = await pool?.request()
            .input('JsonData', sql.NVarChar(sql.MAX), jsonData)
            .execute('sp_Guardar_Reporte_Aceria');

        // El SP devuelve: { status: 'SUCCESS', reporte_id: X }
        res.json(result?.recordset[0]);
    } catch (error: any) {
        console.error('Error al guardar:', error);
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});

// 2. Obtener Historial (Tabla)
app.get('/api/aceria/reportes', async (req, res) => {
    try {
        const pool = await getConnection();
        // Consulta con JOINs para mostrar nombres en lugar de IDs
        const result = await pool?.request().query(`
            SELECT TOP 50 
                r.id, r.fecha_reporte as fecha, 
                t.nombre as turno,
                tec.nombre_completo as tecnico,
                area.clave as horno,
                (SELECT COUNT(*) FROM Bit_Global_Pendientes WHERE reporte_id = r.id) as pendientes,
                'Abierto' as estatus
            FROM Bit_Core_Reportes r
            LEFT JOIN Bit_Cat_Turnos t ON r.turno_id = t.id
            LEFT JOIN Bit_Cat_Tecnicos tec ON r.tecnico_id = tec.id
            LEFT JOIN Bit_Cat_AreasOperativas area ON r.area_operativa_id = area.id
            ORDER BY r.fecha_reporte DESC
        `);
        res.json(result?.recordset);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// 3. Obtener Catálogo de Técnicos (Filtrado por Área)
app.get('/api/aceria/catalogos/tecnicos', async (req, res) => {
    try {
        const area = req.query.area || 'HF1';
        const pool = await getConnection();
        
        const result = await pool?.request()
            .input('areaClave', sql.NVarChar(50), area)
            .query(`
                SELECT t.id, t.nombre_completo, t.area_operativa_id 
                FROM Bit_Cat_Tecnicos t
                JOIN Bit_Cat_AreasOperativas a ON t.area_operativa_id = a.id
                WHERE a.clave = @areaClave AND t.activo = 1
            `);
            
        res.json(result?.recordset);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// 4. Crear Nuevo Técnico (Botón +)
app.post('/api/aceria/catalogos/tecnicos', async (req, res) => {
    try {
        const { nombre_completo, area_clave } = req.body;
        const pool = await getConnection();

        const result = await pool?.request()
            .input('nombre', sql.NVarChar(255), nombre_completo)
            .input('clave', sql.NVarChar(50), area_clave)
            .query(`
                INSERT INTO Bit_Cat_Tecnicos (nombre_completo, area_operativa_id)
                SELECT @nombre, id FROM Bit_Cat_AreasOperativas WHERE clave = @clave;
                
                SELECT TOP 1 * FROM Bit_Cat_Tecnicos ORDER BY id DESC;
            `);

        res.json(result?.recordset[0]);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});

// 5. Obtener Catálogo de Turnos (NUEVO)
app.get('/api/aceria/catalogos/turnos', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool?.request().query(`
            SELECT id, nombre FROM Bit_Cat_Turnos WHERE activo = 1
        `);
        res.json(result?.recordset);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});