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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Employee } from "@/lib/types";
import { Input } from "./ui/input";

export function Vendedores({ initialVendedores }: { initialVendedores: Employee[] }) {
  const [vendedores, setVendedores] = React.useState(
    initialVendedores.filter((e) => e.role === "Ventas")
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vendedores</CardTitle>
            <CardDescription>
              Administra las cuotas y el desempeño de tu equipo de ventas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cuota de Venta (Mensual)</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendedores.map((vendedor) => (
              <TableRow key={vendedor.id}>
                <TableCell className="font-medium">{vendedor.name}</TableCell>
                <TableCell>{vendedor.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>$</span>
                    <Input
                      type="number"
                      defaultValue={vendedor.salesQuota || 0}
                      className="w-32"
                    />
                  </div>
                </TableCell>
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
                      <DropdownMenuItem>Guardar Cambios</DropdownMenuItem>
                      <DropdownMenuItem>Ver Desempeño</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
