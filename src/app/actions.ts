"use server";

import { suggestStockLevels } from "@/ai/flows/stock-level-suggestions";
import { getProductos } from "@/lib/data";
import type { Producto, MovimientoInventario } from "@/lib/types";

export async function getAiSuggestionAction(
  itemId: string
): Promise<{ suggestedLevel: number; reasoning: string } | { error: string }> {
  const inventory = getProductos();
  const item = inventory.find((i) => String(i.id) === itemId);

  if (!item) {
    return { error: "Artículo no encontrado." };
  }

  // TODO: Implementar la obtención de registros de auditoría reales
  // Por ahora, simularemos algunos datos para que la función de IA no falle.
  const simulatedLogs: MovimientoInventario[] = [
    { id: 1, fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'ENTRADA', referencia: 'OC-001', producto_id: item.id, cantidad: 50, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1},
    { id: 2, fecha: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-001', producto_id: item.id, cantidad: -5, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 3, fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-002', producto_id: item.id, cantidad: -10, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 4, fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-003', producto_id: item.id, cantidad: -8, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 5, fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'ENTRADA', referencia: 'OC-002', producto_id: item.id, cantidad: 30, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 6, fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-004', producto_id: item.id, cantidad: -12, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
  ];
  const itemLogs = simulatedLogs.filter((log) => log.producto_id === item.id);

  if (itemLogs.length < 2) {
    return {
      error: "No hay suficientes datos históricos para hacer una sugerencia.",
    };
  }

  const historicalData = itemLogs
    .map(
      (log) =>
        `Fecha: ${new Date(log.fecha).toISOString().split("T")[0]}, Cantidad: ${
          log.cantidad
        }, Tipo: ${log.tipo}`
    )
    .join("; ");

  try {
    const suggestion = await suggestStockLevels({
      location: "Almacén Principal", // TODO: Usar ubicación real
      objectType: item.sku,
      historicalData,
    });
    return suggestion;
  } catch (error) {
    console.error(error);
    return { error: "No se pudo obtener la sugerencia de la IA." };
  }
}
