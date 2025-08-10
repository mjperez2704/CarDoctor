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

export function Sales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas</CardTitle>
        <CardDescription>
          Revisa el historial de ventas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Venta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>VENTA-001</TableCell>
              <TableCell>Cliente Final</TableCell>
              <TableCell>2024-07-30</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>VENTA-002</TableCell>
              <TableCell>Cliente Final</TableCell>
              <TableCell>2024-07-30</TableCell>
              <TableCell>$99.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
