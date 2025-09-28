// src/app/(protected)/reports/predetermined/page.tsx

import { KardexForm } from "@/components/kardex-form";
// Importamos la nueva acción
import { getProductsForReports } from "./actions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

export default async function PredeterminedReportsPage() {
    // Obtenemos los productos desde la base de datos
    const productos = await getProductsForReports();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reportes Predeterminados</h1>
                <p className="text-muted-foreground">
                    Selecciona un reporte de la lista para generarlo.
                </p>
            </div>

            <Accordion type="multiple" className="w-full space-y-4" defaultValue={['catalogs']}>
                {/* Módulo de Catálogos */}
                <AccordionItem value="catalogs" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5" />
                            <span>Catálogos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <KardexForm products={productos} />
                    </AccordionContent>
                </AccordionItem>

                {/* Aquí se pueden agregar más módulos como Ventas, Compras, etc. */}

            </Accordion>
        </div>
    );
}
