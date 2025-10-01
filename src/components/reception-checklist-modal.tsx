// src/components/reception-checklist-modal.tsx

"use client";

import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, Empleado } from "@/lib/types";
import { getVehiclesByCustomerId, type Vehicle } from "@/app/(protected)/customers/actions";
import { createReceptionAndWorkOrder, updateReception, type Reception } from "@/app/(protected)/reception/actions";

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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";


const checklistItems = [
    { id: 'carroceria', label: 'Carrocería (golpes/rayones)' },
    { id: 'pintura', label: 'Estado de pintura' },
    { id: 'cristales', label: 'Cristales y espejos' },
    { id: 'faros', label: 'Faros y calaveras' },
    { id: 'llantas', label: 'Estado de llantas' },
    { id: 'tapones', label: 'Tapones o birlos de seguridad' },
    { id: 'asientos', label: 'Tapicería de asientos' },
    { id: 'tablero', label: 'Tablero sin cuarteaduras' },
    { id: 'indicadores', label: 'Indicadores del tablero' },
    { id: 'stereo', label: 'Estéreo y bocinas' },
    { id: 'ac', label: 'Aire Acondicionado / Calefacción' },
    { id: 'interiores', label: 'Limpieza de interiores' },
    { id: 'cinturones', label: 'Cinturones de seguridad' },
    { id: 'tapetes', label: 'Tapetes' },
    { id: 'llanta_refaccion', label: 'Llanta de refacción' },
    { id: 'gato_cruceta', label: 'Gato y cruceta' },
    { id: 'herramienta', label: 'Herramienta básica' },
    { id: 'triangulos', label: 'Triángulos de seguridad' },
    { id: 'extintor', label: 'Extintor' },
    { id: 'documentos', label: 'Documentos (tarjeta/póliza)' },
    { id: 'llaves', label: 'Llaves del vehículo' },
    { id: 'objetos_personales', label: 'Sin objetos personales de valor' },
    { id: 'nivel_aceite', label: 'Nivel de aceite' },
    { id: 'nivel_anticongelante', label: 'Nivel de anticongelante' },
    { id: 'bateria', label: 'Batería y terminales' },
    { id: 'fugas_visibles', label: 'Sin fugas visibles' },
];


// El botón de envío ahora es más dinámico
function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar Cambios" : "Generar Orden de Servicio"}
        </Button>
    );
}

type ReceptionChecklistModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    clients: Cliente[];
    employees: Empleado[];
    reception?: Reception | null; // <-- Prop opcional para edición
};

export function ReceptionChecklistModal({
                                            isOpen,
                                            onCloseAction,
                                            clients,
                                            reception,
                                        }: ReceptionChecklistModalProps) {
    const { toast } = useToast();
    const isEditing = !!reception;

    const formAction = isEditing ? updateReception : createReceptionAndWorkOrder;
    const [state, dispatchFormAction] = useActionState(formAction, undefined);
    const formRef = React.useRef<HTMLFormElement>(null);

    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
    const [selectedClientId, setSelectedClientId] = React.useState<string>(reception?.cliente_id?.toString() || "");
    const [fuelLevelValue, setFuelLevelValue] = React.useState(50); // Manejo más complejo si se guarda

    // Cargar vehículos cuando se selecciona un cliente o al abrir en modo edición
    useEffect(() => {
        if (selectedClientId) {
            getVehiclesByCustomerId(Number(selectedClientId)).then(setVehicles);
        } else {
            setVehicles([]);
        }
    }, [selectedClientId]);

    // Efecto para manejar la respuesta del servidor (crear/actualizar)
    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                onCloseAction();
            }
        }
    }, [state, toast, onCloseAction]);

    // Resetear el formulario al cerrar
    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
            setSelectedClientId("");
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Recepción" : "Registrar Recepción de Vehículo"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Actualice los datos de la recepción." : "Complete el checklist para crear una nueva Orden de Servicio."}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={dispatchFormAction} className="space-y-4">
                    {/* Campo oculto para el ID en modo edición */}
                    {isEditing && <input type="hidden" name="receptionId" value={reception.id} />}

                    <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)]">
                        <div className="space-y-6">
                            {/* Sección de Datos Principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="clientId">Cliente</Label>
                                    <Select name="clientId" onValueChange={setSelectedClientId} defaultValue={reception?.cliente_id?.toString()}>
                                        <SelectTrigger id="clientId"><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger>
                                        <SelectContent>{clients.map((client) => (<SelectItem key={client.id} value={String(client.id)}>{client.razon_social}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleId">Vehículo</Label>
                                    <Select name="vehicleId" disabled={!selectedClientId} defaultValue={reception?.vehiculo_id?.toString()}>
                                        <SelectTrigger id="vehicleId"><SelectValue placeholder="Seleccione un vehículo" /></SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((vehicle) => (
                                                <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                                                    {`${vehicle.marca} ${vehicle.modelo} ${vehicle.anio || ''} (${vehicle.placas || 'N/A'})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mileage">Kilometraje</Label>
                                <Input id="mileage" name="mileage" type="number" placeholder="Ej. 55000" defaultValue={reception?.kilometraje || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="serviceReason">Falla o Servicio Solicitado</Label>
                                <Textarea id="serviceReason" name="serviceReason" placeholder="Ej. El motor hace un ruido extraño..." defaultValue={reception?.diagnostico_ini || ''} />
                            </div>

                            <Separator />

                            <h3 className="text-lg font-semibold">Inventario de Recepción</h3>
                            <div className="space-y-2">
                               <Label>Nivel de Gasolina: {fuelLevelValue}%</Label>
                                <Slider name="fuelLevel" defaultValue={[50]} max={100} step={1} onValueChange={(value) => setFuelLevelValue(value[0])}/>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {checklistItems.map((item) => (
                                    <div key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox 
                                            id={item.id} 
                                            name={`checklist_${item.id}`}
                                            defaultChecked={isEditing && reception.checklist_data && reception.checklist_data[item.id]}
                                        />
                                        <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
