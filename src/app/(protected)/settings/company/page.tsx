import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Datos de la Empresa</CardTitle>
          <CardDescription>
            Administra la información de tu empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de configuración de datos de la empresa.</p>
        </CardContent>
      </Card>
  );
}
