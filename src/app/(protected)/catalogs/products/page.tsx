// src/app/(protected)/catalogs/products/page.tsx
import { ProductCatalog } from "@/components/product-catalog";
import { getProveedores, getMarcas } from "@/lib/data";
import { getProductsWithStock } from "@/app/(protected)/inventory/actions";
import { PageHeader } from "@/components/page-header";

export default async function ProductsCatalogPage() {
    const products = await getProductsWithStock();
    const providers = await getProveedores();
    const brands = await getMarcas();

    return (
        <>
            <PageHeader
                title="Catálogo de Refacciones"
                description="Administra los productos, SKU, precios y costos."
            />
            <ProductCatalog
                initialProducts={products}
                providers={providers}
                brands={brands}
            />
        </>
    );
}
