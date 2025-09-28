// src/components/vehicle-detail-modal.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import type { VehicleInService } from "@/app/(protected)/catalogs/vehicles/actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

type VehicleDetailModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    vehicle: VehicleInService;
};

export function VehicleDetailModal({ isOpen, onCloseActionAction, vehicle }: VehicleDetailModalProps) {

    const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        RECEPCION: "outline",
        DIAGNOSTICO: "secondary",
        AUTORIZACION: "secondary",
        EN_REPARACION: "default",
        PRUEBAS: "default",
        LISTO: "default",
        ENTREGADO: "default",
        CANCELADO: "destructive",
    };

    const imageUrl = vehicle.imagen_url || "/assets/vehiculo_1.png"; // Fallback

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{vehicle.vehicleIdentifier}</DialogTitle>
                    <DialogDescription>
                        Folio de Orden: {vehicle.folio}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Columna de Imágenes */}
                    <div>
                        <Carousel className="w-full">
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                                <Image
                                                    alt={`Imagen de ${vehicle.vehicleIdentifier}`}
                                                    className="aspect-video w-full object-cover"
                                                    height={337}
                                                    src={imageUrl}
                                                    width={600}
                                                    priority
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                    {/* Columna de Detalles */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Detalles del Servicio</h3>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                            <p>{vehicle.clientName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                            <Badge variant={statusVariant[vehicle.estado] || 'secondary'}>{vehicle.estado.replace("_", " ")}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Fecha de Recepción</p>
                            <p>{new Date(vehicle.fecha).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Falla o Servicio Solicitado</p>
                            <p className="p-3 bg-muted/50 rounded-md text-sm">{vehicle.diagnostico_ini}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onCloseActionAction}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
