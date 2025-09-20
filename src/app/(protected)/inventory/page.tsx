import { Dashboard } from "@/components/dashboard";
import { getProducts } from "@/lib/data";

export default async function InventoryPage() {
  const inventoryData = await getProducts();
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
