// src/app/(protected)/customers/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ... (interfaces y acciones get... sin cambios) ...
export interface Customer {
    id: number;
    razon_social: string;
    rfc: string | null;
    email: string | null;
    telefono: string | null;
    fecha_registro: string;
}
export interface Vehicle {
    id: number;
    placas: string | null;
    marca: string | null;
    modelo: string | null;
    anio: number | null;
    color: string | null;
    vin: string | null;
    imagen_url: string | null;
}
export interface CustomerWithVehicleCount extends Customer {
    vehicle_count: number;
}
export async function getCustomersWithVehicleCount(): Promise<CustomerWithVehicleCount[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT c.*, COUNT(v.id) as vehicle_count
            FROM clientes c
                     LEFT JOIN vehiculos v ON c.id = v.cliente_id
            GROUP BY c.id
            ORDER BY c.id
        `);
        return rows as CustomerWithVehicleCount[];
    } catch (error) {
        console.error("Error fetching customers with vehicle count:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
export async function getVehiclesByCustomerId(customerId: number): Promise<Vehicle[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT
                v.id,
                v.placas,
                m.nombre as marca,
                mo.nombre as modelo,
                v.anio,
                v.color,
                v.vin
            FROM vehiculos v
                     LEFT JOIN marcas m ON v.marca_id = m.id
                     LEFT JOIN modelos mo ON v.modelo_id = mo.id
            WHERE v.cliente_id = ?
        `, [customerId]);
        return rows as Vehicle[];
    } catch (error) {
        console.error(`Error fetching vehicles for customer ${customerId}:`, error);
        return [];
    } finally {
        if (db) db.release();
    }
}
export async function getBrandsAndModels() {
    let db;
    try {
        db = await pool.getConnection();
        const [marcas] = await db.query('SELECT id, nombre FROM marcas ORDER BY nombre');
        const [modelos] = await db.query('SELECT id, nombre, marca_id FROM modelos ORDER BY nombre');
        return { marcas, modelos };
    } catch (error) {
        console.error("Error fetching brands and models:", error);
        return { marcas: [], modelos: [] };
    } finally {
        if (db) db.release();
    }
}
export async function addVehicleToCustomer(prevState: any, formData: FormData) {
    const customerId = parseInt(formData.get('customerId') as string, 10);
    const vehicleImage = formData.get('imagen_vehiculo') as File;
    const rawFormData = {
        placas: formData.get('placas') as string || null,
        marca_id: formData.get('marca_id') ? parseInt(formData.get('marca_id') as string, 10) : null,
        modelo_id: formData.get('modelo_id') ? parseInt(formData.get('modelo_id') as string, 10) : null,
        anio: formData.get('anio') ? parseInt(formData.get('anio') as string, 10) : null,
        color: formData.get('color') as string || null,
        vin: formData.get('vin') as string || null,
        motor: formData.get('motor') as string || null,
        imagen_url: vehicleImage && vehicleImage.size > 0 ? `/assets/vehiculo_${Math.floor(Math.random() * 4) + 1}.png` : null,
    };
    if (!customerId || (!rawFormData.placas && !rawFormData.vin)) {
        return { success: false, message: 'Se requiere el ID del cliente y al menos la placa o el VIN.' };
    }
    let db;
    try {
        db = await pool.getConnection();
        await db.query(
            `INSERT INTO vehiculos (cliente_id, placas, marca_id, modelo_id, anio, color, vin, motor, imagen_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customerId,
                rawFormData.placas,
                rawFormData.marca_id,
                rawFormData.modelo_id,
                rawFormData.anio,
                rawFormData.color,
                rawFormData.vin,
                rawFormData.motor,
                rawFormData.imagen_url
            ]
        );
        revalidatePath('/customers');
        return { success: true, message: 'Vehículo agregado exitosamente.' };
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return { success: false, message: 'Error al guardar el vehículo en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}

const customerSchema = z.object({
    id: z.string().optional(), // El ID es opcional, solo presente en edición
    razon_social: z.string().min(3, "La Razón Social es requerida."),
    rfc: z.string().optional(),
    email: z.string().email("El email no es válido.").optional().or(z.literal('')),
    telefono: z.string().optional(),
});

// --- ACCIÓN UNIFICADA PARA GUARDAR (CREAR Y EDITAR) ---
export async function saveCustomer(prevState: any, formData: FormData) {
    const validatedFields = customerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, razon_social, rfc, email, telefono } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            // --- Lógica de ACTUALIZACIÓN ---
            await db.query(
                'UPDATE clientes SET razon_social = ?, rfc = ?, email = ?, telefono = ? WHERE id = ?',
                [razon_social, rfc || null, email || null, telefono || null, id]
            );
            revalidatePath('/customers');
            return { success: true, message: 'Cliente actualizado exitosamente.' };
        } else {
            // --- Lógica de CREACIÓN ---
            await db.query(
                'INSERT INTO clientes (razon_social, rfc, email, telefono, tipo_id, fecha_registro) VALUES (?, ?, ?, ?, 1, NOW())',
                [razon_social, rfc || null, email || null, telefono || null]
            );
            revalidatePath('/customers');
            return { success: true, message: 'Cliente creado exitosamente.' };
        }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un cliente con ese RFC.' };
        }
        return { success: false, message: 'Error al guardar el cliente en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}

export async function deleteCustomer(customerId: number) {
    if (!customerId) {
        return { success: false, message: "ID de cliente no válido." };
    }
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();
        await db.query('DELETE FROM vehiculos WHERE cliente_id = ?', [customerId]);
        await db.query('DELETE FROM clientes WHERE id = ?', [customerId]);
        await db.commit();
        revalidatePath('/customers');
        return { success: true, message: 'Cliente eliminado exitosamente.' };
    } catch (error: any) {
        if (db) await db.rollback();
        console.error('Error deleting customer:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return { success: false, message: 'No se puede eliminar el cliente porque tiene registros asociados.' };
        }
        return { success: false, message: 'Error al eliminar el cliente.' };
    } finally {
        if (db) db.release();
    }
}
