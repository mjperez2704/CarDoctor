import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <AppLayout title="Reportes Personalizados">
      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
          <CardDescription>
            Genera y visualiza reportes personalizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de reportes personalizados.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
