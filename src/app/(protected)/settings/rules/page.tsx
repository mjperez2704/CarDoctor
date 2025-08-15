
import { BusinessRulesEngine } from "@/components/business-rules-engine";

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reglas de Negocio</h1>
        <p className="text-muted-foreground">
          Establece y personaliza las reglas de funcionamiento y las restricciones del sistema.
        </p>
      </div>
      <BusinessRulesEngine />
    </div>
  );
}
