// src/app/(protected)/reception/page.tsx
import { ReceptionManager } from "@/components/reception-manager";
import { getReceptions } from "./actions";
import { getClientes, getEmpleados } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export default async function ReceptionPage() {
    const recentReceptions = await getReceptions();
    const clients = await getClientes();
    const employees = await getEmpleados();

    return (
        <>
            <PageHeader
                title="Recepción de Vehículos"
                description="Registra nuevos vehículos en el taller y genera órdenes de servicio."
            />
            <ReceptionManager
                initialReceptions={recentReceptions}
                clients={clients}
                employees={employees}
            />
        </>
    );
}
