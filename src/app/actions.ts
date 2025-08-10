"use server";

import { suggestStockLevels } from "@/ai/flows/stock-level-suggestions";
import { getAuditLogs, getInventory } from "@/lib/data";
import type { InventoryItem } from "@/lib/types";

export async function getAiSuggestionAction(
  itemId: string
): Promise<{ suggestedLevel: number; reasoning: string } | { error: string }> {
  const inventory = getInventory();
  const item = inventory.find((i) => i.id === itemId);

  if (!item) {
    return { error: "Artículo no encontrado." };
  }

  const auditLogs = getAuditLogs();
  const itemLogs = auditLogs.filter((log) => log.itemName === item.name);

  if (itemLogs.length < 2) {
    return {
      error: "No hay suficientes datos históricos para hacer una sugerencia.",
    };
  }

  const historicalData = itemLogs
    .map(
      (log) =>
        `Fecha: ${log.timestamp.toISOString().split("T")[0]}, Cambio: ${
          log.quantityChange
        }, Razón: ${log.reason}`
    )
    .join("; ");

  try {
    const suggestion = await suggestStockLevels({
      location: item.location,
      objectType: item.type,
      historicalData,
    });
    return suggestion;
  } catch (error) {
    console.error(error);
    return { error: "No se pudo obtener la sugerencia de la IA." };
  }
}
