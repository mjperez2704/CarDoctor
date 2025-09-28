// src/lib/types.ts

// Importamos RowDataPacket para la compatibilidad con mysql2
import type { RowDataPacket } from 'mysql2';

// ============================================================
//  Sistema: Administración de Taller Mecánico
//  Versión de Tipos: 1.2 (Ajuste de tipo Permiso)
// ============================================================


// --------------------
// 0) LOGOS Y VEHICLES
//---------------------
export type Logos = {
    id: number;
    nombre: string;
    src: string;
}

export type ImagesVehicles = {
    id: number;
    nombre: string;
    src: string;
}

// --------------------
// 1) SEGURIDAD
// --------------------
export interface Usuario extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    telefono?: string;
    password_hash: string;
    nombre: string;
    apellido_p?: string;
    apellido_m?: string;
    avatar_url?: string;
    activo: boolean;
    ultimo_acceso?: string; // ISO 8601 date string
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    roles?: Rol[]; // Poblado después
};

export interface Rol extends RowDataPacket {
    id: number;
    nombre: string;
    descripcion: string;
    permisos?: Permiso[]; // Poblado después
};

// CORRECCIÓN: Se elimina "extends RowDataPacket" porque este tipo se usa para una lista estática
export interface Permiso {
    id: number;
    clave: string; // e.g., 'ventas.crear'
    modulo: string;
    descripcion?: string;
};

// --------------------
// 2) CATÁLOGOS
// --------------------
export interface Marca extends RowDataPacket {
    id: number;
    nombre: string;
    pais_origen?: string;
    sitio_web?: string;
};

export interface Modelo extends RowDataPacket {
    id: number;
    marca_id: number;
    nombre: string;
    anio?: number;
};

export interface Version extends RowDataPacket {
    id: number;
    modelo_id: number;
    nombre: string;
    notas?: string;
};

export interface CategoriaProducto extends RowDataPacket {
    id: number;
    nombre: string;
    tipo: "EQUIPO" | "REFACCION" | "ACCESORIO" | "HERRAMIENTA" | "SERVICIO";
};

export interface Producto extends RowDataPacket {
    id: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    categoria_id: number;
    marca_id?: number;
    proveedor_id: number;
    proveedor_alt_id: number;
    clave_proveedor?: string;
    unidad: string; // e.g., 'PZA'
    activo: boolean;
    es_servicio: boolean;
    es_inventariable: boolean;
    es_bloqueado: boolean;
    es_parte_kit: boolean;
    kit_sku?: string;
    precio_lista: number;
    costo_promedio: number;
    stock_min?: number;
    stock_max?: number;
    stock_actual?: number;
    tiempo_entrega_dias?: number;
    compra_minima?: number;
    usa_caducidad?: boolean;
    dias_caducidad?: number;
};

export interface Herramienta extends RowDataPacket {
    id: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    marca?: string;
    modelo?: string;
    numero_serie?: string;
    estado: "DISPONIBLE" | "ASIGNADA" | "EN_MANTENIMIENTO" | "DE_BAJA";
    asignada_a_empleado_id?: number;
    fecha_compra?: string;
    costo?: number;
};

// --------------------
// 3) EMPLEADOS
// --------------------
export interface Empleado extends RowDataPacket {
    id: number;
    codigo?: string;
    nombre: string;
    apellido_p: string;
    apellido_m?: string;
    curp?: string;
    rfc?: string;
    nss?: string;
    email?: string;
    telefono?: string;
    puesto?: string;
    fecha_ingreso?: string; // ISO 8601 date string
    fecha_baja?: string; // ISO 8601 date string
    salario_diario?: number;
    usuario_id?: number;
    slug_vendedor?: string;
    meta_venta_mensual?: number;
};

// --------------------
// 4) CLIENTES / PROVEEDORES
// --------------------
export interface Cliente extends RowDataPacket {
    id: number;
    tipo_id: number; // FINAL, EMPRESA
    razon_social: string;
    rfc?: string;
    email?: string;
    telefono?: string;
    whatsapp?: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    pais?: string;
    cp?: string;
    fecha_registro: string;
};

export interface Proveedor extends RowDataPacket {
    id: number;
    razon_social: string;
    rfc?: string;
    email?: string;
    telefono?: string;
    whatsapp?: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    pais?: string;
    cp?: string;
    dias_credito?: number;
};

// --------------------
// 5) ALMACÉN / INVENTARIO
// --------------------
export interface Almacen extends RowDataPacket {
    id: number;
    clave: string;
    nombre: string;
    direccion?: string;
    tipo: "PRINCIPAL" | "SUCURSAL" | "BODEGA" | "TRANSITO";
    secciones?: Seccion[];
};

export interface Seccion extends RowDataPacket {
    id: number;
    almacen_id: number;
    clave: string;
    nombre: string;
    lotes?: Lote[];
};

export interface Lote extends RowDataPacket {
    id: number;
    producto_id: number;
    almacen_id: number;
    seccion_id: number;
    codigo_lote: string;
    fecha_caducidad?: string;
    cantidad: number;
};

