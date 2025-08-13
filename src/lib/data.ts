import type {
  Usuario,
  Rol,
  Permiso,
  Empleado,
  Proveedor,
  Cliente,
  OrdenCompra,
  OrdenServicio,
  Producto,
  Almacen,
  Seccion,
  Lote
} from "./types";

const now = new Date();

// ============================================================
// Datos de Muestra (Mock Data)
// ============================================================

// --------------------
// SEGURIDAD
// --------------------
export const roles: Rol[] = [
  { id: 1, nombre: 'Admin', descripcion: 'Acceso total al sistema' },
  { id: 2, nombre: 'Técnico', descripcion: 'Acceso a reparaciones e inventario' },
  { id: 3, nombre: 'Vendedor', descripcion: 'Acceso a ventas y clientes' },
];

export const usuarios: Usuario[] = [
  { 
    id: 1, 
    username: 'admin',
    email: 'admin@example.com', 
    nombre: 'Admin',
    apellido_p: 'Principal',
    password_hash: 'hashed_password', // En un caso real, esto estaría hasheado
    activo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    roles: [roles[0]]
  },
  { 
    id: 2, 
    username: 'jperez',
    email: 'juan.perez@example.com', 
    nombre: 'Juan',
    apellido_p: 'Pérez',
    password_hash: 'hashed_password',
    activo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    roles: [roles[1]]
  },
  { 
    id: 3, 
    username: 'mrodriguez',
    email: 'maria.rodriguez@example.com', 
    nombre: 'Maria',
    apellido_p: 'Rodriguez',
    password_hash: 'hashed_password',
    activo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    roles: [roles[2]]
  },
];

// --------------------
// EMPLEADOS
// --------------------
export const empleados: Empleado[] = [
    { id: 1, nombre: 'Admin User', apellido_p: 'System', email: 'admin@example.com', puesto: 'Administrador', usuario_id: 1 },
    { id: 2, nombre: 'Juan', apellido_p: 'Pérez', email: 'juan.perez@example.com', puesto: 'Técnico Líder', usuario_id: 2 },
    { id: 3, nombre: 'Maria', apellido_p: 'Rodriguez', email: 'maria.rodriguez@example.com', puesto: 'Ejecutiva de Ventas', usuario_id: 3 },
];

// --------------------
// CONTACTOS
// --------------------
export const proveedores: Proveedor[] = [
    { id: 1, razon_social: 'Partes Express S.A. de C.V.', rfc: 'PEXS880101ABC', email: 'contacto@partesexpress.com', dias_credito: 30 },
    { id: 2, razon_social: 'Accesorios Móviles GAMA', rfc: 'AMGB920505XYZ', email: 'ventas@gama.com', dias_credito: 0 },
];

export const clientes: Cliente[] = [
    { id: 1, tipo_id: 1, razon_social: 'Ana Torres', rfc: 'TOAN850404LFG', email: 'ana.torres@email.com', fecha_registro: '2023-10-15T10:00:00Z' },
    { id: 2, tipo_id: 1, razon_social: 'Luis Morales', rfc: 'MOLU791120HJC', email: 'luis.m@email.com', fecha_registro: '2023-11-20T11:30:00Z' },
    { id: 3, tipo_id: 2, razon_social: 'Consultoría Digital SC', rfc: 'CDI120220E45', email: 'contacto@consultoria.com', fecha_registro: '2024-01-05T15:00:00Z' },
];

// --------------------
// PRODUCTOS
// --------------------
export const productos: Producto[] = [
  { id: 1, sku: 'PAR-IP15-PAN', nombre: 'Pantalla iPhone 15', categoria_id: 2, marca_id: 1, modelo_id: 1, activo: true, es_serie: false, precio_lista: 150.00, costo_promedio: 100.00, unidad: 'PZA' },
  { id: 2, sku: 'ACC-CAB-USBC', nombre: 'Cable USB-C 1m', categoria_id: 3, activo: true, es_serie: false, precio_lista: 25.00, costo_promedio: 10.00, unidad: 'PZA' },
  { id: 3, sku: 'EQU-SAM-S24', nombre: 'Samsung Galaxy S24', categoria_id: 1, marca_id: 2, modelo_id: 2, activo: true, es_serie: true, precio_lista: 1200.00, costo_promedio: 950.00, unidad: 'PZA' },
  { id: 4, sku: 'HER-DES-01', nombre: 'Kit Desarmadores Precisión', categoria_id: 4, activo: true, es_serie: false, precio_lista: 40.00, costo_promedio: 25.00, unidad: 'KIT' },
  { id: 5, sku: 'SRV-DIAG-01', nombre: 'Servicio de Diagnóstico', categoria_id: 5, activo: true, es_serie: false, precio_lista: 20.00, costo_promedio: 0.00, unidad: 'SRV' },
];

// --------------------
// ALMACÉN
// --------------------
export const almacenes: Almacen[] = [
    {
        id: 1,
        clave: 'PRINCIPAL',
        nombre: 'Almacén Principal',
        tipo: 'PRINCIPAL',
        secciones: [
            { id: 1, almacen_id: 1, clave: 'A1', nombre: 'Refacciones Apple' },
            { id: 2, almacen_id: 1, clave: 'B1', nombre: 'Accesorios Venta' },
        ]
    }
];

// --------------------
// COMPRAS Y VENTAS
// --------------------
export const ordenesCompra: OrdenCompra[] = [
    { 
        id: 1, 
        folio: 'OC-2024-001',
        proveedor_id: 1, 
        fecha: '2024-07-28T10:00:00Z', 
        total: 1200.00,
        estado: "ENVIADA",
        moneda: 'USD',
        subtotal: 1200,
        impuestos: 0,
        items: [
            { orden_compra_id: 1, id: 1, producto_id: 1, cantidad: 10, precio_unitario: 100 },
            { orden_compra_id: 1, id: 2, producto_id: 2, cantidad: 5, precio_unitario: 40 }
        ]
    },
];

export const ordenesServicio: OrdenServicio[] = [
    { id: 1, folio: 'OS-2024-001', fecha: '2024-07-30T12:00:00Z', cliente_id: 1, equipo_id: 1, estado: 'EN_REPARACION', tecnico_id: 2 },
    { id: 2, folio: 'OS-2024-002', fecha: '2024-07-31T10:00:00Z', cliente_id: 2, equipo_id: 2, estado: 'DIAGNOSTICO', tecnico_id: 2 },
];


// Funciones "simuladas" para obtener datos
export const getUsuarios = (): Usuario[] => usuarios;
export const getRoles = (): Rol[] => roles;
export const getEmpleados = (): Empleado[] => empleados;
export const getProveedores = (): Proveedor[] => proveedores;
export const getClientes = (): Cliente[] => clientes;
export const getProductos = (): Producto[] => productos;
export const getAlmacenes = (): Almacen[] => almacenes;
export const getOrdenesCompra = (): OrdenCompra[] => ordenesCompra;
export const getOrdenesServicio = (): OrdenServicio[] => ordenesServicio;
