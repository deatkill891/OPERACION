import express from 'express';
import cors from 'cors';
import { getConnection } from './config/db.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar conexión
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await getConnection();
        // Hacemos una consulta simple para ver la versión de SQL Server
        const result = await pool?.request().query('SELECT @@VERSION as version');
        res.json({
            mensaje: 'Conexión exitosa',
            version: result?.recordset[0].version
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});