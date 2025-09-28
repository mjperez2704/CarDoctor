"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { toggleUserStatus } from "@/app/(protected)/users/actions";
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
import type { UserWithRoles } from "@/app/(protected)/users/actions";

interface UserStatusDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    user: UserWithRoles | null;
}

export function UserStatusDialog({ isOpen, onCloseAction, user }: UserStatusDialogProps) {
    const { toast } = useToast();
    if (!user) return null;

    const isActive = user.activo;

    const handleToggle = async () => {
        const result = await toggleUserStatus(user.id, user.activo);
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
                    <AlertDialogTitle>¿Confirmar cambio de estado?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se va a {isActive ? 'desactivar' : 'activar'} al usuario{" "}
                        <strong>{user.nombre} {user.apellido_p}</strong>.
                        Un usuario desactivado no podrá iniciar sesión.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggle}>
                        Sí, {isActive ? 'Desactivar' : 'Activar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
