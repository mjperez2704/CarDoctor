"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { updateToolStatus, type Tool } from "@/app/(protected)/catalogs/tools/actions";
import type { Empleado } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

// CORRECCIÓN: Se renombra la prop 'onClose'
interface ToolStatusDialogProps {
    isOpen: boolean;
    onCloseAction: () => void;
    tool: Tool | null;
    targetStatus: Tool['estado'];
    employees: Empleado[];
}

export function ToolStatusDialog({ isOpen, onCloseAction, tool, targetStatus, employees }: ToolStatusDialogProps) {
    const { toast } = useToast();
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
    if (!tool) return null;

    const technicians = employees.filter(e => e.puesto?.toLowerCase().includes('mecánico') || e.puesto?.toLowerCase().includes('técnico'));

    const handleConfirm = async () => {
        if (targetStatus === 'ASIGNADA' && !selectedEmployeeId) {
            toast({ title: "Error", description: "Debe seleccionar un técnico.", variant: "destructive" });
            return;
        }
        const result = await updateToolStatus(tool.id, targetStatus, selectedEmployeeId);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        // CORRECCIÓN: Se llama a la prop con el nuevo nombre
        onCloseAction();
    };

    const actionTextMap: Record<Tool['estado'], string> = {
        ASIGNADA: "Asignar",
        EN_MANTENIMIENTO: "Enviar a Mantenimiento",
        DE_BAJA: "Dar de Baja",
        DISPONIBLE: "Marcar como Disponible"
    }

    return (
        // CORRECCIÓN: Se pasa la prop con el nuevo nombre
        <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmas la acción?</AlertDialogTitle>
                    <AlertDialogDescription>
                        La herramienta <strong>{tool.nombre}</strong> cambiará su estado a <strong>{targetStatus.replace('_', ' ')}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {targetStatus === 'ASIGNADA' && (
                    <div className="space-y-2 my-4">
                        <Label htmlFor="technician">Asignar a Técnico</Label>
                        <Select onValueChange={(value) => setSelectedEmployeeId(Number(value))}>
                            <SelectTrigger id="technician"><SelectValue placeholder="Seleccionar técnico..."/></SelectTrigger>
                            <SelectContent>
                                {technicians.map(tech => (
                                    <SelectItem key={tech.id} value={String(tech.id)}>{tech.nombre} {tech.apellido_p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className={targetStatus === 'DE_BAJA' ? "bg-destructive hover:bg-destructive/90" : ""}>
                        {actionTextMap[targetStatus]}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
