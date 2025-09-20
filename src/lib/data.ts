// src/lib/data.ts

import pool from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type {
    Producto, Marca, Proveedor, OrdenServicio, Bitacora, Usuario, Gasto, Empleado, Cliente,
    Modelo, Vehiculo, Herramienta, Almacen, Seccion, Lote, SolicitudInterna, Purchase, Rol
} from './types';
import { RowDataPacket } from 'mysql2';

// --- TIPOS PARA CONSULTAS COMPLEJAS (JOINS) ---

// Tipo para órdenes de servicio que incluye el nombre del cliente y la identificación del vehículo
type OrdenServicioCompleta = OrdenServicio & {
    clientName: string;
    vehicleIdentifier: string;
};

// Tipo para gastos que incluye el nombre del empleado que gasta y quien autoriza
type GastoConNombres = Gasto & {
    empleado_nombre: string;
    autoriza_nombre?: string;
}

// Tipo para lotes con detalles de su ubicación
export type LoteConDetalles = Lote & {
    almacen_nombre: string;
    seccion_nombre: string;
};


// --- FUNCIONES DE OBTENCIÓN DE DATOS ---

/**
 * Obtiene los productos (refacciones) del sistema.
 */
export async function getProductos(): Promise<Producto[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE es_servicio = false LIMIT 100'
        );
        return rows as Producto[];
    } catch (error) {
        console.error('Error de base de datos al obtener productos:', error);
        throw new Error('No se pudieron obtener los productos.');
    }
}

/**
 * Obtiene los productos (refacciones) del sistema.
 */
export async function getProducts(): Promise<Producto[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE es_servicio = false LIMIT 100'
        );
        return rows as Producto[];
    } catch (error) {
        console.error('Error de base de datos al obtener productos:', error);
        throw new Error('No se pudieron obtener los productos.');
    }
}


/**
 * Obtiene los servicios del sistema.
 */
export async function getServices(): Promise<Producto[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM productos WHERE es_servicio = true LIMIT 50;`
        );
        return rows as Producto[];
    } catch (error) {
        console.error("Error de base de datos al obtener servicios:", error);
        throw new Error('No se pudieron obtener los servicios.');
    }
}

/**
 * Obtiene todas las marcas de vehículos y/o productos.
 */
export async function getMarcas(): Promise<Marca[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM marcas ORDER BY nombre');
        return rows as Marca[];
    } catch (error) {
        console.error("Error de base de datos al obtener marcas:", error);
        throw new Error('No se pudieron obtener las marcas.');
    }
}

/**
 * Obtiene todos los modelos de vehículos.
 */
export async function getModelos(): Promise<Modelo[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM modelos ORDER BY nombre');
        return rows as Modelo[];
    } catch (error) {
        console.error("Error de base de datos al obtener modelos:", error);
        throw new Error('No se pudieron obtener los modelos.');
    }
}

/**
 * Obtiene todos los proveedores.
 */
export async function getProveedores(): Promise<Proveedor[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM proveedores ORDER BY razon_social');
        return rows as Proveedor[];
    } catch (error) {
        console.error("Error de base de datos al obtener proveedores:", error);
        throw new Error('No se pudieron obtener los proveedores.');
    }
}

/**
 * Obtiene todos los clientes.
 */
export async function getClientes(): Promise<Cliente[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes ORDER BY razon_social');
        return rows as Cliente[];
    } catch (error) {
        console.error("Error de base de datos al obtener clientes:", error);
        throw new Error('No se pudieron obtener los clientes.');
    }
}

/**
 * Obtiene todos los vehículos registrados.
 */
export async function getVehiculos(): Promise<Vehiculo[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vehiculos');
        return rows as Vehiculo[];
    } catch (error) {
        console.error("Error de base de datos al obtener vehículos:", error);
        throw new Error('No se pudieron obtener los vehículos.');
    }
}


/**
 * Obtiene las órdenes de servicio activas con información del cliente y vehículo.
 */
export async function getOrdenesServicio(): Promise<OrdenServicioCompleta[]> {
    noStore();
    try {
        const query = `
            SELECT
                os.id, os.folio, os.cliente_id, os.equipo_id, os.fecha, os.estado, os.diagnostico_ini,
                c.razon_social as clientName,
                CONCAT(m.nombre, ' ', mo.nombre, ' / Placas: ', v.placas) as vehicleIdentifier
            FROM ordenes_servicio os
                     JOIN clientes c ON os.cliente_id = c.id
                     JOIN vehiculos v ON os.equipo_id = v.id
                     LEFT JOIN marcas m ON v.marca_id = m.id
                     LEFT JOIN modelos mo ON v.modelo_id = mo.id
            WHERE os.estado NOT IN ('ENTREGADO', 'CANCELADO')
            ORDER BY os.fecha DESC
            LIMIT 20;
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows as OrdenServicioCompleta[];
    } catch (error) {
        console.error("Error de base de datos al obtener órdenes de servicio:", error);
        throw new Error('No se pudieron obtener las órdenes de servicio.');
    }
}

/**
 * Obtiene los registros de la bitácora del sistema.
 */
export async function getBitacora(): Promise<Bitacora[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bitacora ORDER BY fecha DESC LIMIT 200');
        return rows as Bitacora[];
    } catch (error) {
        console.error("Error de base de datos al obtener la bitácora:", error);
        throw new Error('No se pudo obtener la bitácora.');
    }
}

/**
 * Obtiene los usuarios del sistema (sin información sensible).
 */
