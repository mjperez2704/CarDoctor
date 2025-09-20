
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, ListFilter, PlusCircle } from "lucide-react";
import type { Producto } from "@/lib/types";

type ServicesListProps = {
  initialServices: Producto[];
};

export function ServicesList({ initialServices }: ServicesListProps) {
  const [services, setServices] = React.useState(initialServices);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Catálogo de Servicios</CardTitle>
            <CardDescription>
              Administra los servicios ofrecidos en el taller.
            </CardDescription>
          </div>
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtrar
              </span>
            </Button>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Crear Servicio
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio de Lista</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Activo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.sku}</TableCell>
                <TableCell>{service.nombre}</TableCell>
                <TableCell>${service.precio_lista.toFixed(2)}</TableCell>
                <TableCell>{service.unidad}</TableCell>
                <TableCell>{service.activo ? "Sí" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
