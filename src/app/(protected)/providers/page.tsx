import { AppLayout } from "@/components/layout";
import { Providers } from "@/components/providers";
import { getProveedores } from "@/lib/mock-data";

export default function ProvidersPage() {
  const providers = getProveedores();
  return (
    <AppLayout title="Proveedores">
      <Providers initialProviders={providers} />
    </AppLayout>
  );
}
