// src/app/(protected)/internal/log/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// Definimos la estructura de una entrada de la bitácora
export interface LogEntry extends RowDataPacket {
    id: number;
    fecha: string;
    usuario_id: number;
    usuario_nombre: string; // Nombre del usuario que realizó la acción
    accion: string;
    descripcion: string;
    modulo: string | null;
}

// Acción para obtener todas las entradas de la bitácora
export async function getLogEntries(): Promise<LogEntry[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<LogEntry[]>(`
            SELECT
                b.id,
                b.fecha,
                b.usuario_id,
                u.nombre as usuario_nombre,
                b.accion,
                b.descripcion,
                b.modulo
            FROM bitacora b
                     JOIN usuarios u ON b.usuario_id = u.id
            ORDER BY b.fecha DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching log entries:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
