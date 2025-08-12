import { AppLayout } from "@/components/layout";
import { Purchases } from "@/components/purchases";
import { getPurchases, getProviders } from "@/lib/data";

export default function PurchasesPage() {
  const purchases = getPurchases();
  const providers = getProviders();
  return (
    <AppLayout title="Compras">
      <Purchases initialPurchases={purchases} initialProviders={providers} />
    </AppLayout>
  );
}
