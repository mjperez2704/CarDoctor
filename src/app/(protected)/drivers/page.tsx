import { Drivers } from "@/components/drivers";
import { getClientes } from "@/lib/data";

export default function DriversPage() {
  const drivers = getClientes();
  return (
    <Drivers initialDrivers={drivers} />
  );
}
