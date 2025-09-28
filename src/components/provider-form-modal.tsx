"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveProvider } from "@/app/(protected)/providers/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import type { Provider } from "@/app/(protected)/providers/actions";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Guardar Proveedor'}
        </Button>
    );
}

type ProviderFormModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    provider?: Provider | null;
};

export function ProviderFormModal({ isOpen, onCloseActionAction, provider }: ProviderFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveProvider, undefined);
    const isEditing = !!provider;

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los datos de ${provider?.razon_social}` : 'Complete los datos para registrar un nuevo proveedor.'}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={provider.id} />}
                    <div className="space-y-2">
                        <Label htmlFor="razon_social">Razón Social</Label>
                        <Input id="razon_social" name="razon_social" placeholder="Nombre comercial del proveedor" required defaultValue={provider?.razon_social ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rfc">RFC</Label>
                        <Input id="rfc" name="rfc" placeholder="Registro Federal de Contribuyentes" defaultValue={provider?.rfc ?? ''}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="contacto@proveedor.com" defaultValue={provider?.email ?? ''}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" name="telefono" placeholder="Ej. 55-1234-5678" defaultValue={provider?.telefono ?? ''}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dias_credito">Días de Crédito</Label>
                        <Input id="dias_credito" name="dias_credito" type="number" defaultValue={provider?.dias_credito ?? 0} />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onCloseActionAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
