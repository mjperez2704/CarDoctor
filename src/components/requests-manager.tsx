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
import { MoreHorizontal, PlusCircle, ListFilter, File } from "lucide-react";
import type { SolicitudInterna, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";

type RequestsManagerProps = {
  initialRequests: SolicitudInterna[];
  employees: Empleado[];
};

export function RequestsManager({ initialRequests, employees }: RequestsManagerProps) {
  const [requests, setRequests] = React.useState(initialRequests);

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.nombre} ${employee.apellido_p}` : "N/A";
  };

  const statusVariant: Record<SolicitudInterna["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    PENDIENTE: "secondary",
    APROBADA: "default",
    RECHAZADA: "destructive",
    CANCELADA: "outline",
  };

  const typeVariant: Record<SolicitudInterna["tipo"], "default" | "secondary" | "destructive" | "outline"> = {
    COMPRA: "outline",
    GASTO: "outline",
    PERMISO: "secondary",
    VACACIONES: "secondary",
    OTRO: "secondary",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Solicitudes Internas</CardTitle>
            <CardDescription>
              Gestiona las solicitudes de compra, gastos, permisos y más.
            </CardDescription>
          </div>
          <div className="flex gap-2">
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
                Crear Solicitud
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.folio}</TableCell>
                <TableCell>{new Date(request.fecha_solicitud).toLocaleDateString()}</TableCell>
                <TableCell>{getEmployeeName(request.solicitante_id)}</TableCell>
                <TableCell>
                    <Badge variant={typeVariant[request.tipo]}>{request.tipo}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{request.descripcion}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[request.estado]}>{request.estado}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.monto ? `$${request.monto.toFixed(2)}` : "-"}
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
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem>Aprobar</DropdownMenuItem>
                      <DropdownMenuItem>Rechazar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancelar Solicitud
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
