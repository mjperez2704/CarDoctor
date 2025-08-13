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
  const auditLogs: MovimientoInventario[] = []; 
  const itemLogs = auditLogs.filter((log) => log.producto_id === item.id);

  if (itemLogs.length < 2) {
    return {
      error: "No hay suficientes datos históricos para hacer una sugerencia.",
    };
  }

  const historicalData = itemLogs
    .map(
      (log) =>
        `Fecha: ${new Date(log.fecha).toISOString().split("T")[0]}, Cambio: ${
          log.cantidad
        }, Razón: ${log.referencia}`
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
