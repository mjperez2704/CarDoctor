// src/components/brands-manager.tsx
"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { BrandWithDetails, Model } from "@/app/(protected)/catalogs/brands/actions";
import { Badge } from "./ui/badge";
// Importamos el nuevo modal
import { VersionFormModal } from "./version-form-modal";

type BrandsManagerProps = {
    initialBrands: BrandWithDetails[];
};

// Definimos un tipo para el estado del modal
type ModalState = {
    type: 'addVersion' | null;
    data: { model?: Model } | null;
}

export function BrandsManager({ initialBrands }: BrandsManagerProps) {
    const [brands, setBrands] = React.useState(initialBrands);
    // Nuevo estado para controlar qué modal está abierto y con qué datos
    const [modal, setModal] = React.useState<ModalState>({ type: null, data: null });

    const badgeVariant = (type: BrandWithDetails['tipo_marca']) => {
        switch (type) {
            case 'AUTOS': return 'default';
            case 'REFACCIONES': return 'secondary';
            case 'AMBOS': return 'outline';
            default: return 'outline';
        }
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    {/* ... (Cabecera sin cambios) ... */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map(brand => (
                            <Card key={brand.id}>
                                <CardHeader>
                                    {/* ... (CardHeader sin cambios) ... */}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm mb-2">Modelos ({brand.modelos.length})</h4>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                            {brand.modelos.length > 0 ? (
                                                brand.modelos.map(model => (
                                                    <div key={model.id} className="text-sm">
                                                        <div className="flex justify-between items-center font-semibold">
                                                            <span>{model.nombre} {model.anio ? `(${model.anio})` : ''}</span>
                                                            {/* ... (Botones de editar/eliminar modelo) ... */}
                                                        </div>
                                                        {model.versiones && model.versiones.length > 0 && (
                                                            <ul className="list-disc list-inside text-muted-foreground pl-4 mt-1 space-y-1">
                                                                {model.versiones.map(version => (
                                                                    <li key={version.id}>{version.nombre}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        {/* El botón ahora abre el modal con los datos del modelo actual */}
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 h-auto mt-1"
                                                            onClick={() => setModal({ type: 'addVersion', data: { model } })}
                                                        >
                                                            <PlusCircle className="mr-1 h-3 w-3"/>
                                                            Agregar Versión
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No hay modelos para esta marca.</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center border-t pt-4">
                                    {/* ... (CardFooter sin cambios) ... */}
                                </CardFooter>
                            </Card>
                        )
                    )}
                </div>
            </div>

            {/* Renderizamos el modal aquí, pasándole los datos necesarios */}
            {modal.type === 'addVersion' && modal.data?.model && (
                <VersionFormModal
                    isOpen={modal.type === 'addVersion'}
                    onCloseActionAction={() => setModal({ type: null, data: null })}
                    model={modal.data.model}
                />
            )}
        </>
    );
}
