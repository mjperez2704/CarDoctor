"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit, ChevronDown, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Warehouse, Section, Lot } from "@/lib/types";

type WarehouseManagerProps = {
  initialData: Warehouse[];
};

const RuleBadge = ({
  label,
  values,
}: {
  label: string;
  values?: string[];
}) => {
  if (!values || values.length === 0) return null;
  return (
    <Badge variant="secondary" className="mr-2 mb-2">
      <span className="font-semibold">{label}:</span>&nbsp;
      {values.join(", ")}
    </Badge>
  );
};

export function WarehouseManager({ initialData }: WarehouseManagerProps) {
  const [warehouses, setWarehouses] = React.useState(initialData);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Almacén</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Almacén
        </Button>
      </div>
      {warehouses.map((warehouse) => (
        <Card key={warehouse.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{warehouse.name}</CardTitle>
                    <CardDescription>
                        Administra las secciones y lotes de este almacén.
                    </CardDescription>
                </div>
                 <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Sección
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {warehouse.sections.map((section) => (
                <AccordionItem value={section.id} key={section.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-lg">{section.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Reglas de la Sección</h4>
                             <div className="flex flex-wrap">
                                <RuleBadge label="Tipo" values={section.rules.type} />
                                <RuleBadge label="Uso" values={section.rules.usage} />
                                <RuleBadge label="Estado" values={section.rules.status} />
                                <RuleBadge label="Stock" values={section.rules.stockType} />
                                <RuleBadge label="Marca" values={section.rules.brand} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Lotes</h4>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Lote
                            </Button>
                        </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {section.lots.map((lot) => (
                            <Card key={lot.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{lot.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{lot.items.length} tipo(s) de artículos.</p>
                                    <Button variant="link" size="sm" className="p-0 h-auto mt-2">Ver artículos</Button>
                                </CardContent>
                            </Card>
                         ))}
                       </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
