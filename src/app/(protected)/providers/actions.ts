// src/app/(protected)/providers/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import * as z from "zod";
import { revalidatePath } from "next/cache";

export interface Provider extends RowDataPacket {
    id: number;
    razon_social: string;
    rfc: string | null;
    email: string | null;
    telefono: string | null;
    dias_credito: number | null;
}

export async function getProviders(): Promise<Provider[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Provider[]>(`
            SELECT id, razon_social, rfc, email, telefono, dias_credito
            FROM proveedores
            ORDER BY razon_social ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const providerSchema = z.object({
    id: z.string().optional(), // El ID es opcional, solo presente en edición
    razon_social: z.string().min(3, "La razón social es requerida."),
    rfc: z.string().optional(),
    email: z.string().email("El email no es válido.").optional().or(z.literal('')),
    telefono: z.string().optional(),
    dias_credito: z.coerce.number().int().min(0).default(0),
});

export async function saveProvider(prevState: any, formData: FormData) {
    const validatedFields = providerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, razon_social, rfc, email, telefono, dias_credito } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            await db.query(
                'UPDATE proveedores SET razon_social = ?, rfc = ?, email = ?, telefono = ?, dias_credito = ? WHERE id = ?',
                [razon_social, rfc || null, email || null, telefono || null, dias_credito, id]
            );
            revalidatePath('/providers');
            return { success: true, message: 'Proveedor actualizado exitosamente.' };
        } else {
            await db.query(
                'INSERT INTO proveedores (razon_social, rfc, email, telefono, dias_credito) VALUES (?, ?, ?, ?, ?)',
                [razon_social, rfc || null, email || null, telefono || null, dias_credito]
            );
            revalidatePath('/providers');
            return { success: true, message: 'Proveedor creado exitosamente.' };
        }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un proveedor con ese RFC.' };
        }
        return { success: false, message: 'Error al guardar el proveedor.' };
    } finally {
        if (db) db.release();
    }
}

export async function deleteProvider(providerId: number) {
    if (!providerId) {
        return { success: false, message: "ID de proveedor no válido." };
    }
    let db;
    try {
        db = await pool.getConnection();
        // NOTA: Se asume que no hay restricciones de clave foránea directas
        // Si las hubiera (ej. en órdenes de compra), se necesitaría una lógica más compleja.
        await db.query('DELETE FROM proveedores WHERE id = ?', [providerId]);
        revalidatePath('/providers');
        return { success: true, message: 'Proveedor eliminado exitosamente.' };
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return { success: false, message: 'No se puede eliminar, el proveedor tiene órdenes de compra asociadas.' };
        }
        return { success: false, message: 'Error al eliminar el proveedor.' };
    } finally {
        if (db) db.release();
    }
}
