// src/app/(protected)/internal/log/page.tsx
import { LogManager } from "@/components/log-manager";
import { getUsuarios } from "@/lib/data";
import { getLogEntries } from "./actions";

export default async function LogPage() {
    // Obtenemos los registros de la bitácora desde la base de datos
    const logEntries = await getLogEntries();
    // Obtenemos la lista de usuarios para el dropdown de filtros
    const users = await getUsuarios();

    return (
        <LogManager initialLogs={logEntries} users={users} />
    );
}
