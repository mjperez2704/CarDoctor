"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import type { Proveedor, Marca } from "@/lib/types";
import { saveProduct } from "@/app/(protected)/inventory/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import type { ProductWithStock } from "@/app/(protected)/inventory/actions";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar Cambios" : "Guardar Producto"}
        </Button>
    );
}

type ProductFormModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    providers: Proveedor[];
    brands: Marca[];
    product?: ProductWithStock | null;
};

export function ProductFormModal({ isOpen, onCloseActionAction, providers, brands, product }: ProductFormModalProps) {
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveProduct, undefined);
    const isEditing = !!product;

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) onCloseActionAction();
        }
    }, [state, toast, onCloseActionAction]);

    useEffect(() => {
        if (!isOpen) formRef.current?.reset();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los datos de ${product.nombre}` : 'Complete los campos para registrar un nuevo producto en el catálogo.'}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction}>
                    <div className="overflow-y-auto pr-6 h-[calc(90vh-200px)] space-y-4">
                        {isEditing && <input type="hidden" name="id" value={product.id} />}
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" name="sku" placeholder="Ej. FIL-ACE-01" required defaultValue={product?.sku ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre / Descripción</Label>
                            <Input id="nombre" name="nombre" placeholder="Ej. Filtro de Aceite para Versa" required defaultValue={product?.nombre ?? ''} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="precio_lista">Precio de Lista</Label>
                                <Input id="precio_lista" name="precio_lista" type="number" step="0.01" required defaultValue={product?.precio_lista ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="costo_promedio">Costo</Label>
                                <Input id="costo_promedio" name="costo_promedio" type="number" step="0.01" required defaultValue={product?.costo_promedio ?? ''} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stock_min">Stock Mínimo</Label>
                                <Input id="stock_min" name="stock_min" type="number" defaultValue={product?.stock_min ?? 0}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock_max">Stock Máximo</Label>
                                <Input id="stock_max" name="stock_max" type="number" defaultValue={product?.stock_max ?? 0}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="unidad">Unidad</Label>
                                <Select name="unidad" required defaultValue={product?.unidad ?? ''}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione una unidad"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PZA">Pieza (PZA)</SelectItem>
                                        <SelectItem value="KIT">Kit</SelectItem>
                                        <SelectItem value="SRV">Servicio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoria_id">Categoría</Label>
                                <Select name="categoria_id" required defaultValue={String(product?.categoria_id ?? '')}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione una categoría"/></SelectTrigger>
                                    <SelectContent>
                                        {/* TODO: Cargar categorías desde la BD */}
                                        <SelectItem value="1">Filtros</SelectItem>
                                        <SelectItem value="2">Lubricantes</SelectItem>
                                        <SelectItem value="3">Frenos</SelectItem>
                                        <SelectItem value="4">Servicios</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCloseActionAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
