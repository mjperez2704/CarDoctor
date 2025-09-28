"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, Empleado } from "@/lib/types";
import { getVehiclesByCustomerId, type Vehicle } from "@/app/(protected)/customers/actions";
import { createReceptionAndWorkOrder } from "@/app/(protected)/reception/actions";
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
import { PlusCircle, Loader2 } from "lucide-react";
import { Label } from "./ui/label";

// Botón de envío que muestra estado de carga
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generar Orden de Servicio
        </Button>
    );
}

type ReceptionChecklistModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    clients: Cliente[];
    employees: Empleado[];
};

export function ReceptionChecklistModal({
                                            isOpen,
                                            onCloseActionAction,
                                            clients,
                                        }: ReceptionChecklistModalProps) {
    const { toast } = useToast();
    const [isAddClientModalOpen, setIsAddClientModalOpen] = React.useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = React.useState(false);

    const [state, formAction] = useActionState(createReceptionAndWorkOrder, undefined);
    const formRef = React.useRef<HTMLFormElement>(null);

    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
    const [selectedClientId, setSelectedClientId] = React.useState<string>("");

    React.useEffect(() => {
        if (selectedClientId) {
            getVehiclesByCustomerId(Number(selectedClientId)).then(setVehicles);
        } else {
            setVehicles([]);
        }
    }, [selectedClientId]);

    React.useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                onCloseActionAction();
            }
        }
    }, [state, toast, onCloseActionAction]);

    React.useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
            setSelectedClientId("");
        }
    }, [isOpen]);

    const [fuelLevelValue, setFuelLevelValue] = React.useState(50);


    return (
        <>
            <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Registrar Recepción de Vehículo</DialogTitle>
                        <DialogDescription>
                            Complete el checklist y los datos para crear una nueva Orden de Servicio.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={formRef} action={formAction} className="space-y-4">
                        <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)]">
                            <div className="space-y-6">
                                {/* Sección de Datos Principales */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-grow space-y-2">
                                            <Label htmlFor="clientId">Cliente</Label>
                                            <Select name="clientId" onValueChange={setSelectedClientId}>
                                                <SelectTrigger id="clientId"><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger>
                                                <SelectContent>{clients.map((client) => (<SelectItem key={client.id} value={String(client.id)}>{client.razon_social}</SelectItem>))}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-grow space-y-2">
                                            <Label htmlFor="vehicleId">Vehículo</Label>
                                            <Select name="vehicleId" disabled={!selectedClientId}>
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
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mileage">Kilometraje</Label>
                                    <Input id="mileage" name="mileage" type="number" placeholder="Ej. 55000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="serviceReason">Falla o Servicio Solicitado</Label>
                                    <Textarea id="serviceReason" name="serviceReason" placeholder="Ej. El motor hace un ruido extraño al acelerar, revisar frenos..." />
                                </div>

                                <Separator />

                                <h3 className="text-lg font-semibold">Inventario de Recepción</h3>
                                <div className="space-y-2">
                                    <Label>Nivel de Gasolina: {fuelLevelValue}%</Label>
                                    <Slider name="fuelLevel" defaultValue={[50]} max={100} step={1} onValueChange={(value) => setFuelLevelValue(value[0])}/>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="spareTire" name="spareTire"/>
                                        <Label htmlFor="spareTire" className="font-normal">Llanta de Refacción</Label>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="jack" name="jack"/>
                                        <Label htmlFor="jack" className="font-normal">Gato Hidráulico</Label>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="jackHandle" name="jackHandle"/>
                                        <Label htmlFor="jackHandle" className="font-normal">Maneral de Gato</Label>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="lugWrench" name="lugWrench"/>
                                        <Label htmlFor="lugWrench" className="font-normal">Llave de Cruz</Label>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="stereo" name="stereo"/>
                                        <Label htmlFor="stereo" className="font-normal">Estéreo</Label>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <Checkbox id="carMats" name="carMats"/>
                                        <Label htmlFor="carMats" className="font-normal">Tapetes</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={onCloseActionAction}>Cancelar</Button>
                            <SubmitButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
