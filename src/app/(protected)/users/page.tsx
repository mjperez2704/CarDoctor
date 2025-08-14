import { Users } from "@/components/users";
import { getUsuarios, getRoles } from "@/lib/data";

export default function UsersPage() {
  const users = getUsuarios();
  const roles = getRoles();
  
  return (
    <Users initialUsers={users} availableRoles={roles} />
  );
}

    