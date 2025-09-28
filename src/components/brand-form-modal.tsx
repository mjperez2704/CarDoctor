
// src/components/brand-form-modal.tsx
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { createBrand, updateBrand } from "@/app/(protected)/catalogs/brands/actions";
import type { BrandWithDetails } from "@/app/(protected)/catalogs/brands/actions";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar Cambios" : "Crear Marca"}
        </Button>
    );
}

type BrandFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    brand?: BrandWithDetails | null;
};

export function BrandFormModal({ isOpen, onClose, brand }: BrandFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const isEditing = !!brand;

    const action = isEditing ? updateBrand : createBrand;
    const [state, formAction] = useActionState(action, undefined);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                onClose();
            }
        }
    }, [state, toast, onClose]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Marca" : "Crear Nueva Marca"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los detalles de la marca ${brand.nombre}.` : "Añade una nueva marca al catálogo."}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={brand.id} />}

                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre de la Marca</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            placeholder="Ej. Toyota"
                            required
                            defaultValue={brand?.nombre}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pais_origen">País de Origen</Label>
                        <Input
                            id="pais_origen"
                            name="pais_origen"
                            placeholder="Ej. Japón"
                            defaultValue={brand?.pais_origen ?? ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tipo_marca">Tipo de Marca</Label>
                        <Select name="tipo_marca" defaultValue={brand?.tipo_marca ?? "AUTOS"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AUTOS">Autos</SelectItem>
                                <SelectItem value="REFACCIONES">Refacciones</SelectItem>
                                <SelectItem value="AMBOS">Ambos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
