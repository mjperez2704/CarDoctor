// src/app/(protected)/catalogs/vehicles/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export interface VehicleInService extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    equipo_id: number;
    diagnostico_ini: string | null;
    estado: string;
    clientName: string;
    vehicleIdentifier: string;
    imagen_url: string | null;
}

export async function getVehiclesInService(): Promise<VehicleInService[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<VehicleInService[]>(`
            SELECT
                os.id,
                os.folio,
                os.fecha_creacion,
                os.cliente_id,
                os.vehiculo_id,
                os.diagnostico_ini,
                os.estado,
                c.razon_social as clientName,
                CONCAT(m.nombre, ' ', mo.nombre, ' ', v.anio, ' (', v.placas, ')') as vehicleIdentifier,
                v.imagen_url
            FROM ordenes_servicio os
                     JOIN clientes c ON os.cliente_id = c.id
                -- SOLUCIÓN: Se cambió el JOIN para usar vehiculo_id en lugar de equipo_id
                     JOIN vehiculos v ON os.vehiculo_id = v.id
                     LEFT JOIN marcas m ON v.marca_id = m.id
                     LEFT JOIN modelos mo ON v.modelo_id = mo.id
            WHERE os.estado NOT IN ('ENTREGADO', 'CANCELADO')
            ORDER BY os.fecha_creacion ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching vehicles in service:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
