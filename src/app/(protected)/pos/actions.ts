"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ProductWithStock } from '../inventory/actions';

export interface Sucursal extends RowDataPacket {
    id: number;
    almacen_id: number;
    nombre: string;
    nombre_encargado: string | null;
}

export interface ProductForPOS extends ProductWithStock {
    // Hereda todo de ProductWithStock y podemos añadir campos si es necesario
}

// Acción para obtener todas las sucursales
export async function getSucursales(): Promise<Sucursal[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Sucursal[]>(`
            SELECT id, almacen_id, nombre, nombre_encargado
            FROM sucursales
            ORDER BY nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching sucursales:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Acción para obtener productos con stock de un almacén específico
export async function getProductsByWarehouse(warehouseId: number): Promise<ProductForPOS[]> {
    if (!warehouseId) return [];
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<ProductForPOS[]>(`
            SELECT
                p.*,
                COALESCE(SUM(l.cantidad), 0) as stock
            FROM productos p
                     INNER JOIN lotes l ON p.id = l.producto_id
            WHERE p.activo = 1 AND l.almacen_id = ?
            GROUP BY p.id
            HAVING stock > 0
            ORDER BY p.id ASC;
        `, [warehouseId]);
        return rows;
    } catch (error) {
        console.error("Error fetching products by warehouse:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Esquema de validación para la venta
const saleItemSchema = z.object({
    id: z.number(),
    quantity: z.number().min(1),
    unitPrice: z.number(),
    name: z.string() // Añadimos el nombre para el ticket
});

const saleSchema = z.object({
    sucursalId: z.coerce.number(),
    clienteId: z.coerce.number(),
    usuarioId: z.coerce.number(), // Se debería obtener de la sesión
    items: z.array(saleItemSchema).min(1)
});

// ===== INICIO DE LA MODIFICACIÓN =====
// Acción para crear una nueva venta
export async function createSale(data: unknown) {
    const validatedFields = saleSchema.safeParse(data);
    if (!validatedFields.success) {
        return { success: false, message: "Datos de venta inválidos." };
    }

    const { sucursalId, clienteId, usuarioId, items } = validatedFields.data;

    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const impuestos = subtotal * 0.16;
    const total = subtotal + impuestos;
    const folio = `VTA-${sucursalId}-${Date.now()}`;

    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        // 1. Insertar en la tabla 'ventas'
        const [saleResult] = await db.query<any>(
            `INSERT INTO ventas (folio, cliente_id, usuario_id, sucursal_id, subtotal, impuestos, total, metodo_pago)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'EFECTIVO')`, // Metodo de pago default
            [folio, clienteId, usuarioId, sucursalId, subtotal, impuestos, total]
        );
        const ventaId = saleResult.insertId;

        // 2. Insertar detalles y actualizar stock
        for (const item of items) {
            // Insertar detalle de venta
            await db.query(
                `INSERT INTO ventas_detalle (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [ventaId, item.id, item.quantity, item.unitPrice, item.quantity * item.unitPrice]
            );

            // Actualizar stock en 'lotes' (lógica FIFO simple)
            await db.query(
                `UPDATE lotes SET cantidad = cantidad - ? WHERE producto_id = ? AND almacen_id = (SELECT almacen_id FROM sucursales WHERE id = ?) AND cantidad > 0 ORDER BY fecha_caducidad ASC, id ASC LIMIT 1`,
                [item.quantity, item.id, sucursalId]
            );
        }

        await db.commit();
        revalidatePath('/pos');

        // Devolvemos los datos necesarios para el ticket
        return {
            success: true,
            message: `Venta ${folio} registrada con éxito.`,
            receiptData: {
                folio,
                date: new Date().toISOString(),
                items: items.map(i => ({...i, subtotal: i.quantity * i.unitPrice})),
                subtotal,
                iva: impuestos,
                total
            }
        };

    } catch (error) {
        if (db) await db.rollback();
        console.error("Error creating sale:", error);
        return { success: false, message: "Error al registrar la venta en la base de datos." };
    } finally {
        if (db) db.release();
    }
}
// ===== FIN DE LA MODIFICACIÓN =====
