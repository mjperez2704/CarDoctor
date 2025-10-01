// src/components/reception-manager.tsx

"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
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
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { File, ListFilter, MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import type { Cliente, Empleado } from "@/lib/types";
import type { Reception } from "@/app/(protected)/reception/actions";
import { Badge } from "./ui/badge";
import { ReceptionChecklistModal } from "./reception-checklist-modal";
import { ReceptionDeleteDialog } from "./reception-delete-dialog";

type ReceptionManagerProps = {
    initialReceptions: Reception[];
    clients: Cliente[];
    employees: Empleado[];
};

// Estado para controlar los modales
type ModalState = {
    type: 'create' | 'edit' | 'delete' | null;
    data?: Reception | null;
}

// Función auxiliar para formatear la fecha de forma segura
const formatReceptionDate = (dateString: string | Date): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    // getTime() devuelve NaN si la fecha es inválida
    if (isNaN(date.getTime())) {
        return "Fecha inválida";
    }
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export function ReceptionManager({
                                     initialReceptions,
                                     clients,
                                     employees,
                                 }: ReceptionManagerProps) {
    const [receptions, setReceptions] = React.useState(initialReceptions);
    const [modal, setModal] = React.useState<ModalState>({ type: null, data: null });
    
    React.useEffect(() => {
        setReceptions(initialReceptions);
    }, [initialReceptions]);

    const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        RECEPCION: "outline",
        DIAGNOSTICO: "secondary",
        AUTORIZACION: "secondary",
        EN_REPARACION: "default",
        LISTO: "default",
        ENTREGADO: "default",
        CANCELADO: "destructive",
    };

    const closeModal = () => setModal({ type: null, data: null });

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                         {/* Botones de Filtrar y Exportar (sin cambios) */}
                        <Button size="sm" className="h-7 gap-1" onClick={() => setModal({ type: 'create' })}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              Registrar Recepción
                            </span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Folio OS</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Vehículo</TableHead>
                                <TableHead>Fecha Recepción</TableHead>
                                <TableHead>Motivo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receptions.map((reception) => (
                                <TableRow key={reception.id}>
                                    <TableCell className="font-medium">{reception.folio}</TableCell>
                                    <TableCell>{reception.cliente_razon_social}</TableCell>
                                    <TableCell>{reception.vehiculo_descripcion}</TableCell>
                                    <TableCell>{formatReceptionDate(reception.fecha)}</TableCell>
                                    <TableCell className="max-w-xs truncate">{reception.diagnostico_ini}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[reception.estado] || 'secondary'}>
                                            {reception.estado.replace("_", " ")}
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
                                                <DropdownMenuItem onClick={() => setModal({ type: 'edit', data: reception })}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setModal({ type: 'delete', data: reception })} className="text-destructive">
                                                     <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
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

            {/* Modal para Crear/Editar Recepción */}
            {(modal.type === 'create' || modal.type === 'edit') && (
                <ReceptionChecklistModal
                    isOpen={modal.type === 'create' || modal.type === 'edit'}
                    onCloseAction={closeModal}
                    clients={clients}
                    employees={employees}
                    reception={modal.type === 'edit' ? modal.data : null}
                />
            )}

            {/* Diálogo para Eliminar Recepción */}
            {modal.type === 'delete' && modal.data && (
                <ReceptionDeleteDialog
                    isOpen={modal.type === 'delete'}
                    onClose={closeModal}
                    reception={modal.data}
                />
            )}
        </>
    );
}
