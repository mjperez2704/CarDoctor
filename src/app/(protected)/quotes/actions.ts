// src/app/(protected)/quotes/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Quote extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    cliente_nombre: string;
    total: number;
    estado: 'GENERADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
}

export interface ProductForQuote extends RowDataPacket {
    id: number;
    nombre: string;
    precio_lista: number;
}

// NUEVA INTERFAZ: Para los detalles de una cotización
export interface QuoteDetailItem extends RowDataPacket {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descripcion: string; // Se asume que se puede guardar una descripción custom
}
export interface QuoteWithDetails extends Quote {
    items: QuoteDetailItem[];
    notas: string | null;
}

export async function getQuotes(): Promise<Quote[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Quote[]>(`
            SELECT p.id, p.folio, p.fecha, p.cliente_id, c.razon_social as cliente_nombre, p.total, p.estado
            FROM cotizaciones p
                     JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.fecha DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// NUEVA ACCIÓN: Para obtener los detalles de una cotización para edición
export async function getQuoteDetails(quoteId: number): Promise<QuoteWithDetails | null> {
    let db;
    try {
        db = await pool.getConnection();
        const [quoteRows] = await db.query<Quote[]>(`
            SELECT p.*, c.razon_social as cliente_nombre
            FROM cotizaciones p
                     JOIN clientes c ON p.cliente_id = c.id
            WHERE p.id = ?
        `, [quoteId]);

        if (quoteRows.length === 0) return null;

        const [itemRows] = await db.query<QuoteDetailItem[]>(`
            SELECT producto_id, cantidad, precio_unitario, descripcion FROM cotizaciones_detalle WHERE cotizacion_id = ?
        `, [quoteId]);

        const quote = quoteRows[0] as QuoteWithDetails;
        quote.items = itemRows;

        return quote;
    } catch (error) {
        console.error("Error fetching quote details:", error);
        return null;
    } finally {
        if (db) db.release();
    }
}

export async function getProductsForQuote(): Promise<ProductForQuote[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<ProductForQuote[]>(
            `SELECT id, nombre, precio_lista FROM productos WHERE activo = 1 ORDER BY nombre ASC`
        );
        return rows;
    } catch (error) {
        console.error("Error fetching products for quote:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const quoteItemSchema = z.object({
    productId: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => val > 0, "Selecciona un producto."),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
    description: z.string(),
});

const quoteFormSchema = z.object({
    id: z.string().optional(),
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    items: z.array(quoteItemSchema).min(1, "Debe agregar al menos un concepto."),
    notes: z.string().optional(),
});

export async function saveQuote(prevState: any, formData: FormData) {
    const items = JSON.parse(formData.get('items') as string || '[]');
    const validatedFields = quoteFormSchema.safeParse({
        id: formData.get('id'),
        clientId: formData.get('clientId'),
        items: items,
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Datos del formulario inválidos." };
    }

    const { id, clientId, items: quoteItems, notes } = validatedFields.data;
    const total = quoteItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) * 1.16; // Suma y aplica IVA
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        if (id) { // --- Lógica de ACTUALIZACIÓN ---
            const quoteId = parseInt(id, 10);
            await db.query(
                `UPDATE cotizaciones SET cliente_id = ?, total = ?, notas = ? WHERE id = ?`,
                [clientId, total, notes, quoteId]
            );
            // Borrar detalles antiguos y re-insertar
            await db.query('DELETE FROM cotizaciones_detalle WHERE cotizacion_id = ?', [quoteId]);
            for (const item of quoteItems) {
                await db.query(
                    `INSERT INTO cotizaciones_detalle (cotizacion_id, producto_id, cantidad, precio_unitario, descripcion) VALUES (?, ?, ?, ?, ?)`,
                    [quoteId, item.productId, item.quantity, item.unitPrice, item.description]
                );
            }
        } else { // --- Lógica de CREACIÓN ---
            const folio = `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const [result] = await db.query<any>(
                `INSERT INTO cotizaciones (folio, fecha, cliente_id, total, estado, notas) VALUES (?, NOW(), ?, ?, 'GENERADA', ?)`,
                [folio, clientId, total, notes]
            );
            const quoteId = result.insertId;
            for (const item of quoteItems) {
                await db.query(
                    `INSERT INTO cotizaciones_detalle (cotizacion_id, producto_id, cantidad, precio_unitario, descripcion) VALUES (?, ?, ?, ?, ?)`,
                    [quoteId, item.productId, item.quantity, item.unitPrice, item.description]
                );
            }
        }

        await db.commit();
        revalidatePath('/quotes');
        return { success: true, message: `Cotización ${id ? 'actualizada' : 'creada'} exitosamente.` };

    } catch (error) {
        if (db) await db.rollback();
        console.error('Error saving quote:', error);
        return { success: false, message: 'Error al guardar la cotización.' };
    } finally {
        if (db) db.release();
    }
}

export async function updateQuoteStatus(quoteId: number, newStatus: Quote['estado']) {
    let db;
    try {
        db = await pool.getConnection();
        await db.query('UPDATE cotizaciones SET estado = ? WHERE id = ?', [newStatus, quoteId]);
        revalidatePath('/quotes');
        return { success: true, message: `Estado de la cotización actualizado a ${newStatus}.` };
    } catch (error) {
        console.error("Error updating quote status:", error);
        return { success: false, message: "No se pudo actualizar el estado." };
    } finally {
        if (db) db.release();
    }
}

export async function deleteQuote(quoteId: number) {
    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();
        await db.query('DELETE FROM cotizaciones_detalle WHERE cotizacion_id = ?', [quoteId]);
        await db.query('DELETE FROM cotizaciones WHERE id = ?', [quoteId]);
        await db.commit();
        revalidatePath('/quotes');
        return { success: true, message: "Cotización eliminada." };
    } catch (error) {
        if (db) await db.rollback();
        console.error("Error deleting quote:", error);
        return { success: false, message: "No se pudo eliminar la cotización." };
    } finally {
        if (db) db.release();
    }
}
