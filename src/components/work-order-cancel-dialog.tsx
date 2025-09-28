"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { cancelWorkOrder } from "@/app/(protected)/work-orders/actions";
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
import type { WorkOrder } from "@/app/(protected)/work-orders/actions";

interface WorkOrderCancelDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    order: WorkOrder | null;
}

export function WorkOrderCancelDialog({ isOpen, onCloseAction, order }: WorkOrderCancelDialogProps) {
    const { toast } = useToast();
    if (!order) return null;

    const handleCancel = async () => {
        const result = await cancelWorkOrder(order.id);
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
                    <AlertDialogTitle>¿Confirmas la cancelación?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. La orden de servicio con folio{" "}
                        <strong>{order.folio}</strong> se marcará como CANCELADA.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No, mantener orden</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                        Sí, cancelar orden
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
