// src/components/tool-form-modal.tsx
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { saveTool, type Tool } from "@/app/(protected)/catalogs/tools/actions";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Guardar Herramienta'}
        </Button>
    );
}

type ToolFormModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    tool?: Tool | null;
};

export function ToolFormModal({ isOpen, onCloseAction, tool }: ToolFormModalProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveTool, undefined);
    const isEditing = !!tool;
    const [date, setDate] = React.useState<Date | undefined>(
        tool?.fecha_compra ? parseISO(tool.fecha_compra) : undefined
    );

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
            setDate(undefined);
        } else {
            setDate(tool?.fecha_compra ? parseISO(tool.fecha_compra) : undefined);
        }
    }, [isOpen, tool]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Herramienta' : 'Agregar Nueva Herramienta'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={tool.id} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="sku">SKU</Label><Input id="sku" name="sku" required defaultValue={tool?.sku ?? ''} /></div>
                        <div><Label htmlFor="nombre">Nombre</Label><Input id="nombre" name="nombre" required defaultValue={tool?.nombre ?? ''} /></div>
                    </div>
                    <div><Label htmlFor="descripcion">Descripción</Label><Textarea id="descripcion" name="descripcion" defaultValue={tool?.descripcion ?? ''} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="marca">Marca</Label><Input id="marca" name="marca" defaultValue={tool?.marca ?? ''} /></div>
                        <div><Label htmlFor="modelo">Modelo</Label><Input id="modelo" name="modelo" defaultValue={tool?.modelo ?? ''} /></div>
                    </div>
                    <div><Label htmlFor="numero_serie">Número de Serie</Label><Input id="numero_serie" name="numero_serie" defaultValue={tool?.numero_serie ?? ''} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fecha_compra">Fecha de Compra</Label>
                            <Popover><PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: es}) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent></Popover>
                            <input type="hidden" name="fecha_compra" value={date?.toISOString() ?? ''} />
                        </div>
                        <div><Label htmlFor="costo">Costo</Label><Input id="costo" name="costo" type="number" step="0.01" defaultValue={tool?.costo ?? 0}/></div>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing}/>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
