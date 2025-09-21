import { Dashboard } from "@/components/dashboard";
import { getDashboardData } from "@/lib/data";

export default async function HomePage() {
  const { inventoryData, workOrdersData, auditLogsData } = await getDashboardData();

  return (
    <Dashboard
      initialInventory={inventoryData}
      initialWorkOrders={workOrdersData}
      initialAuditLogs={auditLogsData}
    />
  );
}
