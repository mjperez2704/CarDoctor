import { Vendedores } from "@/components/vendedores";
import { getEmpleados, getUsuarios } from "@/lib/data";

export default function VendedoresPage() {
  const employees = getEmpleados();
  const users = getUsuarios();
  return (
    <Vendedores initialVendedores={employees} systemUsers={users} />
  );
}
