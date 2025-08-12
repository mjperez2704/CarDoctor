import { AppLayout } from "@/components/layout";
import { Providers } from "@/components/providers";
import { getProviders } from "@/lib/data";

export default function ProvidersPage() {
  const providers = getProviders();
  return (
    <AppLayout title="Proveedores">
      <Providers initialProviders={providers} />
    </AppLayout>
  );
}
