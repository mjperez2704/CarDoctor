import { Dashboard } from "@/components/dashboard";
import { getProductos } from "@/lib/data";

export default async function InventoryPage() {
  const inventoryData = getProductos();
  // TODO: Cargar registros de auditoría cuando estén disponibles
  const auditLogsData: any[] = []; 

  return (
    <Dashboard
      initialInventory={inventoryData}
      initialAuditLogs={auditLogsData}
      defaultTab="inventory"
    />
  );
}
