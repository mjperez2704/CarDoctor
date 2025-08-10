"use client";

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

export function Quotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cotizaciones</CardTitle>
        <CardDescription>
          Crea y administra cotizaciones para clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cliente Ejemplo 1</TableCell>
              <TableCell>2024-07-30</TableCell>
              <TableCell>$150.00</TableCell>
              <TableCell>Enviada</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cliente Ejemplo 2</TableCell>
              <TableCell>2024-07-29</TableCell>
              <TableCell>$300.00</TableCell>
              <TableCell>Aceptada</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
