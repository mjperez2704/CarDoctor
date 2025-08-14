import { Vendedores } from "@/components/vendedores";
import { getEmpleados } from "@/lib/data";

export default function VendedoresPage() {
  const employees = getEmpleados();
  return (
    <Vendedores initialVendedores={employees} />
  );
}
