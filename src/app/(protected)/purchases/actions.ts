// src/app/(protected)/purchases/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface PurchaseOrder extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    proveedor_id: number;
    proveedor_razon_social: string;
    total: number;
    estado: "BORRADOR" | "ENVIADA" | "PARCIAL" | "RECIBIDA" | "CANCELADA";
}

export interface PurchaseOrderItem extends RowDataPacket {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
}

export interface PurchaseOrderWithDetails extends PurchaseOrder {
    items: PurchaseOrderItem[];
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<PurchaseOrder[]>(`
            SELECT oc.id, oc.folio, oc.fecha, oc.proveedor_id, p.razon_social as proveedor_razon_social, oc.total, oc.estado
            FROM ordenes_compra oc
                     JOIN proveedores p ON oc.proveedor_id = p.id
            ORDER BY oc.fecha DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching purchase orders:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getPurchaseOrderDetails(orderId: number): Promise<PurchaseOrderWithDetails | null> {
    let db;
    try {
        db = await pool.getConnection();
        const [orderRows] = await db.query<PurchaseOrder[]>(`SELECT * FROM ordenes_compra WHERE id = ?`, [orderId]);
        if (orderRows.length === 0) return null;
        const [itemRows] = await db.query<PurchaseOrderItem[]>(`SELECT producto_id, cantidad, precio_unitario FROM ordenes_compra_detalle WHERE orden_compra_id = ?`, [orderId]);

        const order = orderRows[0] as PurchaseOrderWithDetails;
        order.items = itemRows;
        return order;
    } catch (error) {
        console.error("Error fetching purchase order details:", error);
        return null;
    } finally {
        if (db) db.release();
    }
}

const purchaseItemSchema = z.object({
    productId: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => val > 0, "Selecciona un producto."),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const purchaseOrderSchema = z.object({
    id: z.string().optional(),
    providerId: z.string().min(1, "Debe seleccionar un proveedor."),
    items: z.array(purchaseItemSchema).min(1, "Debe agregar al menos un producto."),
});

export async function savePurchaseOrder(prevState: any, formData: FormData) {
    const items = JSON.parse(formData.get('items') as string || '[]');
    const validatedFields = purchaseOrderSchema.safeParse({
        id: formData.get('id'),
        providerId: formData.get('providerId'),
        items: items,
    });

    if (!validatedFields.success) {
        return { success: false, message: "Datos del formulario inválidos." };
    }

    const { id, providerId, items: orderItems } = validatedFields.data;
    const total = orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        if (id) {
            const orderId = parseInt(id, 10);
            await db.query(`UPDATE ordenes_compra SET proveedor_id = ?, total = ? WHERE id = ?`, [providerId, total, orderId]);
            await db.query('DELETE FROM ordenes_compra_detalle WHERE orden_compra_id = ?', [orderId]);
            for (const item of orderItems) {
                await db.query(`INSERT INTO ordenes_compra_detalle (orden_compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
                    [orderId, item.productId, item.quantity, item.unitPrice]);
            }
        } else {
            const folio = `OC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const [result] = await db.query<any>(`INSERT INTO ordenes_compra (folio, fecha, proveedor_id, total, estado, moneda) VALUES (?, NOW(), ?, ?, 'BORRADOR', 'MXN')`,
                [folio, providerId, total]);
            const orderId = result.insertId;
            for (const item of orderItems) {
                await db.query(`INSERT INTO ordenes_compra_detalle (orden_compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
                    [orderId, item.productId, item.quantity, item.unitPrice]);
            }
        }

        await db.commit();
        revalidatePath('/purchases');
        return { success: true, message: `Orden de Compra ${id ? 'actualizada' : 'creada'} exitosamente.` };

    } catch (error) {
        if (db) await db.rollback();
        console.error('Error saving purchase order:', error);
        return { success: false, message: 'Error al guardar la orden de compra.' };
    } finally {
        if (db) db.release();
    }
}

export async function deletePurchaseOrder(orderId: number) {
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();
        await db.query('DELETE FROM ordenes_compra_detalle WHERE orden_compra_id = ?', [orderId]);
        await db.query('DELETE FROM ordenes_compra WHERE id = ?', [orderId]);
        await db.commit();
        revalidatePath('/purchases');
        return { success: true, message: "Orden de Compra eliminada." };
    } catch (error) {
        if (db) await db.rollback();
        console.error("Error deleting purchase order:", error);
        return { success: false, message: "No se pudo eliminar la orden de compra." };
    } finally {
        if (db) db.release();
    }
}
