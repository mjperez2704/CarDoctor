// src/app/(protected)/employees/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface Employee extends RowDataPacket {
    id: number;
    nombre: string;
    apellido_p: string;
    email: string | null;
    puesto: string | null;
    activo: boolean; // Se añade el estado
}

export async function getEmployees(): Promise<Employee[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Employee[]>(`
            SELECT id, nombre, apellido_p, email, puesto, activo FROM empleados ORDER BY nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const employeeSchema = z.object({
    id: z.string().optional(), // ID opcional para la edición
    nombre: z.string().min(2, "El nombre es requerido."),
    apellido_p: z.string().min(2, "El apellido es requerido."),
    email: z.string().email("El email no es válido.").optional().or(z.literal('')),
    puesto: z.string().optional(),
});

export async function saveEmployee(prevState: any, formData: FormData) {
    const validatedFields = employeeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos." };
    }
    const { id, nombre, apellido_p, email, puesto } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            // Lógica de ACTUALIZACIÓN
            await db.query(
                'UPDATE empleados SET nombre = ?, apellido_p = ?, email = ?, puesto = ? WHERE id = ?',
                [nombre, apellido_p, email || null, puesto || null, id]
            );
            revalidatePath('/employees');
            return { success: true, message: 'Empleado actualizado exitosamente.' };
        } else {
            // Lógica de CREACIÓN
            await db.query(
                'INSERT INTO empleados (nombre, apellido_p, email, puesto, activo) VALUES (?, ?, ?, ?, 1)',
                [nombre, apellido_p, email || null, puesto || null]
            );
            revalidatePath('/employees');
            return { success: true, message: 'Empleado creado exitosamente.' };
        }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un empleado con ese email.' };
        }
        return { success: false, message: 'Error al guardar el empleado.' };
    } finally {
        if (db) db.release();
    }
}

export async function toggleEmployeeStatus(employeeId: number, currentStatus: boolean) {
    if (!employeeId) {
        return { success: false, message: "ID de empleado no válido." };
    }
    let db;
    try {
        db = await pool.getConnection();
        const newStatus = !currentStatus;
        await db.query('UPDATE empleados SET activo = ? WHERE id = ?', [newStatus, employeeId]);
        revalidatePath('/employees');
        return { success: true, message: `Empleado ${newStatus ? 'activado' : 'desactivado'} correctamente.` };
    } catch (error) {
        console.error('Error toggling employee status:', error);
        return { success: false, message: 'Error al cambiar el estado del empleado.' };
    } finally {
        if (db) db.release();
    }
}
