"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Sucursal } from "../actions";

// ===== INICIO DE LA MODIFICACIÓN =====
interface BranchSelectorModalProps {
    isOpen: boolean;
    sucursales: Sucursal[];
    onSelectBranchAction: (branchId: string) => void; // <-- PROP RENOMBRADA
}

export function BranchSelectorModal({ isOpen, sucursales, onSelectBranchAction }: BranchSelectorModalProps) {
// ===== FIN DE LA MODIFICACIÓN =====
    const [selectedId, setSelectedId] = React.useState<string>("");

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>SELECCIONAR SUCURSAL</DialogTitle>
                    <DialogDescription>
                        Elige la sucursal desde la que operarás el punto de venta.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Select onValueChange={setSelectedId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una sucursal..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sucursales.map(s => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                    {s.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    {/* ===== INICIO DE LA MODIFICACIÓN ===== */}
                    <Button onClick={() => onSelectBranchAction(selectedId)} disabled={!selectedId}>
                        Continuar
                    </Button>
                    {/* ===== FIN DE LA MODIFICACIÓN ===== */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
