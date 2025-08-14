import { Purchases } from "@/components/purchases";
import { getOrdenesCompra, getProveedores } from "@/lib/data";

export default function PurchasesPage() {
  const purchases = getOrdenesCompra();
  const providers = getProveedores();
  return (
    <Purchases initialPurchases={purchases} initialProviders={providers} />
  );
}
