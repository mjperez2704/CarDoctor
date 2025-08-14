import { LogManager } from "@/components/log-manager";
import { getBitacora, getUsuarios } from "@/lib/data";

export default function LogPage() {
  const logEntries = getBitacora();
  const users = getUsuarios();
  
  return (
    <LogManager initialLogs={logEntries} users={users} />
  );
}
