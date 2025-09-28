// src/app/(protected)/catalogs/brands/page.tsx
import { BrandsManager } from "@/components/brands-manager";
// Importamos la nueva acción
import { getBrandsWithDetails } from "./actions";

export default async function BrandsCatalogPage() {
    // Obtenemos las marcas con todos sus detalles desde la base de datos
    const brands = await getBrandsWithDetails();

    return (
        <BrandsManager initialBrands={brands} />
    );
}
