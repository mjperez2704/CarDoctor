// src/lib/data.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import type { Almacen, Seccion, Cliente, Empleado, Proveedor, Marca, Modelo, Usuario, Rol, Producto, Lote } from './types';

// Función para obtener todos los Almacenes con sus Secciones
export async function getAlmacenes(): Promise<Almacen[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [almacenes] = await db.query<Almacen[]>("SELECT * FROM almacenes;");
        const [secciones] = await db.query<Seccion[]>("SELECT * FROM secciones;");

        const seccionesMap = new Map<number, Seccion[]>();
        for (const seccion of secciones) {
            if (!seccionesMap.has(seccion.almacen_id)) {
                seccionesMap.set(seccion.almacen_id, []);
            }
            seccionesMap.get(seccion.almacen_id)!.push(seccion);
        }

        for (const almacen of almacenes) {
            almacen.secciones = seccionesMap.get(almacen.id) || [];
        }

        return almacenes;
    } catch (error) {
        console.error("Error fetching almacenes:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Función para obtener todos los Productos (para selectores y formularios)
export async function getProductos(): Promise<Producto[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Producto[]>('SELECT id, sku, nombre, unidad FROM productos WHERE activo = 1 ORDER BY nombre ASC;');
        return rows;
    } catch (error) {
        console.error("Error fetching productos:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

// Función para obtener todos los Lotes (necesaria para transferencias)
export async function getLotes(): Promise<Lote[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Lote[]>('SELECT * FROM lotes WHERE cantidad > 0;');
        return rows;
    } catch (error) {
        console.error("Error fetching lotes:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}


// Las siguientes funciones ya existen en otros `actions.ts` pero las centralizamos aquí
// para componentes que las necesiten globalmente, o las re-exportamos.
// Por simplicidad y para no duplicar, los componentes que las necesiten deberían importarlas
// de sus respectivos `actions` files. Si se necesitaran en muchos lugares, este sería el
// lugar ideal para centralizarlas. Por ahora, las funciones de arriba son las que faltaban.

export async function getClientes(): Promise<Cliente[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Cliente[]>("SELECT id, razon_social FROM clientes ORDER BY razon_social ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching clientes:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getEmpleados(): Promise<Empleado[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Empleado[]>("SELECT id, nombre, apellido_p, puesto FROM empleados WHERE activo = 1 ORDER BY nombre ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching empleados:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getProveedores(): Promise<Proveedor[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Proveedor[]>("SELECT id, razon_social FROM proveedores ORDER BY razon_social ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}


export async function getMarcas(): Promise<Marca[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Marca[]>("SELECT id, nombre FROM marcas ORDER BY nombre ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching marcas:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

export async function getUsuarios(): Promise<Usuario[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Usuario[]>("SELECT id, nombre, email FROM usuarios WHERE activo = 1 ORDER BY nombre ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}


export async function getRoles(): Promise<Rol[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [rows] = await db.query<Rol[]>("SELECT id, nombre, descripcion FROM roles ORDER BY nombre ASC;");
        return rows;
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}
