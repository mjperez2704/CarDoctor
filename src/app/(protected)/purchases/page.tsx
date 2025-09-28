// src/app/(protected)/purchases/page.tsx
import { Purchases } from "@/components/purchases";
import { getProveedores, getProductos } from "@/lib/data";
import { getPurchaseOrders } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function PurchasesPage() {
    const purchases = await getPurchaseOrders();
    const providers = await getProveedores();
    const products = await getProductos();

    return (
        <>
            <PageHeader
                title="Compras"
                description="Administra las órdenes de compra a proveedores."
            />
            <Purchases
                initialPurchases={purchases}
                initialProviders={providers}
                initialProducts={products}
            />
        </>
    );
}
