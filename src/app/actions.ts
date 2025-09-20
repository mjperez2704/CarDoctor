
"use server";

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { suggestStockLevels } from "@/ai/flows/stock-level-suggestions";
import type { Producto, MovimientoInventario } from "@/lib/types";

// Schema for product form validation (centralized here)
export const productFormSchema = z.object({
  id: z.number().optional(),
  sku: z.string().min(1, "El SKU es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  brandId: z.string().optional(),
  providerId: z.string().optional(),
  alternateProviderId: z.string().optional(),
  providerSku: z.string().optional(),
  unit: z.string().min(1, "La unidad es requerida."),
  cost: z.coerce.number().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
  maxStock: z.coerce.number().int().min(0).default(0),
  deliveryTime: z.coerce.number().int().min(0).default(0),
  minPurchase: z.coerce.number().int().min(1).default(1),
  isInventoriable: z.boolean().default(true),
  hasExpiry: z.boolean().default(false),
  expiryDays: z.coerce.number().int().min(1).default(1),
  isBlocked: z.boolean().default(false),
  isKitPart: z.boolean().default(false),
  kitSku: z.string().optional(),
}).refine(data => !data.isKitPart || (data.isKitPart && data.kitSku), {
    message: "La clave del kit es requerida si el producto es parte de un kit.",
    path: ["kitSku"]
});

// Helper function to get a single product
async function getProductById(id: string): Promise<Producto | null> {
    try {
        const [rows] = await pool.query<Producto[]>('SELECT * FROM productos WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Database Error fetching product by ID:', error);
        return null;
    }
}


export async function saveProductAction(
  formData: z.infer<typeof productFormSchema>
): Promise<{ success: boolean; message: string; errors?: any }> {
  
  const validatedFields = productFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación. Por favor, revise los campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { 
      description,
      brandId,
      providerId,
      alternateProviderId,
      providerSku,
      deliveryTime,
      minPurchase,
      hasExpiry,
      expiryDays,
      unit,
      cost,
      minStock,
      maxStock,
      isInventoriable,
      isBlocked,
      isKitPart,
      kitSku,
      sku
   } = validatedFields.data;

  try {
      const sql = `
        INSERT INTO productos (
            sku, nombre, marca_id, proveedor_id, proveedor_alt_id, clave_proveedor,
            unidad, costo_promedio, stock_min, stock_max, tiempo_entrega_dias, compra_minima,
            es_inventariable, usa_caducidad, dias_caducidad, es_bloqueado, es_parte_kit, kit_sku,
            es_servicio, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      
      const values = [
        sku,
        description,
        brandId ? parseInt(brandId, 10) : null,
        providerId ? parseInt(providerId, 10) : null,
        alternateProviderId ? parseInt(alternateProviderId, 10) : null,
        providerSku,
        unit,
        cost,
        minStock,
        maxStock,
        deliveryTime,
        minPurchase,
        isInventoriable,
        hasExpiry,
        hasExpiry ? expiryDays : 0,
        isBlocked,
        isKitPart,
        isKitPart ? kitSku : null,
        false, // es_servicio - this form is for products, not services
        0 // stock_actual - initial stock
      ];

      await pool.query(sql, values);
      
  } catch (error) {
    console.error("Database Error:", error);
    // TODO: Check for specific errors like duplicate SKU
    return { success: false, message: "Error de base de datos: No se pudo guardar el producto." };
  }

  revalidatePath("/dashboard/inventory");
  return { success: true, message: "Producto guardado exitosamente." };
}


// --- Refactored AI Action ---

export async function getAiSuggestionAction(
  itemId: string
): Promise<{ suggestedLevel: number; reasoning: string } | { error: string }> {
  
  const item = await getProductById(itemId);

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
        `Fecha: ${new Date(log.fecha).toISOString().split("T")[0]}, Cantidad: ${log.cantidad}, Tipo: ${log.tipo}`
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

