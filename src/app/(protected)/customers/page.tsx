import { AppLayout } from "@/components/layout";
import { Customers } from "@/components/customers";
import { getClientes } from "@/lib/data";

export default function CustomersPage() {
  const customers = getClientes();
  return (
    <AppLayout title="Clientes">
      <Customers initialCustomers={customers} />
    </AppLayout>
  );
}
