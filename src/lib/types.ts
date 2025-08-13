export type Role = "Admin" | "Técnico" | "Ventas";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Provider = {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type PurchaseItem = {
    name: string;
    quantity: number;
    price: number;
};

export type Purchase = {
  id: string;
  providerId: string;
  date: string;
  total: number;
  items: PurchaseItem[];
  status: "Pendiente" | "Recibida Parcial" | "Recibida Completa";
};

export type InventoryItem = {
  id: string;
  name: string;
  type: "Parte" | "Accesorio" | "SIM" | "Equipo";
  location: "Tablero" | "Vitrina" | "Estaciones" | "Almacén" | string; // Permitir ubicaciones personalizadas
  quantity: number;
  status: "Nuevo" | "Usado" | "Reacondicionado" | "Dañado";
  usage: "Reparación" | "Venta" | "Activación" | "Préstamo" | "Consumo Interno";
  stockType: "Stock" | "Sobre Pedido";
  brand?: string;
  lotId?: string; // Para vincular un artículo a un lote específico
  osId?: string;
};

export type MovementLog = {
  id:string;
  timestamp: Date;
  user: string;
  itemName: string;
  itemType: InventoryItem["type"];
  quantityChange: number;
  origin: string;
  destination: string;
  reason: string;
  osId?: string;
};

export type SectionRule = {
  type?: InventoryItem["type"][];
  status?: InventoryItem["status"][];
  usage?: InventoryItem["usage"][];
  stockType?: InventoryItem["stockType"][];
  brand?: string[];
};

export type Lot = {
  id: string;
  name: string;
  items: InventoryItem[];
};

export type Section = {
  id: string;
  name: string;
  rules: SectionRule;
  lots: Lot[];
};

export type Warehouse = {
  id: string;
  name: string;
  sections: Section[];
};

export type ReceptionItem = {
  name: string;
  orderedQuantity: number;
  unitCost: number;
  receivedQuantity: number;
  isComplete: boolean;
};