export async function getUsuarios(): Promise<Usuario[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT u.id, u.nombre, u.apellido_p, u.email, u.activo, r.id as rol_id, r.nombre as rol_nombre FROM usuarios u LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id LEFT JOIN roles r ON ur.rol_id = r.id");

        const userMap = new Map<number, Usuario>();

        for (const row of rows as (RowDataPacket & {rol_id: number, rol_nombre: string})[]) {
            if (!userMap.has(row.id)) {
                userMap.set(row.id, {
                    id: row.id,
                    nombre: row.nombre,
                    apellido_p: row.apellido_p,
                    email: row.email,
                    activo: row.activo,
                    roles: [],
                    username: '', // Default values for properties not in the query
                    password_hash: '',
                    created_at: '',
                    updated_at: ''
                });
            }

            if (row.rol_id && row.rol_nombre) {
                userMap.get(row.id)!.roles!.push({
                    id: row.rol_id,
                    nombre: row.rol_nombre,
                });
            }
        }

        return Array.from(userMap.values());
    } catch (error) {
        console.error("Error de base de datos al obtener usuarios:", error);
        throw new Error('No se pudieron obtener los usuarios.');
    }
}

/**
 * Obtiene los gastos con los nombres de los empleados.
 */
export async function getGastos(): Promise<GastoConNombres[]> {
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
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows as GastoConNombres[];
    } catch (error) {
        console.error("Error de base de datos al obtener gastos:", error);
        throw new Error('No se pudieron obtener los gastos.');
    }
}

/**
 * Obtiene los empleados activos.
 */
export async function getEmpleados(): Promise<Empleado[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empleados WHERE fecha_baja IS NULL ORDER BY nombre');
        return rows as Empleado[];
    } catch (error) {
        console.error("Error de base de datos al obtener empleados:", error);
        throw new Error('No se pudieron obtener los empleados.');
    }
}

/**
 * Obtiene el inventario de herramientas.
 */
export async function getHerramientas(): Promise<Herramienta[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM herramientas ORDER BY nombre');
        return rows as Herramienta[];
    } catch (error) {
        console.error("Error de base de datos al obtener herramientas:", error);
        throw new Error('No se pudieron obtener las herramientas.');
    }
}

/**
 * Obtiene los almacenes con sus secciones.
 */
export async function getAlmacenes(): Promise<Almacen[]> {
    noStore();
    // Esta es una consulta más compleja, puede que necesites ajustarla a tu BD
    try {
        const [almacenesRows] = await pool.query<RowDataPacket[]>('SELECT * FROM almacenes');
        const [seccionesRows] = await pool.query<RowDataPacket[]>('SELECT * FROM secciones');
        
        const almacenes = almacenesRows as Almacen[];
        const secciones = seccionesRows as Seccion[];

        almacenes.forEach(almacen => {
            almacen.secciones = secciones.filter(seccion => seccion.almacen_id === almacen.id);
        });

        return almacenes;
    } catch (error) {
        console.error("Error de base de datos al obtener almacenes:", error);
        throw new Error('No se pudieron obtener los almacenes.');
    }
}

/**
 * Obtiene los lotes de un producto específico.
 */
export async function getLotesPorProducto(productoId: number): Promise<LoteConDetalles[]> {
    noStore();
    try {
        const query = `
            SELECT 
                l.*,
                a.nombre as almacen_nombre,
                s.nombre as seccion_nombre
            FROM lotes l
            JOIN almacenes a ON l.almacen_id = a.id
            JOIN secciones s ON l.seccion_id = s.id
            WHERE l.producto_id = ? AND l.cantidad > 0;
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [productoId]);
        return rows as LoteConDetalles[];
    } catch (error) {
        console.error("Error de base de datos al obtener lotes:", error);
        throw new Error('No se pudieron obtener los lotes del producto.');
    }
}

/**
 * Obtiene los roles del sistema.
 */
export async function getRoles(): Promise<Rol[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM roles ORDER BY nombre');
        return rows as Rol[];
    } catch (error) {
        console.error("Error de base de datos al obtener roles:", error);
        throw new Error('No se pudieron obtener los roles.');
    }
}

/**
 * Obtiene las solicitudes internas.
 */
export async function getSolicitudesInternas(): Promise<SolicitudInterna[]> {
    noStore();
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM solicitudes_internas ORDER BY fecha_solicitud DESC LIMIT 100');
        return rows as SolicitudInterna[];
    } catch (error) {
        console.error("Error de base de datos al obtener solicitudes internas:", error);
        throw new Error('No se pudieron obtener las solicitudes internas.');
    }
}

/**
 * Obtiene las compras.
 */
export async function getPurchases(): Promise<Purchase[]> {
    noStore();
    // Esta función simula la obtención de datos de compras.
    // Deberías reemplazarla con una consulta real a tu base de datos.
    const mockPurchases: Purchase[] = [
        { id: "OC-2024-001", providerId: "1", date: "2024-07-28", total: 1850.00, status: "Recibida Parcial", items: [{ sku: 'SKU001', name: 'Filtro de Aceite', quantity: 10, price: 150 }, { sku: 'SKU002', name: 'Bujía', quantity: 20, price: 17.50 }] },
        { id: "OC-2024-002", providerId: "2", date: "2024-07-25", total: 550.00, status: "Pendiente", items: [{ sku: 'SKU003', name: 'Balatas Delanteras', quantity: 2, price: 275 }] },
        { id: "OC-2024-003", providerId: "1", date: "2024-07-22", total: 320.00, status: "Recibida Completa", items: [{ sku: 'SKU004', name: 'Aceite Sintético 5L', quantity: 2, price: 160 }] }
    ];
    return mockPurchases;
}
