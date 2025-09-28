// src/app/(protected)/catalogs/tools/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface Tool extends RowDataPacket {
    id: number;
    sku: string;
    nombre: string;
    descripcion: string | null;
    marca: string | null;
    modelo: string | null;
    numero_serie: string | null;
    estado: "DISPONIBLE" | "ASIGNADA" | "EN_MANTENIMIENTO" | "DE_BAJA";
    asignada_a_empleado_id: number | null;
    fecha_compra: string | null;
    costo: number | null;
    asignada_a_nombre: string | null;
}

export async function getTools(): Promise<Tool[]> {
    let db;
    try {
        db = await pool.getConnection();
        // Se filtra para no mostrar herramientas dadas de baja en la lista principal
        const [rows] = await db.query<Tool[]>(`
            SELECT
                h.*,
                CONCAT(e.nombre, ' ', e.apellido_p) as asignada_a_nombre
            FROM herramientas h
                     LEFT JOIN empleados e ON h.asignada_a_empleado_id = e.id
            WHERE h.estado != 'DE_BAJA'
            ORDER BY h.nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching tools:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const toolSchema = z.object({
    id: z.string().optional(),
    sku: z.string().min(1, "El SKU es requerido."),
    nombre: z.string().min(1, "El nombre es requerido."),
    descripcion: z.string().optional(),
    marca: z.string().optional(),
    modelo: z.string().optional(),
    numero_serie: z.string().optional(),
    fecha_compra: z.date().optional(),
    costo: z.coerce.number().min(0).optional(),
});

export async function saveTool(prevState: any, formData: FormData) {
    const validatedFields = toolSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }
    const { id, sku, nombre, descripcion, marca, modelo, numero_serie, fecha_compra, costo } = validatedFields.data;
    const fechaSQL = fecha_compra ? fecha_compra.toISOString().slice(0, 10) : null;

    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            await db.query(
                `UPDATE herramientas SET sku = ?, nombre = ?, descripcion = ?, marca = ?, modelo = ?, numero_serie = ?, fecha_compra = ?, costo = ? WHERE id = ?`,
                [sku, nombre, descripcion, marca, modelo, numero_serie, fechaSQL, costo, id]
            );
        } else {
            await db.query(
                `INSERT INTO herramientas (sku, nombre, descripcion, marca, modelo, numero_serie, fecha_compra, costo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DISPONIBLE')`,
                [sku, nombre, descripcion, marca, modelo, numero_serie, fechaSQL, costo]
            );
        }
        revalidatePath('/catalogs/tools');
        return { success: true, message: `Herramienta ${id ? 'actualizada' : 'creada'} exitosamente.` };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe una herramienta con ese SKU o Número de Serie.' };
        }
        console.error("Error saving tool:", error);
        return { success: false, message: 'Error al guardar la herramienta.' };
    } finally {
        if (db) db.release();
    }
}

export async function updateToolStatus(toolId: number, newStatus: Tool['estado'], employeeId?: number | null) {
    let db;
    try {
        db = await pool.getConnection();
        // Si el nuevo estado no es "ASIGNADA", nos aseguramos que no quede ningún técnico asignado.
        const finalEmployeeId = newStatus === 'ASIGNADA' ? employeeId : null;

        await db.query(
            'UPDATE herramientas SET estado = ?, asignada_a_empleado_id = ? WHERE id = ?',
            [newStatus, finalEmployeeId, toolId]
        );
        revalidatePath('/catalogs/tools');
        return { success: true, message: 'Estado de la herramienta actualizado.' };
    } catch (error) {
        console.error("Error updating tool status:", error);
        return { success: false, message: 'No se pudo actualizar el estado.' };
    } finally {
        if (db) db.release();
    }
}
