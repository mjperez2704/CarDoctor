import { RequestsManager } from "@/components/requests-manager";
import { getSolicitudesInternas, getEmpleados } from "@/lib/data";

export default function RequestsPage() {
  const requests = getSolicitudesInternas();
  const employees = getEmpleados();
  return (
    <RequestsManager initialRequests={requests} employees={employees} />
  );
}
