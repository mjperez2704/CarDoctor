import { AppLayout } from "@/components/layout";
import { Purchases } from "@/components/purchases";

export default function PurchasesPage() {
  return (
    <AppLayout title="Compras">
      <Purchases />
    </AppLayout>
  );
}