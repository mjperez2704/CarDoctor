
import pool from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Producto, Marca, Proveedor, OrdenServicio, Bitacora, Usuario, Gasto, Empleado, Cliente } from './types';

// Tipos extendidos para los resultados de JOINS
type VehicleInService = OrdenServicio & {
  clientName: string;
  vehicleIdentifier: string;
};

type GastoConNombres = Gasto & {
    empleado_nombre: string;
    autoriza_nombre?: string;
}

// --- Funciones de obtención de datos --- 

export async function getProducts() {
  noStore();
  try {
    const [rows] = await pool.query<Producto[]>('SELECT * FROM productos LIMIT 50');
    return rows;
  } catch (error) {
    console.error('Error de base de datos al obtener productos:', error);
    throw new Error('No se pudieron obtener los productos.');
  }
}

export async function getServices() {
  noStore();
  try {
    const [rows] = await pool.query<Producto[]>(
      `SELECT * FROM productos WHERE es_servicio = true LIMIT 50;`
    );
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener servicios:", error);
    throw new Error('No se pudieron obtener los servicios.');
  }
}

export async function getMarcas() {
  noStore();
  try {
    const [rows] = await pool.query<Marca[]>('SELECT * FROM marcas');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener marcas:", error);
    throw new Error('No se pudieron obtener las marcas.');
  }
}

export async function getProveedores() {
  noStore();
  try {
    const [rows] = await pool.query<Proveedor[]>('SELECT * FROM proveedores');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener proveedores:", error);
    throw new Error('No se pudieron obtener los proveedores.');
  }
}

export async function getClientes() {
  noStore();
  try {
    const [rows] = await pool.query<Cliente[]>('SELECT * FROM clientes ORDER BY nombre');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener clientes:", error);
    throw new Error('No se pudieron obtener los clientes.');
  }
}

export async function getOrdenesServicio() {
    noStore();
    try {
        const query = `
            SELECT 
                os.id, os.folio, os.cliente_id, os.equipo_id, os.fecha, os.estado, os.diagnostico_ini,
                CONCAT(c.nombre, ' ', c.apellido_p) as clientName,
                e.full_name as vehicleIdentifier
            FROM ordenes_servicio os
            JOIN clientes c ON os.cliente_id = c.id
            JOIN equipos e ON os.equipo_id = e.id
            WHERE os.estado NOT IN ('ENTREGADO', 'CANCELADO')
            ORDER BY os.fecha DESC
            LIMIT 20;
        `;
        const [rows] = await pool.query<VehicleInService[]>(query);
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener órdenes de servicio:", error);
        throw new Error('No se pudieron obtener las órdenes de servicio.');
    }
}

export async function getBitacora() {
    noStore();
    try {
        const [rows] = await pool.query<Bitacora[]>('SELECT * FROM bitacora ORDER BY fecha DESC LIMIT 200');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener la bitácora:", error);
        throw new Error('No se pudo obtener la bitácora.');
    }
}

export async function getUsuarios() {
    noStore();
    try {
        const [rows] = await pool.query<Usuario[]>('SELECT id, nombre, email, rol, activo FROM usuarios');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener usuarios:", error);
        throw new Error('No se pudieron obtener los usuarios.');
    }
}

export async function getGastos() {
    noStore();
    try {
        const query = `
            SELECT 
                g.*,
                CONCAT(e.nombre, ' ', e.apellido_p) as empleado_nombre,
                CONCAT(a.nombre, ' ', a.apellido_p) as autoriza_nombre
            FROM gastos g
            JOIN empleados e ON g.empleado_id = e.id
            LEFT JOIN empleados a ON g.autoriza_id = a.id
            ORDER BY g.fecha DESC
            LIMIT 100;
        `;
        const [rows] = await pool.query<GastoConNombres[]>(query);
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener gastos:", error);
        throw new Error('No se pudieron obtener los gastos.');
    }
}

export async function getEmpleados() {
    noStore();
    try {
        const [rows] = await pool.query<Empleado[]>('SELECT * FROM empleados WHERE activo = 1 ORDER BY nombre');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener empleados:", error);
        throw new Error('No se pudieron obtener los empleados.');
    }
}
