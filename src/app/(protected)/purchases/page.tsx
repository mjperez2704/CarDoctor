import { AppLayout } from "@/components/layout";
import { Purchases } from "@/components/purchases";
import { getOrdenesCompra, getProveedores } from "@/lib/data";

export default function PurchasesPage() {
  const purchases = getOrdenesCompra();
  const providers = getProveedores();
  return (
    <AppLayout title="Compras">
      <Purchases initialPurchases={purchases} initialProviders={providers} />
    </AppLayout>
  );
}
