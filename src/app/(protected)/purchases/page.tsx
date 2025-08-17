import { Purchases } from "@/components/purchases";
import { getPurchases, getProveedores } from "@/lib/data";

export default function PurchasesPage() {
  const purchases = getPurchases();
  const providers = getProveedores();
  return (
    <Purchases initialPurchases={purchases} initialProviders={providers} />
  );
}
