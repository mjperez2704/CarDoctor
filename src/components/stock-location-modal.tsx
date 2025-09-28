"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import type { Producto } from "@/lib/types";
// Importamos la acción y el nuevo tipo
import { getStockDetails, type StockDetail } from "@/app/(protected)/inventory/actions";

type StockLocationModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    item: Producto & { stock: number }; // Aseguramos que el item tenga el stock total
};

export function StockLocationModal({ isOpen, onCloseActionAction, item }: StockLocationModalProps) {
    const [locations, setLocations] = React.useState<StockDetail[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (isOpen && item) {
            setIsLoading(true);
            getStockDetails(item.id)
                .then(data => {
                    setLocations(data);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, item]);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Desglose de Stock: {item.nombre}</DialogTitle>
                    <DialogDescription>
                        SKU: {item.sku} | Existencia Total: <Badge>{item.stock} {item.unidad}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h4 className="font-semibold mb-2">Ubicaciones del Stock</h4>
                    <div className="border rounded-md max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Almacén</TableHead>
                                        <TableHead>Sección</TableHead>
                                        <TableHead>Lote</TableHead>
                                        <TableHead className="text-right">Cantidad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.length > 0 ? (
                                        locations.map((loc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{loc.warehouseName}</TableCell>
                                                <TableCell>{loc.sectionName}</TableCell>
                                                <TableCell>{loc.lotCode}</TableCell>
                                                <TableCell className="text-right font-medium">{loc.quantity}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">
                                                No hay existencias registradas para este producto.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onCloseActionAction}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
