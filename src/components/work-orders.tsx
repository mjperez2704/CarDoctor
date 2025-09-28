"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import type { Cliente, Empleado } from "@/lib/types";
import type { WorkOrder } from "@/app/(protected)/work-orders/actions";
import { Badge } from "./ui/badge";
import { WorkOrderFormModal } from "./work-order-form-modal";
import { WorkOrderCancelDialog } from "./work-order-cancel-dialog"; // Importar

type WorkOrdersProps = {
    initialWorkOrders: WorkOrder[];
    clients: Cliente[];
    employees: Empleado[];
};

export function WorkOrders({ initialWorkOrders, clients, employees }: WorkOrdersProps) {
    const [workOrders, setWorkOrders] = React.useState(initialWorkOrders);
    const [selectedOrder, setSelectedOrder] = React.useState<WorkOrder | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isCancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setWorkOrders(initialWorkOrders);
    }, [initialWorkOrders]);

    const handleOpenFormModal = (order: WorkOrder | null) => {
        setSelectedOrder(order);
        setFormModalOpen(true);
    };

    const handleOpenCancelDialog = (order: WorkOrder) => {
        setSelectedOrder(order);
        setCancelDialogOpen(true);
    };

    const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        RECEPCION: "outline", DIAGNOSTICO: "outline", AUTORIZACION: "secondary",
        EN_REPARACION: "default", PRUEBAS: "default", LISTO: "default",
        ENTREGADO: "default", CANCELADO: "destructive",
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span>Filtrar</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span>Exportar</span>
                        </Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenFormModal(null)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Crear Orden</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Folio</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Vehículo</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Técnico Asignado</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.folio}</TableCell>
                                    <TableCell>{order.cliente_razon_social}</TableCell>
                                    <TableCell>{order.vehiculo_descripcion}</TableCell>
                                    <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.tecnico_nombre || "Sin Asignar"}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[order.estado] || 'secondary'}>
                                            {order.estado.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => { /* Abrir modal de detalles */ }}>Ver Detalles</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(order)}>Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenCancelDialog(order)}>
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
                isOpen={isFormModalOpen}
                onCloseActionAction={() => setFormModalOpen(false)}
                clients={clients}
                employees={employees}
                order={selectedOrder}
            />

            <WorkOrderCancelDialog
                isOpen={isCancelDialogOpen}
                onCloseAction={() => setCancelDialogOpen(false)}
                order={selectedOrder}
            />
        </>
    );
}
