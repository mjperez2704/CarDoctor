// src/app/(protected)/work-orders/page.tsx
import { WorkOrders } from "@/components/work-orders";
import { getClientes, getEmpleados } from "@/lib/data";
import { getWorkOrders } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function WorkOrdersPage() {
    const workOrders = await getWorkOrders();
    const clients = await getClientes();
    const employees = await getEmpleados();

    return (
        <>
            <PageHeader
                title="Órdenes de Servicio"
                description="Administra todas las órdenes de servicio del taller."
            />
            <WorkOrders
                initialWorkOrders={workOrders}
                clients={clients}
                employees={employees}
            />
        </>
    );
}
