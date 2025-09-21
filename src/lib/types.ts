

// ============================================================
//  Sistema: Administración de Taller de Smartphones (ATS)
//  Versión de Tipos: 1.0 (Basado en esquema MySQL)
// ============================================================

// --------------------
// 1) SEGURIDAD
// --------------------
export type Usuario = {
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

export type Rol = {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: Permiso[]; // Poblado después
};

export type Permiso = {
  id: number;
  clave: string; // e.g., 'ventas.crear'
  modulo: string;
  descripcion?: string;
};

// --------------------
// 2) CATÁLOGOS
// --------------------
export type Marca = {
  id: number;
  nombre: string;
  pais_origen?: string;
  sitio_web?: string;
};

export type Modelo = {
  id: number;
  marca_id: number;
  nombre: string;
  anio?: number;
};

export type Version = {
  id: number;
  modelo_id: number;
  nombre: string;
  notas?: string;
};

export type CategoriaProducto = {
  id: number;
  nombre: string;
  tipo: "EQUIPO" | "REFACCION" | "ACCESORIO" | "HERRAMIENTA" | "SERVICIO";
};

export type Producto = {
  id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  marca_id?: number;
  modelo_id?: number;
  version_id?: number;
  unidad: string; // e.g., 'PZA'
  activo: boolean;
  es_serie: boolean;
  tipo: string;
  precio_lista: number;
  costo_promedio: number;
  stock_min?: number;
  stock_max?: number;
  stock_actual?: number;
};

export type Herramienta = {
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

export type ProductoSerie = {
  id: number;
  producto_id: number;
  numero_serie: string;
  estado: "DISPONIBLE" | "VENDIDO" | "ASIGNADO" | "EN_SERVICIO" | "BAJA";
};

// --------------------
// 3) EMPLEADOS
// --------------------
export type Empleado = {
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
export type Cliente = {
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

export type Proveedor = {
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
export type Almacen = {
  id: number;
  clave: string;
  nombre: string;
  direccion?: string;
  tipo: "PRINCIPAL" | "SUCURSAL" | "BODEGA" | "TRANSITO";
  secciones?: Seccion[];
};

export type Seccion = {
  id: number;
  almacen_id: number;
  clave: string;
  nombre: string;
  lotes?: Lote[];
};

export type Lote = {
  id: number;
  producto_id: number;
  almacen_id: number;
  seccion_id: number;
  codigo_lote: string;
  fecha_caducidad?: string;
  cantidad: number;
};

export type MovimientoInventario = {
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


export type OrdenCompra = {
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

export type OrdenCompraDetalle = {
    id: number;
    orden_compra_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
};

export type RecepcionCompra = {
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
export type Presupuesto = {
  id: number;
  folio: string;
  fecha: string;
  cliente_id: number;
  total: number;
  estado: "BORRADOR" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "VENCIDO";
};

export type Cotizacion = {
  id: number;
  folio: string;
  fecha: string;
  cliente_id: number;
  cliente_nombre: string;
  total: number;
  estado: 'GENERADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
}

export type EquipoTaller = {
  id: number;
  cliente_id: number;
  marca_id?: number;
  modelo_id?: number;
  imei?: string;
  numero_serie?: string;
  color?: string;
  accesorios?: string;
  condicion?: string;
};

export type OrdenServicio = {
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

export type Venta = {
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
export type Pago = {
  id: number;
  fecha: string;
  monto: number;
  metodo: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "OTRO";
  venta_id?: number;
  orden_compra_id?: number;
};

export type CuentaPorCobrar = {
    id: number;
    cliente_id: number;
    venta_id: number;
    fecha_emision: string;
    fecha_venc: string;
    saldo: number;
    estado: "ABIERTA" | "PARCIAL" | "CERRADA" | "VENCIDA";
};

export type CuentaPorPagar = {
    id: number;
    proveedor_id: number;
    orden_compra_id: number;
    fecha_emision: string;
    fecha_venc: string;
    saldo: number;
    estado: "ABIERTA" | "PARCIAL" | "CERRADA" | "VENCIDA";
};

export type Gasto = {
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
export type SolicitudInterna = {
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
export type Bitacora = {
  id: number;
  fecha: string; // ISO 8601 date string
  usuario_id: number;
  accion: string; // e.g., 'CREACIÓN DE VENTA', 'LOGIN', 'AJUSTE DE INVENTARIO'
  descripcion: string;
  referencia_id?: number; // e.g., ID de la venta, del producto, etc.
  modulo?: string; // e.g., 'Ventas', 'Inventario'
};
