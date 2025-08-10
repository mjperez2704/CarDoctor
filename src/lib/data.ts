import type { InventoryItem, MovementLog } from "./types";

const now = new Date();

let inventory: InventoryItem[] = [
  { id: '1', name: 'Pantalla iPhone 15', type: 'Parte', location: 'Tablero', quantity: 15, substate: 'Nuevo', usage: 'Reparación' },
  { id: '2', name: 'Cable USB-C', type: 'Accesorio', location: 'Vitrina', quantity: 50, substate: 'Nuevo', usage: 'Venta' },
  { id: '3', name: 'SIM Prepago', type: 'SIM', location: 'Estaciones', quantity: 200, substate: 'Activo', usage: 'Activación' },
  { id: '4', name: 'Samsung Galaxy S24', type: 'Equipo', location: 'Almacén', quantity: 5, substate: 'Reacondicionado', usage: 'Préstamo' },
  { id: '5', name: 'Batería iPhone 15', type: 'Parte', location: 'Tablero', quantity: 4, substate: 'Nuevo', usage: 'Reparación' },
  { id: '6', name: 'Cargador Rápido', type: 'Accesorio', location: 'Vitrina', quantity: 30, substate: 'Nuevo', usage: 'Venta' },
  { id: '7', name: 'SIM Postpago', type: 'SIM', location: 'Estaciones', quantity: 8, substate: 'Activo', usage: 'Activación' },
  { id: '8', name: 'iPhone 14', type: 'Equipo', location: 'Almacén', quantity: 0, substate: 'Nuevo', usage: 'Venta' },
];

let auditLogs: MovementLog[] = [
    { id: 'log1', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'Pantalla iPhone 15', itemType: 'Parte', quantityChange: 20, origin: 'Proveedor', destination: 'Tablero', reason: 'Stock Inicial' },
    { id: 'log2', timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), user: 'tech1', itemName: 'Pantalla iPhone 15', itemType: 'Parte', quantityChange: -5, origin: 'Tablero', destination: 'Bahía de Reparación', reason: 'Venta' },
    { id: 'log3', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'Batería iPhone 15', itemType: 'Parte', quantityChange: 10, origin: 'Proveedor', destination: 'Tablero', reason: 'Stock Inicial' },
    { id: 'log4', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'tech2', itemName: 'Batería iPhone 15', itemType: 'Parte', quantityChange: -6, origin: 'Tablero', destination: 'Bahía de Reparación', reason: 'Venta' },
];

export const getInventory = (): InventoryItem[] => inventory;

export const getAuditLogs = (): MovementLog[] => auditLogs;

export const addMovement = (
  item: InventoryItem,
  quantityChange: number,
  movementDetails: Omit<MovementLog, 'id' | 'timestamp' | 'itemName' | 'itemType' | 'quantityChange'>
): { updatedItem: InventoryItem, newLog: MovementLog } => {
  const updatedItem = { ...item, quantity: item.quantity + quantityChange };
  
  inventory = inventory.map(i => i.id === item.id ? updatedItem : i);

  const newLog: MovementLog = {
    id: `log${Date.now()}`,
    timestamp: new Date(),
    itemName: item.name,
    itemType: item.type,
    quantityChange,
    ...movementDetails,
  };

  auditLogs.unshift(newLog);

  return { updatedItem, newLog };
};
