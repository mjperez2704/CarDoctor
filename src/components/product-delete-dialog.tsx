"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { deactivateProduct } from "@/app/(protected)/inventory/actions";
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
import type { ProductWithStock } from "@/app/(protected)/inventory/actions";

interface ProductDeleteDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    product: ProductWithStock | null;
}

export function ProductDeleteDialog({ isOpen, onCloseAction, product }: ProductDeleteDialogProps) {
    const { toast } = useToast();

    const handleDeactivate = async () => {
        if (!product) return;
        const result = await deactivateProduct(product.id);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        onCloseAction();
    };

    if (!product) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de dar de baja este producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción marcará el producto <strong>{product.nombre}</strong> como inactivo y no aparecerá en búsquedas ni listados. No se eliminará permanentemente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} className="bg-destructive hover:bg-destructive/90">
                        Sí, dar de baja
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
