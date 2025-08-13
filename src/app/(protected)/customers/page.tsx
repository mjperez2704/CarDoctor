import { AppLayout } from "@/components/layout";
import { Customers } from "@/components/customers";
import { getCustomers } from "@/lib/data";

export default function CustomersPage() {
  const customers = getCustomers();
  return (
    <AppLayout title="Clientes">
      <Customers initialCustomers={customers} />
    </AppLayout>
  );
}
