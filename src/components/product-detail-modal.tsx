"use client";

import * as React from "react";
import Image from "next/image";
import type { Marca } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import type { ProductWithStock } from "@/app/(protected)/inventory/actions";

type ProductDetailModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    item: ProductWithStock;
    brands: Marca[];
};

export function ProductDetailModal({ isOpen, onCloseActionAction, item, brands }: ProductDetailModalProps) {
    const brandName = brands.find(b => b.id === item.marca_id)?.nombre || "Genérica";

    const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-md">{value}</p>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{item.nombre}</DialogTitle>
                    <DialogDescription>
                        SKU: {item.sku} | Stock Actual: <Badge>{item.stock} {item.unidad}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div>
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden rounded-lg">
                                <Image
                                    alt={`Imagen de ${item.nombre}`}
                                    className="w-full h-full object-contain"
                                    height={400}
                                    src="/assets/placeholder_refaccion.png" // Placeholder
                                    width={400}
                                />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Características del Producto</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="SKU" value={item.sku} />
                            <DetailItem label="Unidad" value={item.unidad} />
                            <DetailItem label="Marca" value={<Badge variant="outline">{brandName}</Badge>} />
                            <DetailItem label="Categoría" value={`Cat. ID: ${item.categoria_id}`} />
                            {/* SOLUCIÓN: Convertimos a número antes de formatear */}
                            <DetailItem label="Precio de Lista" value={`$${Number(item.precio_lista).toFixed(2)}`} />
                            <DetailItem label="Costo Promedio" value={`$${Number(item.costo_promedio).toFixed(4)}`} />
                            <DetailItem label="Stock Mínimo" value={item.stock_minimo ?? 'N/A'} />
                            <DetailItem label="Stock Máximo" value={item.stock_max ?? 'N/A'} />
                        </div>
                        <DetailItem label="Descripción" value={item.descripcion || "Sin descripción."} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onCloseActionAction}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
