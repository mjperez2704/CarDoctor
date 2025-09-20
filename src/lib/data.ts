
import pool from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Producto, Marca, Proveedor, OrdenServicio, Bitacora, Usuario, Gasto, Empleado } from './types';

// MOCK DATA
import { productos as mockProductos } from './placeholder-data';
import { marcas as mockMarcas } from './placeholder-data';
import { proveedores as mockProveedores } from './placeholder-data';
import { ordenesServicio as mockOrdenes } from './placeholder-data';
import { bitacora as mockBitacora } from './placeholder-data';
import { usuarios as mockUsuarios } from './placeholder-data';
import { gastos as mockGastos } from './placeholder-data';
import { empleados as mockEmpleados } from './placeholder-data';

// Define un tipo extendido para el resultado del JOIN
type VehicleInService = OrdenServicio & {
  clientName: string;
  vehicleIdentifier: string;
};


export async function getProducts() {
  noStore();
  try {
    const [rows] = await pool.query<Producto[]>('SELECT * FROM productos LIMIT 50');
    return rows;
  } catch (error) {
    console.error('Error al obtener los productos de la base de datos:', error);
    return mockProductos;
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
    console.error("Database Error:", error);
    return mockProductos.filter(p => p.es_servicio);
  }
}

export async function getMarcas() {
  noStore();
  try {
    const [rows] = await pool.query<Marca[]>('SELECT * FROM marcas');
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    return mockMarcas;
  }
}

export async function getProveedores() {
  noStore();
  try {
    const [rows] = await pool.query<Proveedor[]>('SELECT * FROM proveedores');
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    return mockProveedores;
  }
}

export async function getOrdenesServicio() {
    noStore();
    try {
        const query = `
            SELECT 
                os.id, 
                os.folio, 
                os.cliente_id, 
                os.equipo_id, 
                os.fecha, 
                os.estado, 
                os.diagnostico_ini,
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
        console.error("Database Error:", error);
        return mockOrdenes.map(orden => ({
            ...orden,
            clientName: "Cliente Mock",
            vehicleIdentifier: "Vehículo Mock"
        }));
    }
}

export async function getBitacora() {
    noStore();
    try {
        const [rows] = await pool.query<Bitacora[]>('SELECT * FROM bitacora ORDER BY fecha DESC LIMIT 200');
        return rows;
    } catch (error) {
        console.error("Database Error:", error);
        return mockBitacora;
    }
}

export async function getUsuarios() {
    noStore();
    try {
        // Por seguridad, nunca selecciones la contraseña
        const [rows] = await pool.query<Usuario[]>('SELECT id, nombre, email, rol, activo FROM usuarios');
        return rows;
    } catch (error) {
        console.error("Database Error:", error);
        return mockUsuarios;
    }
}

// --- Mantenemos las funciones mockeadas por ahora ---

export function getGastos(): Gasto[] {
    return mockGastos;
}

export function getEmpleados(): Empleado[] {
    return mockEmpleados;
}
