// src/app/(protected)/vendedores/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// Definimos la estructura de los datos para la tabla de vendedores
export interface Seller extends RowDataPacket {
    id: number;
    nombre: string;
    apellido_p: string;
    email: string | null;
    slug_vendedor: string | null;
    meta_venta_mensual: number | null;
}

// Acción para obtener solo los empleados que son vendedores
export async function getSellers(): Promise<Seller[]> {
    let db;
    try {
        db = await pool.getConnection();
        // Filtramos a los empleados que tienen un puesto relacionado con ventas
        const [rows] = await db.query<Seller[]>(`
            SELECT 
                id,
                nombre,
                apellido_p,
                email,
                slug_vendedor,
                meta_venta_mensual
            FROM empleados
            WHERE puesto LIKE '%Ventas%' OR puesto LIKE '%Vendedor%'
            ORDER BY nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching sellers:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
