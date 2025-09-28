"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveCustomer } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { CustomerWithVehicleCount } from "./actions";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar Cambios" : "Guardar Cliente"}
        </Button>
    );
}

// CORRECCIÓN: Se renombra la prop 'onCloseActionAction' a 'onCloseAction'
interface CustomerFormModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    customer?: CustomerWithVehicleCount | null;
}

export function CustomerFormModal({ isOpen, onCloseAction, customer }: CustomerFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveCustomer, undefined);

    const isEditing = !!customer;

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            // CORRECCIÓN: Se usa la prop con el nombre corregido
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
        }
    }, [isOpen]);

    return (
        // CORRECCIÓN: Se usa la prop con el nombre corregido
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los datos del cliente ${customer?.razon_social}.` : "Complete los datos para registrar un nuevo cliente."}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={customer.id} />}
                    <div className="space-y-2">
                        <Label htmlFor="razon_social">Nombre o Razón Social</Label>
                        <Input id="razon_social" name="razon_social" placeholder="Nombre completo del cliente o empresa" required defaultValue={customer?.razon_social ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rfc">RFC</Label>
                        <Input id="rfc" name="rfc" placeholder="Registro Federal de Contribuyentes" defaultValue={customer?.rfc ?? ''}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" defaultValue={customer?.email ?? ''}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" name="telefono" placeholder="Ej. 55-1234-5678" defaultValue={customer?.telefono ?? ''}/>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        {/* CORRECCIÓN: Se usa la prop con el nombre corregido */}
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
