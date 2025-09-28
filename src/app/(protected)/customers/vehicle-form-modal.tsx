"use client";
import React, { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Car } from 'lucide-react';
import { addVehicleToCustomer, getBrandsAndModels } from './actions';
import type { CustomerWithVehicleCount } from './actions';

// CORRECCIÓN: Se renombra la prop 'onCloseActionAction' a 'onCloseAction'
interface VehicleFormModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    customer: CustomerWithVehicleCount;
}

type Brand = { id: number; nombre: string };
type Model = { id: number; nombre: string; marca_id: number };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Vehículo
        </Button>
    );
}

export function VehicleFormModal({ isOpen, onCloseAction, customer }: VehicleFormModalProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(addVehicleToCustomer, undefined);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        getBrandsAndModels().then((data) => {
            setBrands(data.marcas as Brand[]);
            setModels(data.modelos as Model[]);
        });
    }, []);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            // CORRECCIÓN: Se usa la prop con el nombre corregido
            if (state.success) {
                onCloseAction();
            }
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
            setImagePreview(null);
            setSelectedBrand('');
        }
    }, [isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const filteredModels = models.filter(model => model.marca_id === parseInt(selectedBrand, 10));

    return (
        // CORRECCIÓN: Se usa la prop con el nombre corregido
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Agregar Vehículo</DialogTitle>
                    <DialogDescription>
                        Registra un nuevo vehículo para {customer.razon_social}.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-2">
                    <div className="space-y-4">
                        <input type="hidden" name="customerId" value={customer.id} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="placas">Placas</Label>
                                <Input id="placas" name="placas" placeholder="ABC-123-XYZ" />
                            </div>
                            <div>
                                <Label htmlFor="vin">VIN / N° de Serie</Label>
                                <Input id="vin" name="vin" placeholder="1GABC..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="marca_id">Marca</Label>
                                <Select name="marca_id" onValueChange={setSelectedBrand}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una marca" /></SelectTrigger>
                                    <SelectContent>
                                        {brands.map(brand => (
                                            <SelectItem key={brand.id} value={String(brand.id)}>{brand.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="modelo_id">Modelo</Label>
                                <Select name="modelo_id" disabled={!selectedBrand}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona un modelo" /></SelectTrigger>
                                    <SelectContent>
                                        {filteredModels.map(model => (
                                            <SelectItem key={model.id} value={String(model.id)}>{model.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="anio">Año</Label>
                                <Input id="anio" name="anio" type="number" placeholder="2024" />
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" placeholder="Rojo" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="motor">Motor</Label>
                            <Input id="motor" name="motor" placeholder="Ej. 2.5L 4 Cilindros" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imagen_vehiculo">Foto del Vehículo</Label>
                        <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center bg-muted/40 overflow-hidden">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Vista previa del vehículo" width={400} height={225} className="object-cover w-full h-full" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Car className="mx-auto h-12 w-12" />
                                    <p>Vista Previa</p>
                                </div>
                            )}
                        </div>
                        <Input id="imagen_vehiculo" name="imagen_vehiculo" type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <DialogFooter className="md:col-span-2">
                        {/* CORRECCIÓN: Se usa la prop con el nombre corregido */}
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
