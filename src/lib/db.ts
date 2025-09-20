'use server';

import mysql, { FieldPacket, RowDataPacket } from 'mysql2/promise';
import dataNull from "./datanull.json";

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
};

function getTableNameFromQuery(query: string): keyof typeof dataNull | null {
    const match = query.match(/(?:FROM|INTO|UPDATE|DELETE\s+FROM)\s+`?(\w+)`?/i);
    if (match && match[1]) {
        return match[1] as keyof typeof dataNull;
    }
    return null;
}

export async function executeQuery<T>(query: string, values: any[] = []): Promise<T> {
    if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
        console.warn("Las variables de entorno de la base de datos no están totalmente configuradas.");
        const tableName = getTableNameFromQuery(query);
        if (tableName && tableName in dataNull) {
            return dataNull[tableName] as T;
        }
        return [] as T;
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(query, values);
        return results as T;
    } catch (error) {
        console.error("Error de consulta de base de datos:", error);
        const tableName = getTableNameFromQuery(query);
        if (tableName && tableName in dataNull) {
            console.log(`Error en la consulta de la tabla "${tableName}". Devuelve datos alternativos vacíos.`);
            return dataNull[tableName] as T;
        }
        return [] as T;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

/**
 * Ejecuta una consulta y devuelve tanto las filas de resultados como la información de los campos (columnas).
 * Esta versión es más robusta y maneja diferentes tipos de resultados de consulta.
 */
export async function executeQueryWithFields(query: string, values: any[] = []): Promise<[RowDataPacket[], FieldPacket[]]> {
    if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
        console.warn("Las variables de entorno de la base de datos no están configuradas.");
        return [[], []];
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results, fields] = await connection.execute(query, values);

        // Verificamos si los resultados son un array (como en un SELECT)
        if (Array.isArray(results)) {
            return [results as RowDataPacket[], fields as FieldPacket[]];
        }

        // Si no es un array (es un OkPacket de un INSERT, etc.), devolvemos un array vacío para las filas.
        return [[], fields as FieldPacket[]];

    } catch (error) {
        console.error("Error de consulta de base de datos:", error);
        return [[], []];
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
