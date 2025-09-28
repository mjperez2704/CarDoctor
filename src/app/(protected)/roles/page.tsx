import { Roles } from "@/components/roles";
import { getRoles } from "@/lib/data";
import { getAllPermissions } from "@/lib/permissions";

export default async function RolesPage() {
    const roles = await getRoles();
    const permissions = getAllPermissions(); // Esto puede seguir siendo estático por ahora

    return (
        <Roles initialRoles={roles} allPermissions={permissions} />
    );
}
