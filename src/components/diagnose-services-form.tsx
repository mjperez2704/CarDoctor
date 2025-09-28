"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Trash2, Wrench, PlusCircle } from "lucide-react";

export interface ServiceItem {
    id: string;
    description: string;
    total: number;
}

interface DiagnoseServicesFormProps {
    setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

export function DiagnoseServicesForm({ setServices }: DiagnoseServicesFormProps) {
    const [services, setInternalServices] = React.useState<ServiceItem[]>([]);
    const descriptionRef = React.useRef<HTMLInputElement>(null);
    const totalRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setServices(services);
    }, [services, setServices]);

    const addService = () => {
        const description = descriptionRef.current?.value;
        const total = parseFloat(totalRef.current?.value || "0");

        if (description && total > 0) {
            setInternalServices(prev => [...prev, {
                id: crypto.randomUUID(),
                description,
                total,
            }]);
            if(descriptionRef.current) descriptionRef.current.value = "";
            if(totalRef.current) totalRef.current.value = "";
            descriptionRef.current?.focus();
        }
    };
    
    const removeService = (id: string) => {
        setInternalServices(prev => prev.filter(s => s.id !== id));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wrench /> Servicios / Mano de Obra</CardTitle>
                <CardDescription>
                    Agrega los conceptos de mano de obra y otros servicios requeridos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input ref={descriptionRef} placeholder="Descripción del servicio (ej. Cambio de balatas)" />
                    <Input ref={totalRef} type="number" placeholder="Costo Total" className="w-[150px]" />
                    <Button onClick={addService}>
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="w-[150px] text-right">Importe</TableHead>
                            <TableHead className="w-[50px]"><span className="sr-only">Quitar</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.length > 0 ? services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.description}</TableCell>
                                <TableCell className="text-right font-semibold">${service.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeService(service.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No se han agregado servicios.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
