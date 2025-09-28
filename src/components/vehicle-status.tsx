"use client";

import * as React from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleDetailModal } from "./vehicle-detail-modal";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import type { VehicleInService } from "@/app/(protected)/catalogs/vehicles/actions";

type VehicleStatusProps = {
    initialVehicles: VehicleInService[];
};

type TimeStatus = "EN TIEMPO" | "ATRASADO" | "URGENTE";

export function VehicleStatus({ initialVehicles }: VehicleStatusProps) {
    const [vehicles, setVehicles] = React.useState(initialVehicles);
    const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleInService | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = (vehicle: VehicleInService) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        RECEPCION: "outline",
        DIAGNOSTICO: "outline",
        AUTORIZACION: "secondary",
        EN_REPARACION: "default",
        PRUEBAS: "default",
        LISTO: "default",
        ENTREGADO: "default",
        CANCELADO: "destructive",
    };

    const getTimeStatus = (vehicleId: number): TimeStatus => {
        const mod = vehicleId % 3;
        if (mod === 0) return "URGENTE";
        if (mod === 1) return "EN TIEMPO";
        return "ATRASADO";
    }

    const timeStatusColors: Record<TimeStatus, string> = {
        "EN TIEMPO": "bg-green-600 text-white hover:bg-green-700",
        "ATRASADO": "bg-slate-500 text-white hover:bg-slate-600",
        "URGENTE": "bg-red-600 text-white hover:bg-red-700",
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => {
                    const timeStatus = getTimeStatus(vehicle.id);
                    const imageUrl = "/assets/vehiculo_" + vehicle.id + ".png";

                    return (
                        <Card key={vehicle.id} className="overflow-hidden">
                            <div className="relative">
                                <Image
                                    alt={`Imagen de ${vehicle.vehicleIdentifier}`}
                                    className="aspect-video w-full object-cover"
                                    height={337}
                                    src={imageUrl}
                                    width={600}
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-2">
                                    <Badge
                                        variant={statusVariant[vehicle.estado]}
                                        className={cn(
                                            (statusVariant[vehicle.estado] !== 'destructive') && "bg-white text-black",
                                            vehicle.estado === "EN_REPARACION" && "bg-blue-500 text-white",
                                            vehicle.estado === "RECEPCION" && "bg-yellow-400 text-black"
                                        )}
                                    >
                                        {vehicle.estado.replace("_", " ")}
                                    </Badge>
                                    <Badge className={cn("border-white", timeStatusColors[timeStatus])}>
                                        {timeStatus}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle>{vehicle.vehicleIdentifier}</CardTitle>
                                <CardDescription>{vehicle.clientName}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => handleOpenModal(vehicle)}
                                >
                                    Ver Detalles
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            {selectedVehicle && (
                <VehicleDetailModal
                    isOpen={isModalOpen}
                    onCloseActionAction={() => setIsModalOpen(false)}
                    vehicle={selectedVehicle}
                />
            )}
        </>
    );
}
