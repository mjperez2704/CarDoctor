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

export function Repairs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reparaciones</CardTitle>
        <CardDescription>
          Administra el historial de reparaciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>iPhone 13</TableCell>
              <TableCell>Cliente Ejemplo 1</TableCell>
              <TableCell>Juan Pérez</TableCell>
              <TableCell>Completada</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Samsung Galaxy S22</TableCell>
              <TableCell>Cliente Ejemplo 2</TableCell>
              <TableCell>Juan Pérez</TableCell>
              <TableCell>En progreso</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
