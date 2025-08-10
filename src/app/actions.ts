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
    return { error: "Item not found." };
  }

  const auditLogs = getAuditLogs();
  const itemLogs = auditLogs.filter((log) => log.itemName === item.name);

  if (itemLogs.length < 2) {
    return {
      error: "Not enough historical data to make a suggestion.",
    };
  }

  const historicalData = itemLogs
    .map(
      (log) =>
        `Date: ${log.timestamp.toISOString().split("T")[0]}, Change: ${
          log.quantityChange
        }, Reason: ${log.reason}`
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
    return { error: "Failed to get suggestion from AI." };
  }
}
