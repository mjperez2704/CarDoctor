// src/lib/db.ts
import mysql from 'mysql2/promise';

// Configura los datos de conexión con tus credenciales de MariaDB
const pool = mysql.createPool({
    host: '195.250.27.25', // O la IP de tu servidor de base de datos
    user: 'cardoctor_user', // Tu usuario de la base de datos
    password: 'GAOE560718qq6@', // Tu contraseña
    database: 'cardoctor_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
