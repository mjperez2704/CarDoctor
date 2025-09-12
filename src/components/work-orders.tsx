
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
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import type { OrdenServicio, Cliente, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";
import { WorkOrderFormModal } from "./work-order-form-modal";

type WorkOrdersProps = {
  initialWorkOrders: OrdenServicio[];
  clients: Cliente[];
  employees: Empleado[];
};

export function WorkOrders({
  initialWorkOrders,
  clients,
  employees,
}: WorkOrdersProps) {
  const [workOrders, setWorkOrders] = React.useState(initialWorkOrders);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getClientName = (clientId: number) => {
    return clients.find((c) => c.id === clientId)?.razon_social || "N/A";
  };

  const getEmployeeName = (employeeId?: number) => {
    if (!employeeId) return "Sin asignar";
    return employees.find((e) => e.id === employeeId)?.nombre || "N/A";
  };

  const statusVariant: Record<
    OrdenServicio["estado"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    RECEPCION: "outline",
    DIAGNOSTICO: "secondary",
    AUTORIZACION: "secondary",
    EN_REPARACION: "default",
    PRUEBAS: "default",
    LISTO: "default",
    ENTREGADO: "default",
    CANCELADO: "destructive",
  };

  const handleSaveOrder = (values: any) => {
    console.log("Saving new work order:", values);
    // Here you would typically call an API to save the new order
    // and then refresh the work orders list.
    setIsModalOpen(false);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Órdenes de Servicio</CardTitle>
            <CardDescription>
              Gestiona todas las órdenes de servicio del taller.
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
            <Button size="sm" className="h-7 gap-1" onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nueva Orden de Servicio
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
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Fecha Recepción</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.folio}</TableCell>
                <TableCell>{getClientName(order.cliente_id)}</TableCell>
                <TableCell>Vehículo ID: {order.equipo_id}</TableCell>
                <TableCell>
                  {new Date(order.fecha).toLocaleDateString()}
                </TableCell>
                <TableCell>{getEmployeeName(order.tecnico_id)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.estado]}>
                    {order.estado.replace("_", " ")}
                  </Badge>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Imprimir</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancelar Orden
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
     <WorkOrderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        clients={clients}
        employees={employees}
      />
    </>
  );
}
