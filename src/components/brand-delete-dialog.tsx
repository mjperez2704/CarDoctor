
// src/components/brand-delete-dialog.tsx
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteBrand } from "@/app/(protected)/catalogs/brands/actions";
import type { BrandWithDetails } from "@/app/(protected)/catalogs/brands/actions";

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

type BrandDeleteDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    brand: BrandWithDetails;
};

export function BrandDeleteDialog({ isOpen, onClose, brand }: BrandDeleteDialogProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteBrand(brand.id);
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
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la marca{" "}
                        <strong>{brand.nombre}</strong> y todos sus datos asociados del sistema.
                        Si la marca tiene modelos, no podrá ser eliminada.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Eliminar
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
