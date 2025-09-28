// src/app/(protected)/reports/predetermined/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// Definimos la estructura de los datos para el formulario de reportes
export interface ProductForReport extends RowDataPacket {
    id: number;
    sku: string;
    nombre: string;
}

// Acción para obtener todos los productos para los selectores de reportes
export async function getProductsForReports(): Promise<ProductForReport[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<ProductForReport[]>(`
            SELECT 
                id,
                sku,
                nombre
            FROM productos
            WHERE activo = 1
            ORDER BY nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching products for reports:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
