// src/app/(protected)/sales/page.tsx
import { Sales } from "@/components/sales";
import { getSalesHistory } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function SalesPage() {
    const sales = await getSalesHistory();

    return (
        <>
            <PageHeader
                title="Historial de Ventas"
                description="Consulta todas las ventas registradas en el sistema, tanto de TPV como de servicios."
            />
            <Sales initialSales={sales} />
        </>
    );
}
