import type { InventoryItem, MovementLog, Warehouse, Employee, Role, Provider, Purchase } from "./types";

const now = new Date();

let employees: Employee[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
    { id: '2', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Técnico' },
    { id: '3', name: 'Maria Rodriguez', email: 'maria.rodriguez@example.com', role: 'Ventas' },
];

let providers: Provider[] = [
    { id: 'prov1', name: 'Partes Express', contactName: 'Carlos Sánchez', phone: '555-1234', email: 'contacto@partesexpress.com' },
    { id: 'prov2', name: 'Accesorios Móviles GAMA', contactName: 'Ana Gómez', phone: '555-5678', email: 'ventas@gama.com' },
];

let purchases: Purchase[] = [
    { 
        id: 'compra1', 
        providerId: 'prov1', 
        date: '2024-07-28', 
        total: 1200.00,
        items: [
            { name: 'Pantalla iPhone 15', quantity: 10, price: 100 },
            { name: 'Batería iPhone 15', quantity: 5, price: 40 }
        ]
    },
    { 
        id: 'compra2', 
        providerId: 'prov2', 
        date: '2024-07-25', 
        total: 850.50,
        items: [
            { name: 'Cable USB-C', quantity: 50, price: 10 },
            { name: 'Cargador Rápido', quantity: 15, price: 23.36 }
        ]
    },
];

let inventory: InventoryItem[] = [
  { id: '1', name: 'Pantalla iPhone 15', type: 'Parte', location: 'Tablero', quantity: 15, status: 'Nuevo', usage: 'Reparación', stockType: 'Stock', brand: 'Apple' },
  { id: '2', name: 'Cable USB-C', type: 'Accesorio', location: 'Vitrina', quantity: 50, status: 'Nuevo', usage: 'Venta', stockType: 'Stock', brand: 'Genérico' },
  { id: '3', name: 'SIM Prepago', type: 'SIM', location: 'Estaciones', quantity: 200, status: 'Nuevo', usage: 'Activación', stockType: 'Stock' },
  { id: '4', name: 'Samsung Galaxy S24', type: 'Equipo', location: 'Almacén', quantity: 5, status: 'Reacondicionado', usage: 'Préstamo', stockType: 'Stock', brand: 'Samsung' },
  { id: '5', name: 'Batería iPhone 15', type: 'Parte', location: 'Tablero', quantity: 4, status: 'Nuevo', usage: 'Reparación', stockType: 'Stock', brand: 'Apple' },
  { id: '6', name: 'Cargador Rápido', type: 'Accesorio', location: 'Vitrina', quantity: 30, status: 'Nuevo', usage: 'Venta', stockType: 'Stock', brand: 'Samsung' },
  { id: '7', name: 'SIM Postpago', type: 'SIM', location: 'Estaciones', quantity: 8, status: 'Nuevo', usage: 'Activación', stockType: 'Stock' },
  { id: '8', name: 'iPhone 14', type: 'Equipo', location: 'Almacén', quantity: 0, status: 'Nuevo', usage: 'Venta', stockType: 'Sobre Pedido', brand: 'Apple' },
];

let auditLogs: MovementLog[] = [
    { id: 'log1', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'Pantalla iPhone 15', itemType: 'Parte', quantityChange: 20, origin: 'Proveedor', destination: 'Tablero', reason: 'Stock Inicial' },
    { id: 'log2', timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), user: 'tech1', itemName: 'Pantalla iPhone 15', itemType: 'Parte', quantityChange: -5, origin: 'Tablero', destination: 'Bahía de Reparación', reason: 'Venta' },
    { id: 'log3', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), user: 'admin', itemName: 'Batería iPhone 15', itemType: 'Parte', quantityChange: 10, origin: 'Proveedor', destination: 'Tablero', reason: 'Stock Inicial' },
    { id: 'log4', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), user: 'tech2', itemName: 'Batería iPhone 15', itemType: 'Parte', quantityChange: -6, origin: 'Tablero', destination: 'Bahía de Reparación', reason: 'Venta' },
];

let warehouse: Warehouse[] = [
    {
        id: 'wh1',
        name: 'Almacén Principal',
        sections: [
            {
                id: 'sec1',
                name: 'Componentes Apple',
                rules: {
                    brand: ['Apple'],
                    type: ['Parte'],
                },
                lots: [
                    { id: 'lot1a', name: 'Lote A1', items: [] },
                    { id: 'lot1b', name: 'Lote A2', items: [] },
                ]
            },
            {
                id: 'sec2',
                name: 'Accesorios de Venta',
                rules: {
                    usage: ['Venta'],
                    type: ['Accesorio'],
                },
                lots: [
                    { id: 'lot2a', name: 'Lote B1', items: [] },
                ]
            }
        ]
    }
];

export const getEmployees = (): Employee[] => employees;
export const getProviders = (): Provider[] => providers;
export const getPurchases = (): Purchase[] => purchases;
export const getInventory = (): InventoryItem[] => inventory;
export const getAuditLogs = (): MovementLog[] => auditLogs;
export const getWarehouseData = (): Warehouse[] => warehouse;


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
