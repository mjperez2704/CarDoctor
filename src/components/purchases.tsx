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

export function Purchases() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compras</CardTitle>
        <CardDescription>
          Administra las compras a proveedores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Proveedor A</TableCell>
              <TableCell>2024-07-28</TableCell>
              <TableCell>$1200.00</TableCell>
            </TableRow>
             <TableRow>
              <TableCell>Proveedor B</TableCell>
              <TableCell>2024-07-25</TableCell>
              <TableCell>$850.50</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
