import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Gestiona los usuarios del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de gestión de usuarios.</p>
        </CardContent>
      </Card>
  );
}
