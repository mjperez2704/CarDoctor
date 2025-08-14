import { Roles } from "@/components/roles";
import { getRoles } from "@/lib/data";
import { getAllPermissions } from "@/lib/permissions";

export default function RolesPage() {
  const roles = getRoles();
  const permissions = getAllPermissions();

  return (
    <Roles initialRoles={roles} allPermissions={permissions} />
  );
}

    