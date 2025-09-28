// src/app/(protected)/providers/page.tsx
import { Providers } from "@/components/providers";
import { getProviders } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function ProvidersPage() {
    const providers = await getProviders();
    return (
        <>
            <PageHeader
                title="Proveedores"
                description="Administra tu lista de proveedores de refacciones y servicios."
            />
            <Providers initialProviders={providers} />
        </>
    );
}
