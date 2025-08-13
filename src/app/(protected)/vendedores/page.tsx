import { AppLayout } from "@/components/layout";
import { Vendedores } from "@/components/vendedores";
import { getEmployees } from "@/lib/data";

export default function VendedoresPage() {
  const employees = getEmployees();
  return (
    <AppLayout title="Gestión de Vendedores">
      <Vendedores initialVendedores={employees} />
    </AppLayout>
  );
}
