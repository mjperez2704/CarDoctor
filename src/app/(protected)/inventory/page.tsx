// src/app/(protected)/inventory/page.tsx
import { ProductCatalog } from "@/components/product-catalog";
import { getProveedores, getMarcas } from "@/lib/data";
import { getProductsWithStock } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function InventoryPage() {
    const products = await getProductsWithStock();
    const providers = await getProveedores();
    const brands = await getMarcas();

    return (
        <>
            <PageHeader
                title="Inventario General"
                description="Consulta el catálogo de productos y sus existencias."
            />
            <ProductCatalog
                initialProducts={products}
                providers={providers}
                brands={brands}
            />
        </>
    );
}
