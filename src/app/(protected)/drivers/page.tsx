import { Customers } from "@/components/customers";
import { getClientes } from "@/lib/data";

export default function CustomersPage() {
  const customers = getClientes();
  return (
    <Customers initialCustomers={customers} />
  );
}
