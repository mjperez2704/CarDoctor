
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
  Lote,
  Marca,
  Modelo,
  SolicitudInterna,
  Purchase,
  Bitacora,
  Gasto,
  Herramienta,
} from "./types";

const now = new Date();

// ============================================================
// Datos de Muestra (Mock Data) para Taller Mecánico
// ============================================================

// --------------------
// SEGURIDAD
// --------------------
export const roles: Rol[] = [
  { id: 1, nombre: 'Admin', descripcion: 'Acceso total al sistema' },
  { id: 2, nombre: 'Mecánico', descripcion: 'Acceso a órdenes de servicio e inventario' },
  { id: 3, nombre: 'Asesor de Servicio', descripcion: 'Acceso a clientes, vehículos y cotizaciones' },
];

export const usuarios: Usuario[] = [
  { 
    id: 1, 
    username: 'admin',
    email: 'admin@example.com', 
    nombre: 'Admin Principal',
    apellido_p: 'System',
    password_hash: 'hashed_password',
    activo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    roles: [roles[0]]
  },
  { 
    id: 2, 
    username: 'jperez',
    email: 'juan.perez@example.com', 
    nombre: 'Juan Pérez',
    apellido_p: 'Mecánico',
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
    nombre: 'Maria Rodriguez',
    apellido_p: 'Asesora',
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
    { id: 2, nombre: 'Juan', apellido_p: 'Pérez', email: 'juan.perez@example.com', puesto: 'Mecánico A', usuario_id: 2 },
    { id: 3, nombre: 'Maria', apellido_p: 'Rodriguez', email: 'maria.rodriguez@example.com', puesto: 'Asesora de Servicio', usuario_id: 3, slug_vendedor: 'MARIA', meta_venta_mensual: 25000 },
    { id: 4, nombre: 'Luisa', apellido_p: 'Martinez', email: 'luisa.martinez@example.com', puesto: 'Ejecutiva de Ventas', usuario_id: 4, slug_vendedor: 'LUISA', meta_venta_mensual: 30000 },
];

// --------------------
// CONTACTOS
// --------------------
export const proveedores: Proveedor[] = [
    { id: 1, razon_social: 'Refaccionaria del Centro S.A. de C.V.', rfc: 'RCS880101ABC', email: 'contacto@refaccionariacentro.com', dias_credito: 30 },
    { id: 2, razon_social: 'Autopartes del Norte', rfc: 'ADNA920505XYZ', email: 'ventas@autonorte.com', dias_credito: 0 },
];

export const clientes: Cliente[] = [
    { id: 1, tipo_id: 1, razon_social: 'Carlos Sánchez', rfc: 'SAC850404LFG', email: 'carlos.sanchez@email.com', fecha_registro: '2023-10-15T10:00:00Z', telefono: '55-1234-5678' },
    { id: 2, tipo_id: 1, razon_social: 'Laura Gómez', rfc: 'GOL791120HJC', email: 'laura.g@email.com', fecha_registro: '2023-11-20T11:30:00Z', telefono: '55-8765-4321' },
    { id: 3, tipo_id: 2, razon_social: 'Transportes Rápidos S.A.', rfc: 'TRA120220E45', email: 'contacto@transportesrapidos.com', fecha_registro: '2024-01-05T15:00:00Z', telefono: '55-5555-5555' },
];

// --------------------
// CATÁLOGOS
// --------------------
export const marcas: Marca[] = [
  { id: 1, nombre: 'Nissan', pais_origen: 'Japón' },
  { id: 2, nombre: 'Volkswagen', pais_origen: 'Alemania' },
  { id: 3, nombre: 'Ford', pais_origen: 'USA' },
  { id: 4, nombre: 'Chevrolet', pais_origen: 'USA' },
];

export const modelos: Modelo[] = [
  { id: 1, marca_id: 1, nombre: 'Versa', anio: 2020 },
  { id: 2, marca_id: 2, nombre: 'Jetta', anio: 2019 },
  { id: 3, marca_id: 3, nombre: 'Mustang', anio: 2022 },
  { id: 4, marca_id: 4, nombre: 'Aveo', anio: 2021 },
];

export const ordenesServicio: OrdenServicio[] = [
    { id: 1, folio: 'OS-2024-001', fecha: '2024-07-28T10:00:00Z', cliente_id: 1, equipo_id: 1, diagnostico_ini: 'Ruido en el motor al acelerar.', estado: 'DIAGNOSTICO', tecnico_id: 2 },
    { id: 2, folio: 'OS-2024-002', fecha: '2024-07-29T12:30:00Z', cliente_id: 2, equipo_id: 2, diagnostico_ini: 'Falla en frenos, rechinan mucho.', estado: 'EN_REPARACION', tecnico_id: 2 },
    { id: 3, folio: 'OS-2024-003', fecha: '2024-07-30T09:00:00Z', cliente_id: 1, equipo_id: 3, diagnostico_ini: 'Servicio de mantenimiento general (10,000km).', estado: 'RECEPCION' },
];

// --------------------
// PRODUCTOS (REFACCIONES Y SERVICIOS)
// --------------------
export const productos: Producto[] = [
  { id: 1, sku: 'FIL-ACE-01', nombre: 'Filtro de Aceite Motor 1.6L', categoria_id: 2, activo: true, es_serie: false, precio_lista: 15.00, costo_promedio: 8.00, unidad: 'PZA', stock_minimo: 10, stock_maximo: 50 },
  { id: 2, sku: 'BAL-DEL-05', nombre: 'Balatas Delanteras Cerámicas', categoria_id: 2, activo: true, es_serie: false, precio_lista: 80.00, costo_promedio: 45.00, unidad: 'JGO', stock_minimo: 5, stock_maximo: 20 },
  { id: 3, sku: 'SRV-AFIN-01', nombre: 'Servicio de Afinación Menor', categoria_id: 5, activo: true, es_serie: false, precio_lista: 150.00, costo_promedio: 0.00, unidad: 'SRV', stock_minimo: 0, stock_maximo: 0 },
  { id: 4, sku: 'ACE-MOT-5W30', nombre: 'Aceite Sintético 5W30', categoria_id: 2, activo: true, es_serie: false, precio_lista: 12.00, costo_promedio: 7.50, unidad: 'LT', stock_minimo: 24, stock_maximo: 100 },
];

// --------------------
// COMPRAS
// --------------------
export const purchases: Purchase[] = [
  { 
    id: "OC-2024-001",
    providerId: "1",
    date: new Date(now.setDate(now.getDate() - 5)).toISOString(),
    total: 950.00,
    status: "Pendiente",
    items: [
      { sku: 'FIL-ACE-01', name: 'Filtro de Aceite Motor 1.6L', quantity: 50, price: 8.00 },
      { sku: 'BAL-DEL-05', name: 'Balatas Delanteras Cerámicas', quantity: 10, price: 45.00 },
      { sku: 'ACE-MOT-5W30', name: 'Aceite Sintético 5W30', quantity: 10, price: 10.00 },
    ]
  },
  { 
    id: "OC-2024-002",
    providerId: "2",
    date: new Date(now.setDate(now.getDate() - 10)).toISOString(),
    total: 225.00,
    status: "Recibida Completa",
    items: [
       { sku: 'ACE-MOT-5W30', name: 'Aceite Sintético 5W30', quantity: 30, price: 7.50 },
    ]
  },
];

export const almacenes: Almacen[] = [
    { id: 1, clave: 'A-GRAL', nombre: 'Almacén General', tipo: 'PRINCIPAL', secciones: [
        { id: 1, almacen_id: 1, clave: 'REF-GEN', nombre: 'Refacciones Generales' },
        { id: 2, almacen_id: 1, clave: 'REF-MOT', nombre: 'Refacciones de Motor' },
    ]},
    { id: 2, clave: 'A-TALL', nombre: 'Almacén Taller', tipo: 'SUCURSAL', secciones: [
         { id: 3, almacen_id: 2, clave: 'HER-MEC', nombre: 'Herramienta Mecánica' },
    ]},
];

export const mockLotes: Lote[] = [
  { id: 1, almacen_id: 1, seccion_id: 1, producto_id: 1, codigo_lote: "LOTE-A1-001", cantidad: 8 },
  { id: 2, almacen_id: 1, seccion_id: 1, producto_id: 1, codigo_lote: "LOTE-A1-002", cantidad: 5 },
  { id: 3, almacen_id: 1, seccion_id: 2, producto_id: 2, codigo_lote: "LOTE-B1-001", cantidad: 4 },
  { id: 4, almacen_id: 2, seccion_id: 3, producto_id: 4, codigo_lote: "LOTE-C1-001", cantidad: 20 },
];


// Funciones "simuladas" para obtener datos
export const getUsuarios = (): Usuario[] => usuarios;
export const getRoles = (): Rol[] => roles;
export const getEmpleados = (): Empleado[] => empleados;
export const getProveedores = (): Proveedor[] => proveedores;
export const getClientes = (): Cliente[] => clientes;
export const getMarcas = (): Marca[] => marcas;
export const getModelos = (): Modelo[] => modelos;
export const getProductos = (): Producto[] => productos;
export const getOrdenesServicio = (): OrdenServicio[] => ordenesServicio;
export const getPurchases = (): Purchase[] => purchases;
export const getAlmacenes = (): Almacen[] => almacenes;
// --- Dejando estas funciones con datos vacíos por ahora ---
export const getHerramientas = (): Herramienta[] => [];
export const getOrdenesCompra = (): OrdenCompra[] => [];
export const getSolicitudesInternas = (): SolicitudInterna[] => [];
export const getBitacora = (): Bitacora[] => [];
export const getGastos = (): Gasto[] => [];


// Helper para obtener todos los permisos (simulado)
export const getAllPermissions = (): Permiso[] => {
    const modulos = ['Usuarios', 'Roles', 'Clientes', 'Inventario', 'Ordenes de Servicio', 'Compras', 'Reportes'];
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    let permisos: Permiso[] = [];
    let id = 1;
    modulos.forEach(modulo => {
        acciones.forEach(accion => {
            permisos.push({
                id: id++,
                modulo: modulo,
                clave: `${modulo.toLowerCase().replace(/ /g, '_')}.${accion}`,
                descripcion: `${accion.charAt(0).toUpperCase() + accion.slice(1)} ${modulo}`
            });
        });
    });
    return permisos;
};
