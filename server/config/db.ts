import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbSettings: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true, // Importante para desarrollo local
    },
};

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log('✅ Conexión exitosa a SQL Server');
        return pool;
    } catch (error) {
        console.error('❌ Error conectando a la BD:', error);
    }
};

export { sql };