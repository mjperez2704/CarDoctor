// src/app/(protected)/sales/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export interface Sale extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_nombre: string;
    total: number;
    metodo_pago: string;
    tipo_venta: 'TPV' | 'Servicio';
}

export async function getSalesHistory(): Promise<Sale[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Sale[]>(`
            SELECT 
                v.id,
                v.folio,
                v.fecha,
                c.razon_social AS cliente_nombre,
                v.total,
                v.metodo_pago,
                CASE 
                    WHEN v.id IS NOT NULL THEN 'Servicio'
                    ELSE 'TPV'
                END AS tipo_venta
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            ORDER BY v.fecha DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching sales history:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
