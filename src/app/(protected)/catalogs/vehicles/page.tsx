import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VehiclesPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Vehículos</CardTitle>
          <CardDescription>
            Gestiona los vehículos de la flota.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de gestión de vehículos.</p>
        </CardContent>
      </Card>
  );
}
