import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Internas</CardTitle>
          <CardDescription>
            Gestiona las solicitudes entre el personal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de solicitudes internas.</p>
        </CardContent>
      </Card>
  );
}
