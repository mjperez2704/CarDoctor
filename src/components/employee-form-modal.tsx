"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveEmployee } from "@/app/(protected)/employees/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import type { Employee } from "@/app/(protected)/employees/actions";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Guardar Empleado'}
        </Button>
    );
}

type EmployeeFormModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    employee?: Employee | null;
};

export function EmployeeFormModal({ isOpen, onCloseActionAction, employee }: EmployeeFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveEmployee, undefined);
    const isEditing = !!employee;

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
                    <DialogTitle>{isEditing ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los datos de ${employee.nombre}` : "Complete los datos para registrar un nuevo empleado."}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={employee.id} />}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre(s)</Label>
                            <Input id="nombre" name="nombre" placeholder="Juan" required defaultValue={employee?.nombre ?? ''}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apellido_p">Apellido(s)</Label>
                            <Input id="apellido_p" name="apellido_p" placeholder="Pérez" required defaultValue={employee?.apellido_p ?? ''}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="juan.perez@taller.com" defaultValue={employee?.email ?? ''}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="puesto">Puesto</Label>
                        <Input id="puesto" name="puesto" placeholder="Mecánico B" defaultValue={employee?.puesto ?? ''}/>
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
