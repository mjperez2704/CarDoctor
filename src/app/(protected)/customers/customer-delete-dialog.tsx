// src/app/(protected)/customers/customer-delete-dialog.tsx
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteCustomer } from "./actions";
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
import type { CustomerWithVehicleCount } from "./actions";

interface CustomerDeleteDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    customer: CustomerWithVehicleCount | null;
}

export function CustomerDeleteDialog({ isOpen, onCloseAction, customer }: CustomerDeleteDialogProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!customer) return;

        const result = await deleteCustomer(customer.id);

        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        onCloseAction();
    };

    if (!customer) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente al cliente{" "}
                        <strong>{customer.razon_social}</strong> y todos sus vehículos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Sí, eliminar cliente
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
