"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Upload, FileText, DollarSign } from "lucide-react";
import { DiagnosePartsForm, type PartItem } from "./diagnose-parts-form";
import { DiagnoseServicesForm, type ServiceItem } from "./diagnose-services-form";
import type { WorkOrderDetails } from "@/app/(protected)/work-orders/actions";
import type { ProductForQuote } from "@/app/(protected)/quotes/actions";

interface DiagnoseWorkOrderProps {
  order: WorkOrderDetails;
  products: ProductForQuote[];
}

export function DiagnoseWorkOrder({ order, products }: DiagnoseWorkOrderProps) {
    const [parts, setParts] = React.useState<PartItem[]>([]);
    const [services, setServices] = React.useState<ServiceItem[]>([]);

    const subtotalParts = parts.reduce((acc, part) => acc + part.quantity * part.unitPrice, 0);
    const subtotalServices = services.reduce((acc, service) => acc + service.total, 0);
    const subtotal = subtotalParts + subtotalServices;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: Formularios */}
            <div className="lg:col-span-2 space-y-6">
                {/* Detalles de la Orden */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de la Orden</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold">Cliente: </span>{order.cliente_razon_social}</div>
                        <div><span className="font-semibold">Vehículo: </span>{order.vehiculo_descripcion}</div>
                        <div><span className="font-semibold">Técnico: </span>{order.tecnico_nombre || "Sin Asignar"}</div>
                        <div><span className="font-semibold">Fecha Recepción: </span>{new Date(order.fecha).toLocaleDateString()}</div>
                        <div className="sm:col-span-2"><span className="font-semibold">Falla Reportada: </span>{order.diagnostico_ini}</div>
                    </CardContent>
                </Card>

                {/* Formulario de Diagnóstico */}
                <Card>
                    <CardHeader>
                        <CardTitle>Diagnóstico del Técnico</CardTitle>
                        <CardDescription>
                            Documenta los hallazgos, causa raíz y la solución propuesta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Escribe aquí el diagnóstico detallado..."
                            className="min-h-[150px]"
                        />
                        <div>
                            <Label>Adjuntar Evidencia (Fotos/Videos)</Label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-sm leading-6 text-gray-600">
                                        <span className="font-semibold text-primary cursor-pointer hover:underline">
                                            Sube un archivo
                                        </span> o arrástralo aquí
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Refacciones */}
                <DiagnosePartsForm allProducts={products} setParts={setParts} />

                {/* Servicios (Mano de Obra) */}
                <DiagnoseServicesForm setServices={setServices} />
            </div>

            {/* Columna Derecha: Resumen y Acciones */}
            <div className="space-y-6">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Resumen de Costos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Subtotal Refacciones:</span> <span>${subtotalParts.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Subtotal Mano de Obra:</span> <span>${subtotalServices.toFixed(2)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-semibold"><span>Subtotal General:</span> <span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>IVA (16%):</span> <span>${iva.toFixed(2)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg"><span>TOTAL:</span> <span>${total.toFixed(2)}</span></div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            Generar Cotización para Cliente
                         </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
