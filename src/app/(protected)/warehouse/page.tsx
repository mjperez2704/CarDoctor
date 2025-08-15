import { WarehouseManager } from "@/components/warehouse-manager";
import { getAlmacenes } from "@/lib/data";

export default function WarehousePage() {
  const warehouseData = getAlmacenes();
  return (
    <WarehouseManager initialData={warehouseData} />
  );
}

    