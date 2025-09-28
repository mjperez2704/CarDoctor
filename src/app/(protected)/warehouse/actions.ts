// src/app/(protected)/warehouse/actions.ts
"use server";

import pool from '@/lib/db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

// --- Esquemas de Validación ---
const warehouseSchema = z.object({
    id: z.string().optional(),
    nombre: z.string().min(3, "El nombre es requerido."),
    clave: z.string().min(1, "La clave es requerida."),
    tipo: z.enum(["PRINCIPAL", "SUCURSAL", "BODEGA", "TRANSITO"]),
});

const sectionSchema = z.object({
    id: z.string().optional(),
    nombre: z.string().min(3, "El nombre es requerido."),
    clave: z.string().min(1, "La clave es requerida."),
    almacen_id: z.coerce.number().min(1, "El almacén es requerido."),
});

// --- Acciones para Almacenes ---
export async function saveWarehouse(prevState: any, formData: FormData) {
    const validatedFields = warehouseSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos." };
    }
    const { id, nombre, clave, tipo } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            await db.query('UPDATE almacenes SET nombre = ?, clave = ?, tipo = ? WHERE id = ?', [nombre, clave, tipo, id]);
        } else {
            await db.query('INSERT INTO almacenes (nombre, clave, tipo) VALUES (?, ?, ?)', [nombre, clave, tipo]);
        }
        revalidatePath('/warehouse');
        return { success: true, message: `Almacén ${id ? 'actualizado' : 'creado'} con éxito.` };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') return { success: false, message: 'La clave de almacén ya existe.' };
        return { success: false, message: 'Error al guardar el almacén.' };
    } finally {
        if (db) db.release();
    }
}

export async function deleteWarehouse(warehouseId: number) {
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();
        // Primero eliminar las secciones asociadas
        await db.query('DELETE FROM secciones WHERE almacen_id = ?', [warehouseId]);
        await db.query('DELETE FROM almacenes WHERE id = ?', [warehouseId]);
        await db.commit();
        revalidatePath('/warehouse');
        return { success: true, message: 'Almacén eliminado con éxito.' };
    } catch (error: any) {
        if (db) await db.rollback();
        if (error.code === 'ER_ROW_IS_REFERENCED_2') return { success: false, message: 'No se puede eliminar, el almacén tiene lotes con stock.' };
        return { success: false, message: 'Error al eliminar el almacén.' };
    } finally {
        if (db) db.release();
    }
}

// --- Acciones para Secciones ---
export async function saveSection(prevState: any, formData: FormData) {
    const validatedFields = sectionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos." };
    }
    const { id, nombre, clave, almacen_id } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            await db.query('UPDATE secciones SET nombre = ?, clave = ? WHERE id = ?', [nombre, clave, id]);
        } else {
            await db.query('INSERT INTO secciones (nombre, clave, almacen_id) VALUES (?, ?, ?)', [nombre, clave, almacen_id]);
        }
        revalidatePath('/warehouse');
        return { success: true, message: `Sección ${id ? 'actualizada' : 'creada'} con éxito.` };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') return { success: false, message: 'La clave de sección ya existe en este almacén.' };
        return { success: false, message: 'Error al guardar la sección.' };
    } finally {
        if (db) db.release();
    }
}

export async function deleteSection(sectionId: number) {
    let db;
    try {
        db = await pool.getConnection();
        await db.query('DELETE FROM secciones WHERE id = ?', [sectionId]);
        revalidatePath('/warehouse');
        return { success: true, message: 'Sección eliminada con éxito.' };
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') return { success: false, message: 'No se puede eliminar, la sección tiene lotes con stock.' };
        return { success: false, message: 'Error al eliminar la sección.' };
    } finally {
        if (db) db.release();
    }
}
