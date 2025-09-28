"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { WarehouseFormModal } from "./warehouse-form-modal";
import { SectionFormModal } from "./section-form-modal";
import { deleteWarehouse } from "@/app/(protected)/warehouse/actions";
import { useToast } from "@/hooks/use-toast";
import type { Almacen, Seccion } from "@/lib/types";

type WarehouseManagerProps = {
    initialData: Almacen[];
};

export function WarehouseManager({ initialData }: WarehouseManagerProps) {
    const [warehouses, setWarehouses] = React.useState(initialData);
    const [isWarehouseModalOpen, setWarehouseModalOpen] = React.useState(false);
    const [editingWarehouse, setEditingWarehouse] = React.useState<Almacen | null>(null);
    const [isSectionModalOpen, setSectionModalOpen] = React.useState(false);
    const [sectionWarehouseId, setSectionWarehouseId] = React.useState<number | null>(null);
    const [editingSection, setEditingSection] = React.useState<Seccion | null>(null);
    const { toast } = useToast();

    const openAddWarehouse = () => {
        setEditingWarehouse(null);
        setWarehouseModalOpen(true);
    };

    const openEditWarehouse = (warehouse: Almacen) => {
        setEditingWarehouse(warehouse);
        setWarehouseModalOpen(true);
    };

    const openAddSection = (warehouseId: number) => {
        setEditingSection(null);
        setSectionWarehouseId(warehouseId);
        setSectionModalOpen(true);
    };

    const handleDeleteWarehouse = async (warehouseId: number) => {
        const confirmDelete = confirm("¿Está seguro que desea eliminar este almacén? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;
        const result = await deleteWarehouse(warehouseId);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
            setWarehouses((prev) => prev.filter((w) => w.id !== warehouseId));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openAddWarehouse}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Almacén
                </Button>
            </div>
            {warehouses.map((warehouse) => (
                <Card key={warehouse.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-4">{warehouse.nombre} <Badge variant="outline">{warehouse.secciones?.length || 0} secciones</Badge></CardTitle>
                                <CardDescription>
                                    Administra las secciones y lotes de este almacén.
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAddSection(warehouse.id)}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Sección
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {warehouse.secciones && warehouse.secciones.map((section) => (
                                <AccordionItem value={String(section.id)} key={section.id} className="border-b-0">
                                    <Card className="mb-2">
                                        <CardHeader className="p-4">
                                            <AccordionTrigger className="p-0 hover:no-underline">
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="font-semibold text-md">{section.nombre}</span>
                                                </div>
                                            </AccordionTrigger>
                                        </CardHeader>
                                        <AccordionContent>
                                            <CardContent className="pl-8 pr-4 pb-4">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-semibold text-muted-foreground">Lotes en esta sección</h4>
                                                        <Button variant="outline" size="sm">
                                                            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Lote
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">La funcionalidad para visualizar y gestionar lotes estará disponible aquí.</p>
                                                </div>
                                            </CardContent>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                            {(!warehouse.secciones || warehouse.secciones.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Este almacén no tiene secciones.</p>
                                    <Button
                                        variant="link"
                                        className="mt-2"
                                        onClick={() => openAddSection(warehouse.id)}
                                    >
                                        Agregar la primera sección
                                    </Button>
                                </div>
                            )}
                        </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => openEditWarehouse(warehouse)}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Editar Almacén
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar Almacén
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            <WarehouseFormModal
                isOpen={isWarehouseModalOpen}
                onCloseAction={() => setWarehouseModalOpen(false)}
                warehouse={editingWarehouse ?? undefined}
            />
            {sectionWarehouseId !== null && (
                <SectionFormModal
                    isOpen={isSectionModalOpen}
                    onCloseAction={() => setSectionModalOpen(false)}
                    section={editingSection ?? undefined}
                    warehouseId={sectionWarehouseId}
                />
            )}
        </div>
    );
}
