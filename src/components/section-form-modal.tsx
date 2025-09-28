"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveSection } from "@/app/(protected)/warehouse/actions";
import type { Seccion } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar Cambios" : "Crear Sección"}
        </Button>
    );
}

// CORRECCIÓN: Se renombra la prop 'onClose'
export type SectionFormModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    section?: Seccion | null;
    warehouseId: number;
};

export function SectionFormModal({ isOpen, onCloseAction, section, warehouseId }: SectionFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveSection, undefined);
    const isEditing = !!section;

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            // CORRECCIÓN: Se llama a la prop con el nuevo nombre
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => {
        if (!isOpen) formRef.current?.reset();
    }, [isOpen]);

    return (
        // CORRECCIÓN: Se pasa la prop con el nuevo nombre
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Sección" : "Nueva Sección"}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={section!.id} />}
                    <input type="hidden" name="almacen_id" value={warehouseId} />
                    <div>
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" name="nombre" required defaultValue={section?.nombre ?? ""} />
                    </div>
                    <div>
                        <Label htmlFor="clave">Clave Única</Label>
                        <Input id="clave" name="clave" required defaultValue={section?.clave ?? ""} />
                    </div>
                    <div>
                        <Label htmlFor="almacen">Almacén</Label>
                        <Select name="almacen_id" defaultValue={String(warehouseId)} disabled>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value={String(warehouseId)}>{`ID ${warehouseId}`}</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        {/* CORRECCIÓN: Se llama a la prop con el nuevo nombre */}
                        <Button type="button" variant="ghost" onClick={onCloseAction}>
                            Cancelar
                        </Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
