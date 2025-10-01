// src/components/reception-delete-dialog.tsx
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteReception } from "@/app/(protected)/reception/actions";
import type { Reception } from "@/app/(protected)/reception/actions";

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
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type ReceptionDeleteDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    reception: Reception;
};

export function ReceptionDeleteDialog({ isOpen, onClose, reception }: ReceptionDeleteDialogProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteReception(reception.id);
        setIsDeleting(false);

        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        if (result.success) {
            onClose();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la orden de servicio con folio{" "}
                        <strong>{reception.folio}</strong>. Si la orden ya tiene servicios, refacciones o pagos registrados, no podrá ser eliminada.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sí, eliminar recepción
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
