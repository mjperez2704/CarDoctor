import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <AppLayout title="Gestión de Clientes (CRM)">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Administra la información y comunicación con tus clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de CRM para gestión de clientes.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
