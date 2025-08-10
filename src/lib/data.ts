import type { InventoryItem, MovementLog } from "./types";

const now = new Date();

let inventory: InventoryItem[] = [
  { id: '1', name: 'iPhone 15 Screen', type: 'Part', location: 'Tablero', quantity: 15, substate: 'New', usage: 'Repair' },
  { id: '2', name: 'USB-C Cable', type: 'Accessory', location: 'Vitrina', quantity: 50, substate: 'New', usage: 'Sale' },
  { id: '3', name: 'Prepaid SIM Card', type: 'SIM', location: 'Estaciones', quantity: 200, substate: 'Active', usage: 'Activation' },
  { id: '4', name: 'Samsung Galaxy S24', type: 'Equipment', location: 'Almacén', quantity: 5, substate: 'Refurbished', usage: 'Loaner' },
  { id: '5', name: 'iPhone 15 Battery', type: 'Part', location: 'Tablero', quantity: 4, substate: 'New', usage: 'Repair' },
  { id: '6', name: 'Fast Charger', type: 'Accessory', location: 'Vitrina', quantity: 30, substate: 'New', usage: 'Sale' },
  { id: '7', name: 'Postpaid SIM Card', type: 'SIM', location: 'Estaciones', quantity: 8, substate: 'Active', usage: 'Activation' },
  { id: '8', name: 'iPhone 14', type: 'Equipment', location: 'Almacén', quantity: 0, substate: 'New', usage: 'Sale' },
];

let auditLogs: MovementLog[] = [
    { id: 'log1', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'iPhone 15 Screen', itemType: 'Part', quantityChange: 20, origin: 'Supplier', destination: 'Tablero', reason: 'Initial Stock' },
    { id: 'log2', timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), user: 'tech1', itemName: 'iPhone 15 Screen', itemType: 'Part', quantityChange: -5, origin: 'Tablero', destination: 'Repair Bay', reason: 'Sale' },
    { id: 'log3', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'iPhone 15 Battery', itemType: 'Part', quantityChange: 10, origin: 'Supplier', destination: 'Tablero', reason: 'Initial Stock' },
    { id: 'log4', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'tech2', itemName: 'iPhone 15 Battery', itemType: 'Part', quantityChange: -6, origin: 'Tablero', destination: 'Repair Bay', reason: 'Sale' },
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
