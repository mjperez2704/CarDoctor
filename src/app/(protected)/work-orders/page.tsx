import { WorkOrders } from "@/components/work-orders";
import { getClientes, getEmpleados, getOrdenesServicio } from "@/lib/data";

export default function WorkOrdersPage() {
  const workOrders = getOrdenesServicio();
  const clients = getClientes();
  const employees = getEmpleados();

  return (
    <WorkOrders
      initialWorkOrders={workOrders}
      clients={clients}
      employees={employees}
    />
  );
}
