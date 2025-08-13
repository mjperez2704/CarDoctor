import { AppLayout } from "@/components/layout";
import { Vendedores } from "@/components/vendedores";
import { getEmpleados } from "@/lib/data";

export default function VendedoresPage() {
  const employees = getEmpleados();
  return (
    <AppLayout title="Gestión de Vendedores">
      <Vendedores initialVendedores={employees} />
    </AppLayout>
  );
}
