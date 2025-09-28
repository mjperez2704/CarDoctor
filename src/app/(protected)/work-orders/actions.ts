// src/app/(protected)/work-orders/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ProductForQuote } from '../quotes/actions';

export interface WorkOrder extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    vehiculo_id: number;
    cliente_razon_social: string;
    vehiculo_descripcion: string;
    tecnico_id: number | null;
    tecnico_nombre: string | null;
    estado: string;
    diagnostico_ini: string | null;
}

export interface WorkOrderDetails extends WorkOrder {
    // Aquí se podrían añadir más detalles si es necesario, como los items o servicios ya agregados.
}


export async function getWorkOrders(): Promise<WorkOrder[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<WorkOrder[]>(`
            SELECT
                os.id, os.folio, os.fecha,
                os.cliente_id, os.vehiculo_id,
                c.razon_social as cliente_razon_social,
                CONCAT(m.nombre, ' ', mo.nombre, ' ', v.anio) as vehiculo_descripcion,
                os.tecnico_id,
                CONCAT(e.nombre, ' ', e.apellido_p) as tecnico_nombre,
                os.estado,
                os.diagnostico_ini
            FROM ordenes_servicio os
                     JOIN clientes c ON os.cliente_id = c.id
                     LEFT JOIN vehiculos v ON os.vehiculo_id = v.id
                     LEFT JOIN empleados e ON os.tecnico_id = e.id
                     LEFT JOIN marcas m ON v.marca_id = m.id
                     LEFT JOIN modelos mo ON v.modelo_id = mo.id
            ORDER BY os.fecha DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching work orders:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// --- NUEVA ACCIÓN ---
export async function getWorkOrderDetails(orderId: number): Promise<WorkOrderDetails | null> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<WorkOrder[]>(`
            SELECT
                os.id, os.folio, os.fecha,
                os.cliente_id, os.vehiculo_id,
                c.razon_social as cliente_razon_social,
                CONCAT(m.nombre, ' ', mo.nombre, ' ', v.anio, ' (', v.placas, ')') as vehiculo_descripcion,
                os.tecnico_id,
                CONCAT(e.nombre, ' ', e.apellido_p) as tecnico_nombre,
                os.estado,
                os.diagnostico_ini
            FROM ordenes_servicio os
                     JOIN clientes c ON os.cliente_id = c.id
                     LEFT JOIN vehiculos v ON os.vehiculo_id = v.id
                     LEFT JOIN empleados e ON os.tecnico_id = e.id
                     LEFT JOIN marcas m ON v.marca_id = m.id
                     LEFT JOIN modelos mo ON v.modelo_id = mo.id
            WHERE os.id = ?
        `, [orderId]);
        
        if (rows.length === 0) return null;
        
        // Devolvemos el primer resultado como WorkOrderDetails
        return rows[0] as WorkOrderDetails;

    } catch (error) {
        console.error("Error fetching work order details:", error);
        return null;
    } finally {
        if (db) db.release();
    }
}

// --- NUEVA ACCIÓN --- (Reutilizada de cotizaciones para simplicidad)
export async function getProductsForQuote(): Promise<ProductForQuote[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<ProductForQuote[]>(
            `SELECT id, nombre, sku, precio_lista FROM productos WHERE activo = 1 ORDER BY nombre ASC`
        );
        return rows;
    } catch (error) {
        console.error("Error fetching products for quote:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}


const workOrderSchema = z.object({
    id: z.string().optional(),
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    vehicleId: z.string().min(1, "Debe seleccionar un vehículo."),
    technicianId: z.string().optional(),
    initialDiagnosis: z.string().min(10, "El diagnóstico debe tener al menos 10 caracteres."),
    estado: z.string().optional(), // Para la edición del estado
});

export async function saveWorkOrder(prevState: any, formData: FormData) {
    const validatedFields = workOrderSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Error de validación.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, clientId, vehicleId, initialDiagnosis, technicianId, estado } = validatedFields.data;
    const techId = technicianId ? parseInt(technicianId, 10) : null;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            // Lógica de ACTUALIZACIÓN
            await db.query(
                `UPDATE ordenes_servicio SET cliente_id = ?, vehiculo_id = ?, diagnostico_ini = ?, tecnico_id = ?, estado = ? WHERE id = ?`,
                [clientId, vehicleId, initialDiagnosis, techId, estado, id]
            );
        } else {
            // Lógica de CREACIÓN
            const folio = `OS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            await db.query(
                `INSERT INTO ordenes_servicio (folio, fecha, cliente_id, vehiculo_id, diagnostico_ini, tecnico_id, estado) VALUES (?, NOW(), ?, ?, ?, ?, 'RECEPCION')`,
                [folio, clientId, vehicleId, initialDiagnosis, techId]
            );
        }
        revalidatePath('/work-orders');
        revalidatePath('/reception');
        return { success: true, message: `Orden de Servicio ${id ? 'actualizada' : 'creada'} exitosamente.` };
    } catch (error) {
        console.error('Error creating work order:', error);
        return { success: false, message: 'Error al guardar la orden en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}

export async function cancelWorkOrder(orderId: number) {
    if (!orderId) {
        return { success: false, message: "ID de orden no válido." };
    }
    let db;
    try {
        db = await pool.getConnection();
        await db.query(`UPDATE ordenes_servicio SET estado = 'CANCELADO' WHERE id = ?`, [orderId]);
        revalidatePath('/work-orders');
        return { success: true, message: 'La Orden de Servicio ha sido cancelada.' };
    } catch (error) {
        console.error('Error canceling work order:', error);
        return { success: false, message: 'Error al cancelar la orden.' };
    } finally {
        if (db) db.release();
    }
}
