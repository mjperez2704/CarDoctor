import { AppLayout } from "@/components/layout";
import { WarehouseManager } from "@/components/warehouse-manager";
import { getWarehouseData } from "@/lib/data";

export default function WarehousePage() {
  const warehouseData = getWarehouseData();
  return (
    <AppLayout title="Gestión de Almacén">
      <WarehouseManager initialData={warehouseData} />
    </AppLayout>
  );
}