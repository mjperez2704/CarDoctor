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

export function Employees() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empleados</CardTitle>
        <CardDescription>
          Administra a los empleados de tu empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Puesto</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Juan Pérez</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell>juan.perez@example.com</TableCell>
            </TableRow>
             <TableRow>
              <TableCell>Maria Rodriguez</TableCell>
              <TableCell>Ventas</TableCell>
              <TableCell>maria.rodriguez@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
