import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingPage() {
  return (
    <AppLayout title="Marketing y Redes Sociales">
      <Card>
        <CardHeader>
          <CardTitle>Marketing</CardTitle>
          <CardDescription>
            Gestiona tus campañas de marketing y redes sociales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de gestión de marketing.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
