// src/app/(protected)/catalogs/vehicles/page.tsx
import { VehicleStatus } from "@/components/vehicle-status";
import { getVehiclesInService } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function VehiclesPage() {
    const vehiclesInService = await getVehiclesInService();

    return (
        <>
            <PageHeader
                title="Vehículos en Taller"
                description="Listado de vehículos actualmente en servicio o reparación."
            />
            <VehicleStatus initialVehicles={vehiclesInService} />
        </>
    );
}