export interface MovimientoInventario extends RowDataPacket {
    id: number;
    fecha: string;
    tipo:
        | "ENTRADA"
        | "SALIDA"
        | "AJUSTE_POSITIVO"
        | "AJUSTE_NEGATIVO"
        | "TRASLADO_SALIDA"
        | "TRASLADO_ENTRADA"
        | "DEVOLUCION_ENTRADA"
        | "DEVOLUCION_SALIDA";
    referencia: string;
    producto_id: number;
    lote_id?: number;
    almacen_id: number;
    cantidad: number;
    costo_unit: number;
    usuario_id?: number;
};

// --------------------
// 6) COMPRAS
// --------------------
export type Purchase = {
    id: string;
    providerId: string;
    date: string;
    total: number;
    status: "Pendiente" | "Recibida Parcial" | "Recibida Completa";
    items: {
        sku: string;
        name: string;
        quantity: number;
        price: number;
    }[];
};

export type ReceptionItem = {
    sku: string;
    name: string;
    orderedQuantity: number;
    unitCost: number;
    receivedQuantity: number;
    isComplete: boolean;
    location?: string; // e.g., "Almacén A / Sección 3 / Lote 123"
    notes?: string;
};

export interface OrdenCompra extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    proveedor_id: number;
    estado: "BORRADOR" | "ENVIADA" | "PARCIAL" | "RECIBIDA" | "CANCELADA";
    moneda: string;
    subtotal: number;
    impuestos: number;
    total: number;
    items?: OrdenCompraDetalle[];
};

export interface OrdenCompraDetalle extends RowDataPacket {
    id: number;
    orden_compra_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
};

export interface RecepcionCompra extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    orden_compra_id?: number;
    proveedor_id: number;
    almacen_id: number;
    estado: "BORRADOR" | "PARCIAL" | "COMPLETA" | "CANCELADA";
};

// --------------------
// 7) VENTAS / SERVICIOS
// --------------------
export interface Presupuesto extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    total: number;
    estado: "BORRADOR" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "VENCIDO";
};

export interface Cotizacion extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    cliente_nombre: string;
    total: number;
    estado: 'GENERADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
}

export interface EquipoTaller extends RowDataPacket {
    id: number;
    cliente_id: number;
    marca_id?: number;
    modelo_id?: number;
    imei?: string;
    numero_serie?: string;
    color?: string;
    accesorios?: string;
    condicion?: string;
    // Nuevos campos para el vehículo
    marca: string; // Nombre de la marca
    modelo: string; // Nombre del modelo
    anio: number;
    placas: string;
};

export interface OrdenServicio extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    equipo_id: number;
    diagnostico_ini?: string;
    estado:
        | "RECEPCION"
        | "DIAGNOSTICO"
        | "AUTORIZACION"
        | "EN_REPARACION"
        | "PRUEBAS"
        | "LISTO"
        | "ENTREGADO"
        | "CANCELADO";
    tecnico_id?: number;
};

export interface Venta extends RowDataPacket {
    id: number;
    folio: string;
    fecha: string;
    cliente_id: number;
    orden_id?: number;
    total: number;
    estado: "BORRADOR" | "PAGADA" | "PARCIAL" | "CANCELADA";
};

// --------------------
// 8) FINANZAS / ADMINISTRACIÓN
// --------------------
export interface Pago extends RowDataPacket {
    id: number;
    fecha: string;
    monto: number;
    metodo: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "OTRO";
    venta_id?: number;
    orden_compra_id?: number;
};

export interface CuentaPorCobrar extends RowDataPacket {
    id: number;
    cliente_id: number;
    venta_id: number;
    fecha_emision: string;
    fecha_venc: string;
    saldo: number;
    estado: "ABIERTA" | "PARCIAL" | "CERRADA" | "VENCIDA";
};

export interface CuentaPorPagar extends RowDataPacket {
    id: number;
    proveedor_id: number;
    orden_compra_id: number;
    fecha_emision: string;
    fecha_venc: string;
    saldo: number;
    estado: "ABIERTA" | "PARCIAL" | "CERRADA" | "VENCIDA";
};

export interface Gasto extends RowDataPacket {
    id: number;
    fecha: string;
    categoria: string;
    descripcion?: string;
    monto: number;
    empleado_id: number;
    autorizador_id?: number;
    estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
};

// --------------------
// 9) COMUNICACIÓN INTERNA
// --------------------
export interface SolicitudInterna extends RowDataPacket {
    id: number;
    folio: string;
    solicitante_id: number;
    aprobador_id?: number;
    fecha_solicitud: string;
    fecha_respuesta?: string;
    tipo: "COMPRA" | "GASTO" | "VACACIONES" | "PERMISO" | "OTRO";
    descripcion: string;
    estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA";
    monto?: number;
    comentarios?: string;
};

// --------------------
// 10) BITÁCORA
// --------------------
export interface Bitacora extends RowDataPacket {
    id: number;
    fecha: string; // ISO 8601 date string
    usuario_id: number;
    accion: string; // e.g., 'CREACIÓN DE VENTA', 'LOGIN', 'AJUSTE DE INVENTARIO'
    descripcion: string;
    referencia_id?: number; // e.g., ID de la venta, del producto, etc.
    modulo?: string; // e.g., 'Ventas', 'Inventario'
};
