
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Marca, Modelo } from "@/lib/types";
import { Badge } from "./ui/badge";

type BrandsManagerProps = {
  initialBrands: Marca[];
  initialModels: Modelo[];
};

export function BrandsManager({ initialBrands, initialModels }: BrandsManagerProps) {
  const [brands, setBrands] = React.useState(initialBrands);
  const [models, setModels] = React.useState(initialModels);

  const getModelsForBrand = (brandId: number) => {
    return models.filter(model => model.marca_id === brandId);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Marcas y Modelos</h1>
          <p className="text-muted-foreground">
            Administra las marcas y modelos de los dispositivos que manejas.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Marca
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map(brand => {
          const brandModels = getModelsForBrand(brand.id);
          return (
            <Card key={brand.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{brand.nombre}</span>
                  <Badge variant="outline">{brandModels.length} modelos</Badge>
                </CardTitle>
                <CardDescription>
                  {brand.pais_origen ? `País: ${brand.pais_origen}` : "País no especificado"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-2">Model</h4>
                  {brandModels.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {brandModels.map(model => (
                        <li key={model.id} className="flex justify-between items-center">
                          <span>{model.nombre} ({model.anio})</span>
                           <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-3.5 w-3.5" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                           </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay modelos para esta marca.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Agregar Modelo
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Editar Marca
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
