// src/app/(protected)/transfers/page.tsx
import { TransferForm } from "@/components/transfer-form";
import { getAlmacenes, getProductos, getLotes } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export default async function TransfersPage() {
    const almacenes = await getAlmacenes();
    const productos = await getProductos();
    const lotes = await getLotes();

    return (
        <>
            <PageHeader
                title="Traslados de Inventario"
                description="Mueve productos entre diferentes almacenes y secciones."
            />
            <TransferForm almacenes={almacenes} productos={productos} lotes={lotes} />
        </>
    );
}
