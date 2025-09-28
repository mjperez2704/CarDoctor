"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { toggleEmployeeStatus } from "@/app/(protected)/employees/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Employee } from "@/app/(protected)/employees/actions";

interface EmployeeStatusDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    employee: Employee | null;
}

export function EmployeeStatusDialog({ isOpen, onCloseAction, employee }: EmployeeStatusDialogProps) {
    const { toast } = useToast();
    if (!employee) return null;

    const isActive = employee.activo;

    const handleToggleStatus = async () => {
        const result = await toggleEmployeeStatus(employee.id, employee.activo);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        onCloseAction();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmas el cambio de estado?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se va a {isActive ? 'desactivar' : 'activar'} al empleado{" "}
                        <strong>{employee.nombre} {employee.apellido_p}</strong>.
                        Un empleado desactivado no podrá ser asignado a nuevas tareas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggleStatus}>
                        Sí, {isActive ? 'Desactivar' : 'Activar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
