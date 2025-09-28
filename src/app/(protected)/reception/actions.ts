// src/app/(protected)/reception/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Reception extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    cliente_razon_social: string;
    vehiculo_id: number;
    vehiculo_descripcion: string;
    diagnostico_ini: string;
    estado: string;
}

const receptionSchema = z.object({
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    vehicleId: z.string().min(1, "Debe seleccionar un vehículo."),
    mileage: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
    serviceReason: z.string().min(10, "El motivo debe tener al menos 10 caracteres."),
});

export async function getReceptions(): Promise<Reception[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Reception[]>(`
            SELECT 
                os.id, 
                os.folio, 
                os.fecha, 
                os.cliente_id,
                c.razon_social as cliente_razon_social,
                os.vehiculo_id,
                CONCAT(m.nombre, ' ', mo.nombre, ' ', v.anio) as vehiculo_descripcion,
                os.diagnostico_ini,
                os.estado
            FROM ordenes_servicio os
            JOIN clientes c ON os.cliente_id = c.id
            JOIN vehiculos v ON os.vehiculo_id = v.id
            LEFT JOIN marcas m ON v.marca_id = m.id
            LEFT JOIN modelos mo ON v.modelo_id = mo.id
            ORDER BY os.fecha DESC
            LIMIT 50;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching receptions:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function createReceptionAndWorkOrder(prevState: any, formData: FormData) {
    const validatedFields = receptionSchema.safeParse({
        clientId: formData.get('clientId'),
        vehicleId: formData.get('vehicleId'),
        mileage: formData.get('mileage'),
        serviceReason: formData.get('serviceReason'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Error de validación. Revise los campos.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { clientId, vehicleId, serviceReason } = validatedFields.data;
    const folio = `OS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    let db;
    try {
        db = await pool.getConnection();
        // SOLUCIÓN: Se cambió 'equipo_id' por 'vehiculo_id'
        await db.query(
            `INSERT INTO ordenes_servicio (folio, fecha, cliente_id, vehiculo_id, diagnostico_ini, estado)
             VALUES (?, NOW(), ?, ?, ?, 'RECEPCION')`,
            [folio, clientId, vehicleId, serviceReason]
        );

        revalidatePath('/reception');
        return { success: true, message: 'Recepción registrada y Orden de Servicio creada exitosamente.' };

    } catch (error) {
        console.error('Error creating reception:', error);
        return { success: false, message: 'Error al guardar la recepción en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}
