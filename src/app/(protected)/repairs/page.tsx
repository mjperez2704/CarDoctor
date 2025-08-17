import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkOrdersPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Servicio</CardTitle>
          <CardDescription>
            Gestiona las órdenes de servicio de tu taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de órdenes de servicio.</p>
        </CardContent>
      </Card>
  );
}
