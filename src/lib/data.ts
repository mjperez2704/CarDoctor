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
    nombre: 'Admin Principal',
    apellido_p: 'System',
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
    nombre: 'Juan Pérez',
    apellido_p: 'Técnico',
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
    apellido_p: 'Ventas',
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
const providers = [
    { id: 'PROV-001', name: 'Partes Express S.A. de C.V.'},
    { id: 'PROV-002', name: 'Accesorios Móviles GAMA'},
];
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
// CATÁLOGOS
// --------------------
export const marcas: Marca[] = [
  { id: 1, nombre: 'Apple', pais_origen: 'USA' },
  { id: 2, nombre: 'Samsung', pais_origen: 'Corea del Sur' },
  { id: 3, nombre: 'Xiaomi', pais_origen: 'China' },
];

export const modelos: Modelo[] = [
  { id: 1, marca_id: 1, nombre: 'iPhone 15', anio: 2023 },
  { id: 2, marca_id: 1, nombre: 'iPhone 15 Pro', anio: 2023 },
  { id: 3, marca_id: 2, nombre: 'Galaxy S24', anio: 2024 },
  { id: 4, marca_id: 2, nombre: 'Galaxy Z Fold 5', anio: 2023 },
  { id: 5, marca_id: 3, nombre: 'Redmi Note 12', anio: 2023 },
];

// --------------------
// PRODUCTOS
// --------------------
export const productos: Producto[] = [
  { id: 1, sku: 'PAR-IP15-PAN', nombre: 'Pantalla iPhone 15', categoria_id: 2, marca_id: 1, modelo_id: 1, activo: true, es_serie: false, precio_lista: 150.00, costo_promedio: 100.00, unidad: 'PZA' },
  { id: 2, sku: 'ACC-CAB-USBC', nombre: 'Cable USB-C 1m', categoria_id: 3, activo: true, es_serie: false, precio_lista: 25.00, costo_promedio: 10.00, unidad: 'PZA' },
  { id: 3, sku: 'EQU-SAM-S24', nombre: 'Samsung Galaxy S24', categoria_id: 1, marca_id: 2, modelo_id: 3, activo: true, es_serie: true, precio_lista: 1200.00, costo_promedio: 950.00, unidad: 'PZA' },
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
    },
     {
        id: 2,
        clave: 'VITRINA',
        nombre: 'Vitrina de Exhibición',
        tipo: 'SUCURSAL',
        secciones: [
            { id: 3, almacen_id: 2, clave: 'EX-GEN', nombre: 'Exhibidor General' },
        ]
    }
];

// --------------------
// COMPRAS Y VENTAS
// --------------------
export const purchases: Purchase[] = [
  {
    id: "OC-2024-001",
    providerId: "PROV-001",
    date: "2024-07-28",
    total: 1200.0,
    status: "Pendiente",
    items: [
      { name: "Pantalla iPhone 15", quantity: 10, price: 100.0 },
      { name: "Batería Samsung S22", quantity: 5, price: 40.0 },
    ],
  },
  {
    id: "OC-2024-002",
    providerId: "PROV-002",
    date: "2024-07-29",
    total: 350.0,
    status: "Recibida Parcial",
    items: [
        { name: "Cable USB-C 1m", quantity: 50, price: 5.0},
        { name: "Cargador 30W", quantity: 20, price: 10.0}
    ]
  },
];

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

