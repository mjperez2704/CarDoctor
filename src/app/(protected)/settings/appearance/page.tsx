import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearancePage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>
            Personaliza la apariencia del sistema, como los colores y el tema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de configuración de apariencia.</p>
        </CardContent>
      </Card>
  );
}
