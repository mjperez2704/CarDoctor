import { AppLayout } from "@/components/layout";
import { WarehouseManager } from "@/components/warehouse-manager";
import { getAlmacenes } from "@/lib/data";

export default function WarehousePage() {
  const warehouseData = getAlmacenes();
  return (
    <AppLayout title="Gestión de Almacén">
      <WarehouseManager initialData={warehouseData} />
    </AppLayout>
  );
}
