// src/app/(protected)/inventory/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import type { Producto } from '@/lib/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface ProductWithStock extends Producto, RowDataPacket {
    stock: number;
}
export interface StockDetail extends RowDataPacket {
    warehouseName: string;
    sectionName: string;
    lotCode: string;
    quantity: number;
}

export async function getProductsWithStock(): Promise<ProductWithStock[]> {
    let db;
    try {
        db = await pool.getConnection();
        // Se añade un filtro para no mostrar productos inactivos
        const [rows] = await db.query<ProductWithStock[]>(`
            SELECT
                p.*,
                COALESCE(SUM(l.cantidad), 0) as stock
            FROM
                productos p
                    LEFT JOIN
                lotes l ON p.id = l.producto_id
            WHERE p.activo = 1
            GROUP BY
                p.id
            ORDER BY
                p.nombre ASC;
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching products with stock:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getStockDetails(productId: number): Promise<StockDetail[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<StockDetail[]>(`
            SELECT
                a.nombre AS warehouseName,
                s.nombre AS sectionName,
                l.codigo_lote AS lotCode,
                l.cantidad AS quantity
            FROM lotes l
                     JOIN almacenes a ON l.almacen_id = a.id
                     JOIN secciones s ON l.seccion_id = s.id
            WHERE l.producto_id = ? AND l.cantidad > 0
            ORDER BY a.nombre, s.nombre;
        `, [productId]);
        return rows;
    } catch (error) {
        console.error(`Error fetching stock details for product ${productId}:`, error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Esquema Zod para validar los datos del producto
const productSchema = z.object({
    id: z.string().optional(), // ID opcional para la edición
    sku: z.string().min(1, "El SKU es requerido."),
    nombre: z.string().min(1, "El nombre es requerido."),
    precio_lista: z.coerce.number().min(0, "El precio no puede ser negativo."),
    costo_promedio: z.coerce.number().min(0, "El costo no puede ser negativo."),
    unidad: z.string().min(1, "La unidad es requerida."),
    categoria_id: z.coerce.number().int().min(1, "La categoría es requerida."),
    // Campos adicionales para el formulario completo
    stock_min: z.coerce.number().int().min(0).optional(),
    stock_max: z.coerce.number().int().min(0).optional(),
});

// Acción unificada para CREAR y ACTUALIZAR un producto
export async function saveProduct(prevState: any, formData: FormData) {
    const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: "Datos del formulario inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, sku, nombre, precio_lista, costo_promedio, unidad, categoria_id, stock_min, stock_max } = validatedFields.data;

    let db;
    try {
        db = await pool.getConnection();
        if (id) {
            // Lógica de ACTUALIZACIÓN
            await db.query(
                `UPDATE productos SET sku = ?, nombre = ?, precio_lista = ?, costo_promedio = ?, unidad = ?, categoria_id = ?, stock_min = ?, stock_max = ? WHERE id = ?`,
                [sku, nombre, precio_lista, costo_promedio, unidad, categoria_id, stock_min, stock_max, id]
            );
            revalidatePath('/inventory');
            revalidatePath('/catalogs/products');
            return { success: true, message: 'Producto actualizado exitosamente.' };
        } else {
            // Lógica de CREACIÓN
            await db.query(
                `INSERT INTO productos (sku, nombre, precio_lista, costo_promedio, unidad, categoria_id, stock_min, stock_max, proveedor_id, es_inventariable, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)`,
                [sku, nombre, precio_lista, costo_promedio, unidad, categoria_id, stock_min, stock_max]
            );
            revalidatePath('/inventory');
            revalidatePath('/catalogs/products');
            return { success: true, message: 'Producto creado exitosamente.' };
        }
    } catch (error: any) {
        console.error('Error saving product:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un producto con ese SKU.' };
        }
        return { success: false, message: 'Error al guardar el producto.' };
    } finally {
        if (db) db.release();
    }
}

// Acción para DAR DE BAJA (eliminación lógica) un producto
export async function deactivateProduct(productId: number) {
    if (!productId) {
        return { success: false, message: "ID de producto no válido." };
    }
    let db;
    try {
        db = await pool.getConnection();
        await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [productId]);
        revalidatePath('/inventory');
        revalidatePath('/catalogs/products');
        return { success: true, message: 'Producto dado de baja exitosamente.' };
    } catch (error) {
        console.error('Error deactivating product:', error);
        return { success: false, message: 'Error al dar de baja el producto.' };
    } finally {
        if (db) db.release();
    }
}
