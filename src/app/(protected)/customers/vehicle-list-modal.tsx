"use client";
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PlusCircle } from 'lucide-react';
// CORRECCIÓN: Se importa el tipo completo 'CustomerWithVehicleCount'
import { getVehiclesByCustomerId, type Vehicle, type CustomerWithVehicleCount } from './actions';
import { useCustomerModal } from './customer-modals';

// CORRECCIÓN: Se renombra la prop 'onCloseActionAction' para seguir la convención
interface VehicleListModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    customer: CustomerWithVehicleCount; // CORRECCIÓN: Se usa el tipo completo
}

export function VehicleListModal({ isOpen, onCloseAction, customer }: VehicleListModalProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { onOpen } = useCustomerModal();

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getVehiclesByCustomerId(customer.id)
                .then(data => {
                    setVehicles(data);
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, customer.id]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Vehículos de {customer.razon_social}</DialogTitle>
                    <DialogDescription>
                        Listado de todos los vehículos registrados para este cliente.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Placas</TableHead>
                                    <TableHead>Marca</TableHead>
                                    <TableHead>Modelo</TableHead>
                                    <TableHead>Año</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead>VIN</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.length > 0 ? (
                                    vehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.placas || 'N/A'}</TableCell>
                                            <TableCell>{vehicle.marca || 'N/A'}</TableCell>
                                            <TableCell>{vehicle.modelo || 'N/A'}</TableCell>
                                            <TableCell>{vehicle.anio || 'N/A'}</TableCell>
                                            <TableCell>{vehicle.color || 'N/A'}</TableCell>
                                            <TableCell>{vehicle.vin || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            Este cliente no tiene vehículos registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <DialogFooter className="justify-between">
                    <Button variant="ghost" onClick={onCloseAction}>Cerrar</Button>
                    <Button onClick={() => onOpen('addVehicle', { customer })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Vehículo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
