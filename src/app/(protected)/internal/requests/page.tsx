// src/app/(protected)/internal/requests/page.tsx
import { RequestsManager } from "@/components/requests-manager";
import { getEmpleados } from "@/lib/data";
import { getInternalRequests } from "./actions";

export default async function RequestsPage() {
    // Obtenemos las solicitudes desde la base de datos
    const requests = await getInternalRequests();
    // Los empleados se mantienen por ahora para funcionalidades futuras del modal
    const employees = await getEmpleados();

    return (
        <RequestsManager initialRequests={requests} employees={employees} />
    );
}
