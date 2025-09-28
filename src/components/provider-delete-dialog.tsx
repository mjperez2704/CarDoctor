"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteProvider } from "@/app/(protected)/providers/actions";
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
import type { Provider } from "@/app/(protected)/providers/actions";

interface ProviderDeleteDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    provider: Provider | null;
}

export function ProviderDeleteDialog({ isOpen, onCloseAction, provider }: ProviderDeleteDialogProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!provider) return;
        const result = await deleteProvider(provider.id);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        onCloseAction();
    };

    if (!provider) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de eliminar este proveedor?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente al proveedor{" "}
                        <strong>{provider.razon_social}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Sí, eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
