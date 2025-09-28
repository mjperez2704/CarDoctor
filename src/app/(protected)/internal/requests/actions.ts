// src/app/(protected)/internal/requests/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// Definimos la estructura de los datos para la tabla de solicitudes
export interface InternalRequest extends RowDataPacket {
    id: number;
    folio: string;
    solicitante_id: number;
    solicitante_nombre: string; // Nombre del empleado que solicita
    fecha_solicitud: string;
    tipo: "COMPRA" | "GASTO" | "VACACIONES" | "PERMISO" | "OTRO";
    descripcion: string;
    estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA";
    monto: number | null;
}

// Acción para obtener todas las solicitudes internas
export async function getInternalRequests(): Promise<InternalRequest[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<InternalRequest[]>(`
            SELECT 
                si.id,
                si.folio,
                si.solicitante_id,
                CONCAT(e.nombre, ' ', e.apellido_p) as solicitante_nombre,
                si.fecha_solicitud,
                si.tipo,
                si.descripcion,
                si.estado,
                si.monto
            FROM solicitudes_internas si
            JOIN empleados e ON si.solicitante_id = e.id
            ORDER BY si.fecha_solicitud DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching internal requests:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
