"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, File, ListFilter, Truck, Edit, Trash2 } from "lucide-react";
import type { PurchaseOrder } from "@/app/(protected)/purchases/actions";
import type { Proveedor, Producto } from "@/lib/types";
import { Badge } from "./ui/badge";
import { PurchaseOrderFormModal } from "./purchase-order-form-modal";
import { PurchaseOrderDeleteDialog } from "./purchase-order-delete-dialog";

export function Purchases({ initialPurchases, initialProviders, initialProducts }: {
    initialPurchases: PurchaseOrder[];
    initialProviders: Proveedor[];
    initialProducts: Producto[];
}) {
    const [purchases, setPurchases] = React.useState(initialPurchases);
    const [selectedOrder, setSelectedOrder] = React.useState<PurchaseOrder | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

    React.useEffect(() => {
        setPurchases(initialPurchases);
    }, [initialPurchases]);

    const handleOpenFormModal = (order: PurchaseOrder | null) => {
        setSelectedOrder(order);
        setFormModalOpen(true);
    };

    const handleOpenDeleteDialog = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setDeleteModalOpen(true);
    };

    const statusVariant: Record<PurchaseOrder["estado"], "default" | "secondary" | "outline" | "destructive"> = {
        "BORRADOR": "outline", "ENVIADA": "secondary", "PARCIAL": "default",
        "RECIBIDA": "default", "CANCELADA": "destructive",
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1"><ListFilter className="h-3.5 w-3.5" /><span>Filtrar</span></Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1"><File className="h-3.5 w-3.5" /><span>Exportar</span></Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenFormModal(null)}><PlusCircle className="h-3.5 w-3.5" /><span>Registrar Compra</span></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Folio</TableHead>
                                <TableHead>Proveedor</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchase.folio}</TableCell>
                                    <TableCell>{purchase.proveedor_razon_social}</TableCell>
                                    <TableCell>{new Date(purchase.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={statusVariant[purchase.estado]}>{purchase.estado}</Badge></TableCell>
                                    <TableCell className="text-right">${Number(purchase.total).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem><Truck className="mr-2 h-4 w-4" />Recibir Mercancía</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(purchase)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenDeleteDialog(purchase)}><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PurchaseOrderFormModal
                isOpen={isFormModalOpen}
                onCloseActionAction={() => setFormModalOpen(false)}
                providers={initialProviders}
                products={initialProducts}
                orderId={selectedOrder?.id}
            />

            <PurchaseOrderDeleteDialog
                isOpen={isDeleteModalOpen}
                onCloseAction={() => setDeleteModalOpen(false)}
                order={selectedOrder}
            />
        </>
    );
}
