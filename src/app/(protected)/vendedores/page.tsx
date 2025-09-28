// src/app/(protected)/vendedores/page.tsx
import { Vendedores } from "@/components/vendedores";
import { getUsuarios, getEmpleados } from "@/lib/data";
import { getSellers } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function VendedoresPage() {
    const sellers = await getSellers();
    const allEmployees = await getEmpleados();
    const allUsers = await getUsuarios();

    return (
        <>
            <PageHeader
                title="Vendedores"
                description="Administra las cuotas y el desempeño de tu equipo de ventas."
            />
            <Vendedores
                initialVendedores={sellers}
                allEmployees={allEmployees}
                systemUsers={allUsers}
            />
        </>
    );
}
