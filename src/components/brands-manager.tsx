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
import { VersionFormModal } from "./version-form-modal";
import { BrandFormModal } from "./brand-form-modal";
import { BrandDeleteDialog } from "./brand-delete-dialog"; // Importar el diálogo de eliminación

type BrandsManagerProps = {
    initialBrands: BrandWithDetails[];
};

type ModalState = {
    type: 'addVersion' | 'addBrand' | 'editBrand' | 'deleteBrand' | null;
    data?: {
        model?: Model;
        brand?: BrandWithDetails;
    } | null;
}

export function BrandsManager({ initialBrands }: BrandsManagerProps) {
    const [brands, setBrands] = React.useState(initialBrands);
    const [modal, setModal] = React.useState<ModalState>({ type: null, data: null });

    // Actualizar el estado local cuando las props iniciales cambian
    React.useEffect(() => {
        setBrands(initialBrands);
    }, [initialBrands]);

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
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Catálogo de Marcas</h2>
                        <p className="text-muted-foreground">
                            Administra las marcas, modelos y versiones de tu sistema.
                        </p>
                    </div>
                    <Button onClick={() => setModal({ type: 'addBrand' })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Marca
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map(brand => (
                        <Card key={brand.id}>
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle>{brand.nombre}</CardTitle>
                                    <CardDescription>{brand.pais_origen}</CardDescription>
                                </div>
                                <Badge variant={badgeVariant(brand.tipo_marca)}>{brand.tipo_marca}</Badge>
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
                                                        {/* Acciones de modelo (editar/eliminar) a implementar */}
                                                    </div>
                                                    {model.versiones && model.versiones.length > 0 && (
                                                        <ul className="list-disc list-inside text-muted-foreground pl-4 mt-1 space-y-1">
                                                            {model.versiones.map(version => (
                                                                <li key={version.id}>{version.nombre}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0 h-auto mt-1"
                                                        onClick={() => setModal({ type: 'addVersion', data: { model } })}
                                                    >
                                                        <PlusCircle className="mr-1 h-3 w-3" />
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
                                <Button variant="outline" size="sm" /*onClick={() => onAddModel(brand.id)}*/>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Modelo
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => setModal({ type: 'editBrand', data: { brand } })}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setModal({ type: 'deleteBrand', data: { brand } })}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modal para agregar/editar Marca */}
            {(modal.type === 'addBrand' || modal.type === 'editBrand') && (
                <BrandFormModal
                    isOpen={modal.type === 'addBrand' || modal.type === 'editBrand'}
                    onClose={() => setModal({ type: null, data: null })}
                    brand={modal.type === 'editBrand' ? modal.data?.brand : null}
                />
            )}

            {/* Diálogo para eliminar Marca */}
            {modal.type === 'deleteBrand' && modal.data?.brand && (
                <BrandDeleteDialog
                    isOpen={modal.type === 'deleteBrand'}
                    onClose={() => setModal({ type: null, data: null })}
                    brand={modal.data.brand}
                />
            )}

            {/* Modal para agregar Versión */}
            {modal.type === 'addVersion' && modal.data?.model && (
                <VersionFormModal
                    isOpen={modal.type === 'addVersion'}
                    onCloseAction={() => setModal({ type: null, data: null })}
                    model={modal.data.model}
                />
            )}
        </>
    );
}
