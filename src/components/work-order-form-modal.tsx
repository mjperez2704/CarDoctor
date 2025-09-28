// src/components/work-order-form-modal.tsx
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, Empleado } from "@/lib/types";
import { getVehiclesByCustomerId, type Vehicle } from "@/app/(protected)/customers/actions";
import { saveWorkOrder } from "@/app/(protected)/work-orders/actions";
import type { WorkOrder } from "@/app/(protected)/work-orders/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Orden'}
        </Button>
    );
}

type WorkOrderFormModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    clients: Cliente[];
    employees: Empleado[];
    order?: WorkOrder | null;
};

export function WorkOrderFormModal({ isOpen, onCloseActionAction, clients, employees, order }: WorkOrderFormModalProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(saveWorkOrder, undefined);
    const formRef = React.useRef<HTMLFormElement>(null);
    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
    const [selectedClientId, setSelectedClientId] = React.useState<string>(String(order?.cliente_id || ""));
    const isEditing = !!order;
    const technicians = employees.filter(e => e.puesto?.toLowerCase().includes('mecánico') || e.puesto?.toLowerCase().includes('técnico'));

    useEffect(() => {
        if (selectedClientId) {
            getVehiclesByCustomerId(Number(selectedClientId)).then(setVehicles);
        } else {
            setVehicles([]);
        }
    }, [selectedClientId]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) onCloseActionAction();
        }
    }, [state, toast, onCloseActionAction]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
            setSelectedClientId("");
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? `Editar Orden de Servicio: ${order.folio}` : 'Crear Nueva Orden de Servicio'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modifica los datos de la orden.' : 'Complete los datos para registrar un nuevo vehículo en el taller.'}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={order.id} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientId">Cliente</Label>
                            <Select name="clientId" onValueChange={setSelectedClientId} defaultValue={String(order?.cliente_id ?? '')}>
                                <SelectTrigger><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger>
                                <SelectContent>{clients.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.razon_social}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleId">Vehículo</Label>
                            <Select name="vehicleId" disabled={!selectedClientId} defaultValue={String(order?.vehiculo_id ?? '')}>
                                <SelectTrigger><SelectValue placeholder="Seleccione un vehículo" /></SelectTrigger>
                                <SelectContent>{vehicles.map((v) => (<SelectItem key={v.id} value={String(v.id)}>{`${v.marca} ${v.modelo} (${v.placas || 'N/A'})`}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="initialDiagnosis">Falla o Servicio Solicitado</Label>
                        <Textarea id="initialDiagnosis" name="initialDiagnosis" placeholder="Ej. El motor hace un ruido extraño..." defaultValue={order?.diagnostico_ini ?? ''}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="technicianId">Asignar a Técnico (Opcional)</Label>
                            <Select name="technicianId" defaultValue={String(order?.tecnico_id ?? '')}>
                                <SelectTrigger><SelectValue placeholder="Asignar a un técnico" /></SelectTrigger>
                                <SelectContent>{technicians.map((t) => (<SelectItem key={t.id} value={String(t.id)}>{t.nombre} {t.apellido_p}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        {isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado de la Orden</Label>
                                <Select name="estado" defaultValue={order.estado}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RECEPCION">Recepción</SelectItem>
                                        <SelectItem value="DIAGNOSTICO">Diagnóstico</SelectItem>
                                        <SelectItem value="AUTORIZACION">En Autorización</SelectItem>
                                        <SelectItem value="EN_REPARACION">En Reparación</SelectItem>
                                        <SelectItem value="LISTO">Listo para Entrega</SelectItem>
                                        <SelectItem value="ENTREGADO">Entregado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCloseActionAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
