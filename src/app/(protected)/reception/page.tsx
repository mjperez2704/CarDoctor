
import { ReceptionManager } from "@/components/reception-manager";
import { getClientes, getEmpleados, getOrdenesServicio } from "@/lib/data";

export default function ReceptionPage() {
  // Para la fase inicial, reutilizamos los mismos datos que las órdenes de servicio.
  const recentReceptions = getOrdenesServicio(); 
  const clients = getClientes();
  const employees = getEmpleados();

  return (
    <ReceptionManager
      initialReceptions={recentReceptions}
      clients={clients}
      employees={employees}
    />
  );
}
