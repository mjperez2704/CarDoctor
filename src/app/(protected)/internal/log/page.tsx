import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Bitácora Interna</CardTitle>
          <CardDescription>
            Consulta la bitácora de eventos importantes del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de bitácora interna.</p>
        </CardContent>
      </Card>
  );
}
