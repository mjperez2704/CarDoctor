
import { VehicleStatus } from "@/components/vehicle-status";
import { getOrdenesServicio, getClientes } from "@/lib/data";

export default function VehiclesPage() {
  const workOrders = getOrdenesServicio();
  const clients = getClientes();

  // Para esta pantalla, las órdenes de servicio representan los vehículos en el taller
  const vehiclesInService = workOrders.map(order => ({
    ...order,
    clientName: clients.find(c => c.id === order.cliente_id)?.razon_social || 'N/A',
    vehicleIdentifier: `Vehículo de order.equipo_id}` // Simulación de identificador
  }));

  return (
    <VehicleStatus initialVehicles={vehiclesInService} />
  );
}
