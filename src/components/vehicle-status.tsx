
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OrdenServicio } from "@/lib/types";
import { VehicleDetailModal } from "./vehicle-detail-modal";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type VehicleInService = OrdenServicio & {
  clientName: string;
  vehicleIdentifier: string;
};

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
  
  const statusVariant: Record<OrdenServicio["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    RECEPCION: "outline",
    DIAGNOSTICO: "secondary",
    AUTORIZACION: "secondary",
    EN_REPARACION: "default",
    PRUEBAS: "default",
    LISTO: "default",
    ENTREGADO: "default",
    CANCELADO: "destructive",
  };
  
  const getTimeStatus = (vehicleId: number): TimeStatus => {
    // Simulando la lógica para determinar el estado del tiempo
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vehículos en Taller</h1>
          <p className="text-muted-foreground">
            Listado de vehículos actualmente en servicio o reparación.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => {
             const timeStatus = getTimeStatus(vehicle.id);
             const imageIndex = (index % 4) + 1;
            return (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className="relative">
                    <Image
                        alt={`Imagen de ${vehicle.vehicleIdentifier}`}
                        className="aspect-video w-full object-cover"
                        height={337}
                        src={`/assets/vehiculo_${imageIndex}.jpg`}
                        width={600}
                    />
                </div>

                <CardHeader>
                  <CardTitle>{vehicle.vehicleIdentifier}</CardTitle>
                  <CardDescription>{vehicle.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleOpenModal(vehicle)}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      {selectedVehicle && (
        <VehicleDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicle={selectedVehicle}
        />
      )}
    </>
  );
}
