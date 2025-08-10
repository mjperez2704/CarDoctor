export type InventoryItem = {
  id: string;
  name: string;
  type: "Parte" | "Accesorio" | "SIM" | "Equipo";
  location: "Tablero" | "Vitrina" | "Estaciones" | "Almacén";
  quantity: number;
  substate: string;
  usage: string;
  osId?: string;
};

export type MovementLog = {
  id: string;
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
