// src/app/(protected)/users/page.tsx
import { Users } from "@/components/users";
import { getRoles } from "@/lib/data";
import { getUsersWithRoles } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function UsersPage() {
    const users = await getUsersWithRoles();
    const availableRoles = await getRoles();

    return (
        <>
            <PageHeader
                title="Usuarios"
                description="Administra los usuarios del sistema y sus roles de acceso."
            />
            <Users initialUsers={users} availableRoles={availableRoles} />
        </>
    );
}
