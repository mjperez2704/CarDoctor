"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteQuote } from "@/app/(protected)/quotes/actions";
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
import type { Quote } from "@/app/(protected)/quotes/actions";

interface QuoteDeleteDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    quote: Quote | null;
}

export function QuoteDeleteDialog({ isOpen, onCloseAction, quote }: QuoteDeleteDialogProps) {
    const { toast } = useToast();
    if (!quote) return null;

    const handleDelete = async () => {
        const result = await deleteQuote(quote.id);
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
                    <AlertDialogTitle>¿Estás seguro de eliminar la cotización?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la cotización{" "}
                        <strong>{quote.folio}</strong>.
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
