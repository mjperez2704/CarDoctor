// src/app/(protected)/dashboard/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// Tipos para los datos que leeremos de la BD
interface CardStats {
    activeWorkOrders: number;
    lowStockItems: number;
}

interface WorkOrderByStatus {
    status: string;
    total: number;
}

interface InventoryByCategory {
    name: string;
    value: number;
    fill: string;
}

// Acción para obtener las estadísticas principales (tarjetas)
export async function getDashboardCardStats(): Promise<CardStats> {
    let db;
    try {
        db = await pool.getConnection();

        // Conteo de órdenes de servicio activas
        const [workOrdersResult] = await db.query<RowDataPacket[]>(
            "SELECT COUNT(id) as count FROM ordenes_servicio WHERE estado NOT IN ('ENTREGADO', 'CANCELADO')"
        );
        const activeWorkOrders = workOrdersResult[0].count;

        // Conteo de productos con bajo stock
        const [lowStockResult] = await db.query<RowDataPacket[]>(
            "SELECT COUNT(p.id) as count FROM productos p LEFT JOIN (SELECT producto_id, SUM(cantidad) as stock FROM lotes GROUP BY producto_id) l ON p.id = l.producto_id WHERE l.stock <= p.stock_min"
        );
        const lowStockItems = lowStockResult[0].count;

        return { activeWorkOrders, lowStockItems };
    } catch (error) {
        console.error("Error fetching dashboard card stats:", error);
        return { activeWorkOrders: 0, lowStockItems: 0 };
    } finally {
        if (db) db.release();
    }
}

// Acción para obtener las órdenes de servicio agrupadas por estado para la gráfica
export async function getWorkOrdersByStatus(): Promise<WorkOrderByStatus[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT estado as status, COUNT(id) as total FROM ordenes_servicio GROUP BY estado"
        );
        return rows.map(row => ({...row, status: row.status.replace('_', ' ')})) as WorkOrderByStatus[];
    } catch (error) {
        console.error("Error fetching work orders by status:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Acción para obtener el inventario agrupado por categoría para la gráfica
export async function getInventoryByCategory(): Promise<InventoryByCategory[]> {
    let db;
    const chartColors = ["#2196F3", "#4CAF50", "#FFC107", "#E91E63", "#9C27B0"]; // Colores para la gráfica

    try {
        db = await pool.getConnection();
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                cp.nombre as name, 
                COUNT(p.id) as value 
            FROM productos p
            JOIN categorias_producto cp ON p.categoria_id = cp.id
            GROUP BY cp.nombre
            ORDER BY value DESC
        `);

        return (rows as {name: string, value: number}[]).map((row, index) => ({
            ...row,
            fill: `var(--chart-${index + 1})` // O usar un array de colores predefinido
        }));

    } catch (error) {
        console.error("Error fetching inventory by category:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
