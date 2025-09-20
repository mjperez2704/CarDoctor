import { z } from "zod";

// Schema for product form validation
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