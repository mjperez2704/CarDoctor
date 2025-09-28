'use server';

import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export type Expense = {
    id: number;
    fecha: string;
    categoria: string;
    descripcion: string;
    empleado_id: number;
    empleado_nombre: string; // This will come from a JOIN
    estado: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
    monto: number;
};

export type Empleado = {
    id: number;
    nombre: string;
};

export async function getExpenses(): Promise<Expense[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                g.id, 
                g.fecha, 
                g.categoria, 
                g.descripcion, 
                g.monto, 
                g.estado, 
                g.empleado_id, 
                CONCAT(e.nombre, ' ', e.apellido_p) as empleado_nombre
            FROM gastos g
            JOIN empleados e ON g.empleado_id = e.id
            ORDER BY g.fecha DESC;
        `);
        return (rows as any[]).map((row: any) => ({
            ...row,
            fecha: new Date(row.fecha).toISOString().split('T')[0],
            monto: Number(row.monto),
        }));
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getEmpleados(): Promise<Empleado[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT id, CONCAT(nombre, ' ', apellido_p) as nombre 
            FROM empleados 
            WHERE activo = 1 
            ORDER BY nombre;
        `);
        return rows as Empleado[];
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function createExpense(data: {
    fecha: string;
    categoria: string;
    descripcion: string;
    monto: number;
    empleado_id: number;
}) {
    console.log('Creating new expense with data:', data);
    let db;
    try {
        db = await pool.getConnection();
        await db.query(
            `INSERT INTO gastos (fecha, categoria, descripcion, monto, empleado_id, estado) 
             VALUES (?, ?, ?, ?, ?, 'PENDIENTE');`,
            [data.fecha, data.categoria, data.descripcion, data.monto, data.empleado_id]
        );

        revalidatePath('/finances/expenses');

        return { success: true, message: 'Gasto creado exitosamente.' };
    } catch (error) {
        console.error('Error creating expense:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Error al crear el gasto: ${errorMessage}` };
    } finally {
        if (db) db.release();
    }
}
