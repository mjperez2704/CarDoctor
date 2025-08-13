import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <AppLayout title="Facturación Electrónica">
      <Card>
        <CardHeader>
          <CardTitle>Facturación</CardTitle>
          <CardDescription>
            Gestiona tus facturas electrónicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de facturación electrónica.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
