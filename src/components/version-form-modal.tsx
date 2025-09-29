// src/components/version-form-modal.tsx
"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { createVersion } from "@/app/(protected)/catalogs/brands/actions";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

// Botón de envío que muestra estado de carga
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Versión
        </Button>
    );
}

type VersionFormModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    model: { id: number; nombre: string }; // Pasamos el objeto del modelo
};

export function VersionFormModal({ isOpen, onCloseAction, model }: VersionFormModalProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(createVersion, undefined);
    const formRef = React.useRef<HTMLFormElement>(null);

    // Efecto para mostrar el toast con el resultado y cerrar el modal
    React.useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                onCloseAction();
            }
        }
    }, [state, toast, onCloseAction]);

    // Reseteamos el formulario cuando se cierra el modal
    React.useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
        }
    }, [isOpen]);

    if (!model) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Versión</DialogTitle>
                    <DialogDescription>
                        Añade una nueva versión para el modelo <strong>{model.nombre}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {/* Campo oculto para enviar el ID del modelo */}
                    <input type="hidden" name="modelo_id" value={model.id} />

                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre de la Versión</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            placeholder="Ej. LTS HASHBACK"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCloseAction}>
                            Cancelar
                        </Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
