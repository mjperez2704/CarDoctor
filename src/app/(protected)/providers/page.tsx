import { Providers } from "@/components/providers";
import { getProveedores } from "@/lib/data";

export default function ProvidersPage() {
  const providers = getProveedores();
  return (
    <Providers initialProviders={providers} />
  );
}
