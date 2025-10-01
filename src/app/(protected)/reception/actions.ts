// src/app/(protected)/reception/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Estructura de una Recepción que se lista en la tabla principal
export interface Reception extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string; // El frontend espera 'fecha'
    cliente_id?: number;
    cliente_razon_social: string; // El frontend espera 'cliente_razon_social'
    vehiculo_id?: number;
    vehiculo_descripcion: string;
    diagnostico_ini: string;
    kilometraje?: number;
    estado: string;
    checklist_data?: Record<string, boolean>;
}

// Acción para OBTENER todas las recepciones (CORREGIDA)
export async function getReceptions(): Promise<Reception[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(
           `SELECT 
                os.id, 
                os.folio, 
                os.fecha_creacion as fecha,
                c.razon_social as cliente_razon_social,
                CONCAT(mar.nombre, ' ', model.nombre, ' ', v.anio) as vehiculo_descripcion, 
                os.diagnostico_ini,
                os.estado,
                os.kilometraje,
                inv.checklist_data
            FROM ordenes_servicio os
            JOIN clientes c ON os.cliente_id = c.id
            JOIN vehiculos v ON os.vehiculo_id = v.id
            JOIN marcas mar ON v.marca_id = mar.id
            JOIN modelos model ON v.modelo_id =  model.id 
            LEFT JOIN inventario_orden_servicio inv ON os.id = inv.orden_servicio_id
            ORDER BY os.fecha_creacion DESC`
        );
        
        return rows.map((row: any) => ({
            ...row,
            checklist_data: row.checklist_data && typeof row.checklist_data === 'string' 
                ? JSON.parse(row.checklist_data) 
                : (row.checklist_data || {}),
        }));

    } catch (error) {
        console.error('Error fetching receptions:', error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// El resto del archivo permanece sin cambios...
const receptionSchema = z.object({
    clientId: z.coerce.number().min(1, 'El cliente es obligatorio.'),
    vehicleId: z.coerce.number().min(1, 'El vehículo es obligatorio.'),
    mileage: z.coerce.number().optional(),
    serviceReason: z.string().min(5, 'El motivo del servicio debe tener al menos 5 caracteres.'),
    fuelLevel: z.coerce.number(),
}).passthrough();

async function saveChecklistData(db: any, orderId: number, formData: FormData) {
    const checklistData: Record<string, boolean> = {};
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('checklist_')) {
            checklistData[key.replace('checklist_', '')] = value === 'on';
        }
    }

    if (Object.keys(checklistData).length > 0) {
        await db.query(
            `INSERT INTO inventario_orden_servicio (orden_servicio_id, checklist_data)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE checklist_data = VALUES(checklist_data)`,
            [orderId, JSON.stringify(checklistData)]
        );
    }
}

export async function createReceptionAndWorkOrder(prevState: any, formData: FormData) {
    const validatedFields = receptionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Datos inválidos. Por favor, revise el formulario.' };
    }

    const { clientId, vehicleId, serviceReason, mileage } = validatedFields.data;
    const folio = `OS-${Date.now()}`.substring(0, 15);

    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        const [result] = await db.query(
            `INSERT INTO ordenes_servicio (folio, fecha_creacion, cliente_id, vehiculo_id, diagnostico_ini, kilometraje, estado)
             VALUES (?, NOW(), ?, ?, ?, ?, 'RECEPCION')`,
            [folio, clientId, vehicleId, serviceReason, mileage || null]
        );
        
        const insertedId = (result as any).insertId;
        await saveChecklistData(db, insertedId, formData);

        await db.commit();
        revalidatePath('/reception');
        return { success: true, message: 'Recepción registrada y Orden de Servicio creada exitosamente.' };

    } catch (error) {
        if (db) await db.rollback();
        console.error('Error creating reception:', error);
        return { success: false, message: 'Error al guardar la recepción en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}

export async function updateReception(prevState: any, formData: FormData) {
    const receptionId = formData.get('receptionId');
    if (!receptionId) {
        return { success: false, message: 'No se proporcionó el ID de la recepción.' };
    }

    const validatedFields = receptionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Datos inválidos para actualizar.' };
    }

    const { clientId, vehicleId, serviceReason, mileage } = validatedFields.data;
    
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        await db.query(
            `UPDATE ordenes_servicio 
             SET cliente_id = ?, vehiculo_id = ?, diagnostico_ini = ?, kilometraje = ? 
             WHERE id = ?`,
            [clientId, vehicleId, serviceReason, mileage || null, receptionId]
        );
        
        await saveChecklistData(db, Number(receptionId), formData);
        
        await db.commit();
        revalidatePath('/reception');
        return { success: true, message: 'Recepción actualizada exitosamente.' };
    } catch (error) {
        console.error('Error updating reception:', error);
        return { success: false, message: 'Error al actualizar la recepción.' };
    } finally {
        if (db) db.release();
    }
}

export async function deleteReception(receptionId: number) {
    let db;
    try {
        db = await pool.getConnection();
        const [result] = await db.query('DELETE FROM ordenes_servicio WHERE id = ?', [receptionId]);
        
        if ((result as any).affectedRows === 0) {
            return { success: false, message: 'No se encontró la recepción para eliminar.' };
        }

        revalidatePath('/reception');
        return { success: true, message: 'Recepción eliminada exitosamente.' };
    } catch (error: any) {
         if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return { success: false, message: 'No se puede eliminar. La recepción ya tiene pagos, refacciones o servicios registrados.' };
        }
        console.error('Error deleting reception:', error);
        return { success: false, message: 'Error al eliminar la recepción.' };
    } finally {
        if (db) db.release();
    }
}
