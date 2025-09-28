import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function DiagnosePage({ params }: { params: { id: string } }) {
  return (
    <>
        <PageHeader
            title={`Diagnóstico de Orden de Servicio #${params.id}`}
            description="Documenta el diagnóstico, agrega refacciones y define los servicios requeridos."
        />
        <Card>
            <CardHeader>
                <CardTitle>Módulo de Diagnóstico</CardTitle>
                <CardDescription>
                    Esta interfaz permitirá al técnico detallar el diagnóstico del vehículo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Próximamente:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Formulario para documentar el diagnóstico detallado.</li>
                    <li>Opción para adjuntar fotografías y videos.</li>
                    <li>Buscador para agregar refacciones desde el catálogo.</li>
                    <li>Formulario para añadir servicios (mano de obra).</li>
                    <li>Botón para generar una cotización para el cliente.</li>
                </ul>
            </CardContent>
        </Card>
    </>
  );
}
