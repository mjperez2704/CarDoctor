
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
import type { Herramienta, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";

type ToolsManagerProps = {
  initialTools: Herramienta[];
  employees: Empleado[];
};

export function ToolsManager({ initialTools, employees }: ToolsManagerProps) {
  const [tools, setTools] = React.useState(initialTools);

  const getEmployeeName = (employeeId?: number) => {
    if (!employeeId) return "N/A";
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? `${employee.nombre} ${employee.apellido_p}` : `ID ${employeeId}`;
  };

  const statusVariant: Record<Herramienta["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    DISPONIBLE: "default",
    ASIGNADA: "secondary",
    EN_MANTENIMIENTO: "outline",
    DE_BAJA: "destructive",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Catálogo de Herramientas</CardTitle>
            <CardDescription>
              Administra el inventario de herramientas internas del taller.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Herramienta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignada a</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.sku}</TableCell>
                <TableCell>{tool.nombre}</TableCell>
                <TableCell>{tool.marca || '-'} / {tool.modelo || '-'}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[tool.estado]}>{tool.estado.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>{getEmployeeName(tool.asignada_a_empleado_id)}</TableCell>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Asignar a Técnico</DropdownMenuItem>
                      <DropdownMenuItem>Enviar a Mantenimiento</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Dar de Baja
                      </DropdownMenuItem>
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
