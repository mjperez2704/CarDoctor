// src/app/(protected)/catalogs/tools/page.tsx
import { ToolsManager } from "@/components/tools-manager";
import { getEmpleados } from "@/lib/data";
import { getTools } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function ToolsCatalogPage() {
    const tools = await getTools();
    const employees = await getEmpleados();

    return (
        <>
            <PageHeader
                title="Herramientas"
                description="Administra el inventario de herramientas internas del taller."
            />
            <ToolsManager initialTools={tools} employees={employees} />
        </>
    );
}
