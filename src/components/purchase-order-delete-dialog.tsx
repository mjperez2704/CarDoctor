"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { deletePurchaseOrder } from "@/app/(protected)/purchases/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { PurchaseOrder } from "@/app/(protected)/purchases/actions";

interface PurchaseOrderDeleteDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    order: PurchaseOrder | null;
}

export function PurchaseOrderDeleteDialog({ isOpen, onCloseAction, order }: PurchaseOrderDeleteDialogProps) {
    const { toast } = useToast();
    if (!order) return null;

    const handleDelete = async () => {
        const result = await deletePurchaseOrder(order.id);
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
                    <AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se eliminará permanentemente la orden de compra <strong>{order.folio}</strong>. Esta acción no se puede deshacer.
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
