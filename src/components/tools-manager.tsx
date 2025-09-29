"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, ListFilter, File } from "lucide-react";
import type { Empleado } from "@/lib/types";
import type { Tool } from "@/app/(protected)/catalogs/tools/actions";
import { Badge } from "./ui/badge";
import { ToolFormModal } from "./tool-form-modal";
import { ToolStatusDialog } from "./tool-status-dialog";

export function ToolsManager({ initialTools, employees }: {
    initialTools: Tool[];
    employees: Empleado[];
}) {
    const [tools, setTools] = React.useState(initialTools);
    const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isStatusDialogOpen, setStatusDialogOpen] = React.useState(false);
    const [targetStatus, setTargetStatus] = React.useState<Tool['estado']>('DISPONIBLE');

    React.useEffect(() => {
        setTools(initialTools);
    }, [initialTools]);

    const handleOpenFormModal = (tool: Tool | null) => {
        setSelectedTool(tool);
        setFormModalOpen(true);
    };

    const handleOpenStatusDialog = (tool: Tool, status: Tool['estado']) => {
        setSelectedTool(tool);
        setTargetStatus(status);
        setStatusDialogOpen(true);
    };

    const statusVariant: Record<Tool["estado"], "default" | "secondary" | "destructive" | "outline"> = {
        DISPONIBLE: "default", ASIGNADA: "secondary", EN_MANTENIMIENTO: "outline", DE_BAJA: "destructive",
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1"><ListFilter className="h-3.5 w-3.5" /><span>Filtrar</span></Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1"><File className="h-3.5 w-3.5" /><span>Exportar</span></Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenFormModal(null)}><PlusCircle className="h-3.5 w-3.5" /><span>Agregar Herramienta</span></Button>
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
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tools.map((tool) => (
                                <TableRow key={tool.id}>
                                    <TableCell className="font-medium">{tool.sku}</TableCell>
                                    <TableCell>{tool.nombre}</TableCell>
                                    <TableCell>{tool.marca || '-'} / {tool.modelo || '-'}</TableCell>
                                    <TableCell><Badge variant={statusVariant[tool.estado]}>{tool.estado.replace('_', ' ')}</Badge></TableCell>
                                    <TableCell>{tool.asignada_a_nombre || "N/A"}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(tool)}>Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => handleOpenStatusDialog(tool, 'ASIGNADA')} disabled={tool.estado === 'ASIGNADA'}>Asignar a Técnico</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenStatusDialog(tool, 'EN_MANTENIMIENTO')}>Enviar a Mantenimiento</DropdownMenuItem>
                                                {tool.estado !== 'DISPONIBLE' && <DropdownMenuItem onSelect={() => handleOpenStatusDialog(tool, 'DISPONIBLE')}>Marcar como Disponible</DropdownMenuItem>}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenStatusDialog(tool, 'DE_BAJA')}>Dar de Baja</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ToolFormModal
                isOpen={isFormModalOpen}
                onCloseAction={() => setFormModalOpen(false)}
                tool={selectedTool}
            />

            <ToolStatusDialog
                isOpen={isStatusDialogOpen}
                onCloseAction={() => setStatusDialogOpen(false)}
                tool={selectedTool}
                targetStatus={targetStatus}
                employees={employees}
            />
        </>
    );
}
