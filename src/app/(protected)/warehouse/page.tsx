// src/app/(protected)/warehouse/page.tsx
import { WarehouseManager } from "@/components/warehouse-manager";
import { getAlmacenes } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export default async function WarehousePage() {
    const warehouseData = await getAlmacenes();
    return (
        <>
            <PageHeader
                title="Gestión de Almacén"
                description="Administra los almacenes, secciones y ubicaciones de tu inventario."
            />
            <WarehouseManager initialData={warehouseData} />
        </>
    );
}
