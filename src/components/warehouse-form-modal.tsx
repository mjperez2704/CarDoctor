"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveWarehouse } from "@/app/(protected)/warehouse/actions";
import type { Almacen } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEditing ? 'Guardar Cambios' : 'Crear Almacén'}</Button>;
}

type WarehouseFormModalProps = { isOpen: boolean; onCloseAction: () => void; warehouse?: Almacen | null; };

export function WarehouseFormModal({ isOpen, onCloseAction, warehouse }: WarehouseFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveWarehouse, undefined);
    const isEditing = !!warehouse;

    useEffect(() => {
        if (state?.message) {
            toast({ title: state.success ? "Éxito" : "Error", description: state.message, variant: state.success ? "default" : "destructive" });
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => { if (!isOpen) formRef.current?.reset(); }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader><DialogTitle>{isEditing ? 'Editar Almacén' : 'Nuevo Almacén'}</DialogTitle></DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={warehouse.id} />}
                    <div><Label htmlFor="nombre">Nombre</Label><Input id="nombre" name="nombre" required defaultValue={warehouse?.nombre ?? ''} /></div>
                    <div><Label htmlFor="clave">Clave Única</Label><Input id="clave" name="clave" required defaultValue={warehouse?.clave ?? ''} /></div>
                    <div><Label htmlFor="tipo">Tipo</Label>
                        <Select name="tipo" required defaultValue={warehouse?.tipo ?? 'PRINCIPAL'}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRINCIPAL">Principal</SelectItem>
                                <SelectItem value="SUCURSAL">Sucursal</SelectItem>
                                <SelectItem value="BODEGA">Bodega</SelectItem>
                                <SelectItem value="TRANSITO">En Tránsito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