// --------------------
// SOLICITUDES INTERNAS
// --------------------
export const solicitudesInternas: SolicitudInterna[] = [
  {
    id: 1,
    folio: "SOL-2024-001",
    solicitante_id: 3,
    fecha_solicitud: "2024-07-25T09:00:00Z",
    tipo: "COMPRA",
    descripcion: "Solicitud de compra de 50 protectores de pantalla para iPhone 15.",
    estado: "APROBADA",
    aprobador_id: 1,
    fecha_respuesta: "2024-07-25T11:00:00Z",
    monto: 250.00,
    comentarios: "Aprobado. Proceder con la compra al proveedor habitual."
  },
  {
    id: 2,
    folio: "SOL-2024-002",
    solicitante_id: 2,
    fecha_solicitud: "2024-07-28T14:30:00Z",
    tipo: "PERMISO",
    descripcion: "Solicitud de permiso por asunto personal para el día 2024-08-05.",
    estado: "PENDIENTE",
  },
  {
    id: 3,
    folio: "SOL-2024-003",
    solicitante_id: 2,
    fecha_solicitud: "2024-07-29T10:00:00Z",
    tipo: "GASTO",
    descripcion: "Reembolso por compra de herramienta menor (pinzas antiestáticas).",
    estado: "RECHAZADA",
    aprobador_id: 1,
    fecha_respuesta: "2024-07-29T12:00:00Z",
    monto: 15.00,
    comentarios: "Rechazado. La compra de herramientas debe seguir el proceso de solicitud de compra, no de reembolso."
  },
];

// --------------------
// BITÁCORA
// --------------------
export const bitacora: Bitacora[] = [
  { id: 1, fecha: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), usuario_id: 1, accion: 'LOGIN', descripcion: 'Inicio de sesión exitoso.' },
  { id: 2, fecha: new Date(now.getTime() - 90 * 60 * 1000).toISOString(), usuario_id: 3, accion: 'CREACIÓN DE VENTA', descripcion: 'Se creó la venta con folio VTA-2024-088 para el cliente "Cliente Final".' },
  { id: 3, fecha: new Date(now.getTime() - 85 * 60 * 1000).toISOString(), usuario_id: 2, accion: 'MOVIMIENTO DE INVENTARIO', descripcion: 'Traslado de 2 unidades de "Pantalla iPhone 15" del Almacén Principal al mostrador.' },
  { id: 4, fecha: new Date(now.getTime() - 70 * 60 * 1000).toISOString(), usuario_id: 1, accion: 'APROBACIÓN DE COMPRA', descripcion: 'Se aprobó la orden de compra OC-2024-001 al proveedor "Partes Express".' },
  { id: 5, fecha: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), usuario_id: 3, accion: 'CREACIÓN DE CLIENTE', descripcion: 'Se dio de alta al nuevo cliente "Innovatech Solutions".' },
  { id: 6, fecha: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), usuario_id: 1, accion: 'AJUSTE DE INVENTARIO', descripcion: 'Ajuste positivo de +1 unidad para el SKU "ACC-CAB-USBC" por conteo físico.' },
  { id: 7, fecha: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), usuario_id: 2, accion: 'ACTUALIZACIÓN DE ESTADO', descripcion: 'La orden de servicio OS-2024-001 cambió a estado "LISTO PARA ENTREGA".' },
  { id: 8, fecha: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), usuario_id: 1, accion: 'ACTUALIZACIÓN DE ROL', descripcion: 'Se modificaron los permisos para el rol "Vendedor".' },
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
export const getAlmacenes = (): Almacen[] => almacenes;
export const getPurchases = (): Purchase[] => purchases;
export const getOrdenesCompra = (): OrdenCompra[] => ordenesCompra;
export const getOrdenesServicio = (): OrdenServicio[] => ordenesServicio;
export const getSolicitudesInternas = (): SolicitudInterna[] => solicitudesInternas;
export const getBitacora = (): Bitacora[] => bitacora;


// Helper para obtener todos los permisos (simulado)
export const getAllPermissions = (): Permiso[] => {
    // En una aplicación real, esto vendría de una tabla de permisos.
    // Aquí simulamos un conjunto de permisos posibles.
    const modulos = ['Usuarios', 'Roles', 'Clientes', 'Inventario', 'Ventas', 'Reparaciones', 'Compras', 'Reportes'];
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    let permisos: Permiso[] = [];
    let id = 1;
    modulos.forEach(modulo => {
        acciones.forEach(accion => {
            permisos.push({
                id: id++,
                modulo: modulo,
                clave: `${modulo.toLowerCase()}.${accion}`,
                descripcion: `${accion.charAt(0).toUpperCase() + accion.slice(1)} ${modulo}`
            });
        });
    });
    return permisos;
};
