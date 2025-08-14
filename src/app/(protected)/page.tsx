import { AppLayout } from "@/components/layout";
import { Dashboard } from "@/components/dashboard";
import { getProductos } from "@/lib/data";

export default async function HomePage() {
  const inventoryData = getProductos();
  // TODO: Cargar registros de auditoría cuando estén disponibles
  const auditLogsData: any[] = []; 

  return (
    <AppLayout title="Dashboard">
        <Dashboard
          initialInventory={inventoryData}
          initialAuditLogs={auditLogsData}
        />
    </AppLayout>
  );
}
