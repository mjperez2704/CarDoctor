// src/lib/db.ts
import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
// Lee las variables de entorno o usa valores predeterminados
const dbConfig = {
  host: process.env.DB_HOST || '195.250.27.25',
  user: process.env.DB_USER || 'megaspots_taller',
  password: process.env.DB_PASSWORD || 'megaspots_taller',
  database: process.env.DB_NAME || 'megaspots_taller',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
};

// Crear un pool de conexiones para reutilizar conexiones
// y mejorar el rendimiento.
const pool = mysql.createPool(dbConfig);

export default pool;
