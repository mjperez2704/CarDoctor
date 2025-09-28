"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File, ListFilter, MoreHorizontal, Eye, FileText } from "lucide-react";
import type { Sale } from "@/app/(protected)/sales/actions";
import { Badge } from "./ui/badge";

type SalesProps = {
    initialSales: Sale[];
}

export function Sales({ initialSales }: SalesProps) {
  const [sales, setSales] = React.useState(initialSales);

  React.useEffect(() => {
    setSales(initialSales);
  }, [initialSales]);

  const typeVariant: Record<Sale['tipo_venta'], "default" | "secondary"> = {
    'TPV': "secondary",
    'Servicio': "default",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-end gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Método de Pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
                <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.folio}</TableCell>
                    <TableCell>{new Date(sale.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.cliente_nombre}</TableCell>
                    <TableCell><Badge variant={typeVariant[sale.tipo_venta]}>{sale.tipo_venta}</Badge></TableCell>
                    <TableCell>{sale.metodo_pago}</TableCell>
                    <TableCell className="text-right font-semibold">${Number(sale.total).toFixed(2)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Ver Detalle</DropdownMenuItem>
                            <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Descargar PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
            {sales.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No hay ventas registradas.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
