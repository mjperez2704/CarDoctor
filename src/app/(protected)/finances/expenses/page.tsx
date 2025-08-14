import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpensesPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>
            Gestiona los gastos del negocio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de gestión de gastos.</p>
        </CardContent>
      </Card>
  );
}
