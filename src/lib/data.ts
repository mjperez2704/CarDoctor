
import pool from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Producto, Marca, Proveedor, OrdenServicio, Bitacora, Usuario, Gasto, Empleado, Cliente, Almacen, Lote, Seccion, Modelo, Rol, Herramienta, SolicitudInterna, Purchase } from './types';
import { RowDataPacket } from 'mysql2';

// --- Funciones de obtención de datos --- 

export async function getProductos() {
  noStore();
  try {
    const [rows] = await pool.query<Producto[]>('SELECT * FROM productos LIMIT 100');
    return rows;
  } catch (error) {
    console.error('Error de base de datos al obtener productos:', error);
    return [];
  }
}

export function getProducts() {
    return getProductos();
}

export async function getMarcas() {
  noStore();
  try {
    const [rows] = await pool.query<Marca[]>('SELECT * FROM marcas');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener marcas:", error);
    return [];
  }
}

export async function getModelos() {
  noStore();
  try {
    const [rows] = await pool.query<Modelo[]>('SELECT * FROM modelos');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener modelos:", error);
    return [];
  }
}

export async function getProveedores() {
  noStore();
  try {
    const [rows] = await pool.query<Proveedor[]>('SELECT * FROM proveedores');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener proveedores:", error);
    return [];
  }
}

export async function getClientes() {
  noStore();
  try {
    const [rows] = await pool.query<Cliente[]>('SELECT * FROM clientes ORDER BY razon_social');
    return rows;
  } catch (error) {
    console.error("Error de base de datos al obtener clientes:", error);
    return [];
  }
}

export async function getOrdenesServicio() {
    noStore();
    try {
        const query = `
           SELECT os.*, c.razon_social as cliente_nombre 
           FROM ordenes_servicio os
           JOIN clientes c ON os.cliente_id = c.id
           ORDER BY os.fecha DESC 
           LIMIT 50;
        `;
        const [rows] = await pool.query<OrdenServicio[]>(query);
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener órdenes de servicio:", error);
        return [];
    }
}

export async function getBitacora() {
    noStore();
    try {
        const [rows] = await pool.query<Bitacora[]>('SELECT * FROM bitacora ORDER BY fecha DESC LIMIT 200');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener la bitácora:", error);
        return [];
    }
}

export async function getUsuarios() {
    noStore();
    try {
        const [rows] = await pool.query<Usuario[]>(`
            SELECT u.id, u.nombre, u.apellido_p, u.email, u.activo, r.id as rol_id, r.nombre as rol_nombre
            FROM usuarios u
            LEFT JOIN roles_usuarios ru ON u.id = ru.usuario_id
            LEFT JOIN roles r ON ru.rol_id = r.id
        `);
        // Agrupar roles por usuario
        const users: { [key: number]: Usuario } = {};
        rows.forEach((row: any) => {
            if (!users[row.id]) {
                users[row.id] = {
                    id: row.id,
                    nombre: row.nombre,
                    apellido_p: row.apellido_p,
                    email: row.email,
                    activo: row.activo,
                    roles: [],
                    // add other required fields from Usuario type with default/null values
                    username: row.email,
                    password_hash: '',
                    created_at: '',
                    updated_at: '',
                };
            }
            if (row.rol_id) {
                users[row.id].roles!.push({ id: row.rol_id, nombre: row.rol_nombre });
            }
        });
        return Object.values(users);
    } catch (error) {
        console.error("Error de base de datos al obtener usuarios:", error);
        return [];
    }
}

export async function getGastos() {
    noStore();
    try {
        const [rows] = await pool.query<Gasto[]>('SELECT * FROM gastos ORDER BY fecha DESC LIMIT 100');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener gastos:", error);
        return [];
    }
}

export async function getEmpleados() {
    noStore();
    try {
        const [rows] = await pool.query<Empleado[]>('SELECT * FROM empleados WHERE activo = 1 ORDER BY nombre');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener empleados:", error);
        return [];
    }
}

export async function getRoles() {
    noStore();
    try {
        const [rows] = await pool.query<Rol[]>('SELECT * FROM roles');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener roles:", error);
        return [];
    }
}

export async function getHerramientas() {
    noStore();
    try {
        const [rows] = await pool.query<Herramienta[]>('SELECT * FROM herramientas');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener herramientas:", error);
        return [];
    }
}

export async function getAlmacenes() {
    noStore();
    try {
        const [almacenes] = await pool.query<Almacen[]>('SELECT * FROM almacenes');
        const [secciones] = await pool.query<Seccion[]>('SELECT * FROM secciones');

        return almacenes.map(almacen => ({
            ...almacen,
            secciones: secciones.filter(s => s.almacen_id === almacen.id)
        }));

    } catch (error) {
        console.error("Error de base de datos al obtener almacenes:", error);
        return [];
    }
}

export async function getSolicitudesInternas() {
    noStore();
    try {
        const [rows] = await pool.query<SolicitudInterna[]>('SELECT * FROM solicitudes_internas ORDER BY fecha_solicitud DESC LIMIT 100');
        return rows;
    } catch (error) {
        console.error("Error de base de datos al obtener solicitudes internas:", error);
        return [];
    }
}

export function getPurchases(): Purchase[] {
  // Datos simulados
  return [
    { id: "OC-2024-001", providerId: "1", date: "2024-07-15", total: 1250.00, status: "Recibida Parcial", items: [{ sku: 'IP15PM-OLED', name: 'Pantalla OLED iPhone 15 Pro Max', quantity: 10, price: 125.00 }] },
    { id: "OC-2024-002", providerId: "2", date: "2024-07-18", total: 850.50, status: "Pendiente", items: [{ sku: 'SAM-S23-BAT', name: 'Batería Samsung S23', quantity: 15, price: 56.70 }] },
    { id: "OC-2024-003", providerId: "1", date: "2024-07-22", total: 450.00, status: "Recibida Completa", items: [{ sku: 'IP14-CAM', name: 'Módulo de Cámara iPhone 14', quantity: 5, price: 90.00 }] },
  ];
}


export async function getLotesPorProducto(productoId: number): Promise<Lote[]> {
    noStore();
    try {
        const [rows] = await pool.query<Lote[]>(
            'SELECT l.*, a.nombre as almacen_nombre, s.nombre as seccion_nombre FROM lotes l JOIN almacenes a ON l.almacen_id = a.id JOIN secciones s ON l.seccion_id = s.id WHERE l.producto_id = ?',
            [productoId]
        );
        return rows;
    } catch (error) {
        console.error(`Error al obtener lotes para el producto ${productoId}:`, error);
        return [];
    }
}

// ----- NUEVA FUNCIÓN OPTIMIZADA -----
export async function getDashboardData() {
    noStore();
    try {
        const [productos, ordenes] = await Promise.all([
            pool.query<Producto[]>('SELECT id, nombre, sku, stock_minimo, stock_actual, categoria_id FROM productos LIMIT 100'),
            pool.query<OrdenServicio[]>("SELECT estado FROM ordenes_servicio WHERE estado NOT IN ('ENTREGADO', 'CANCELADO')")
        ]);
        
        return {
            inventoryData: productos[0],
            workOrdersData: ordenes[0],
            auditLogsData: [] // Mantener por si se usa en el futuro
        };
    } catch (error) {
        console.error('Error de base de datos al obtener datos del dashboard:', error);
        // Devolver datos vacíos en caso de error para no romper la UI
        return {
            inventoryData: [],
            workOrdersData: [],
            auditLogsData: []
        };
    }
}
