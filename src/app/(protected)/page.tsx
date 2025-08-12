import { Dashboard } from "@/components/dashboard";
import { getAuditLogs, getInventory } from "@/lib/data";

export default async function HomePage() {
  const inventoryData = getInventory();
  const auditLogsData = getAuditLogs();

  return (
    <Dashboard
      initialInventory={inventoryData}
      initialAuditLogs={auditLogsData}
    />
  );
}