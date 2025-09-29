"use client";

import * as React from "react";
import { File, ListFilter, MoreHorizontal, PlusCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductWithStock } from "@/app/(protected)/inventory/actions";
import type { Proveedor, Marca } from "@/lib/types";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";
import { ProductFormModal } from "./product-form-modal";
import { StockLocationModal } from "./stock-location-modal";
import { ProductDetailModal } from "./product-detail-modal";
import { ProductDeleteDialog } from "./product-delete-dialog"; // Importar diálogo
import { cn } from "@/lib/utils";

export function ProductCatalog({ initialProducts, providers, brands }: {
    initialProducts: ProductWithStock[];
    providers: Proveedor[];
    brands: Marca[];
}) {
    const [products, setProducts] = React.useState<ProductWithStock[]>(initialProducts);
    const [selectedItem, setSelectedItem] = React.useState<ProductWithStock | null>(null);

    // Estados para controlar los modales
    const [modalState, setModalState] = React.useState<{
        isFormOpen: boolean;
        isDetailOpen: boolean;
        isStockOpen: boolean;
        isAiOpen: boolean;
        isDeleteOpen: boolean;
    }>({
        isFormOpen: false,
        isDetailOpen: false,
        isStockOpen: false,
        isAiOpen: false,
        isDeleteOpen: false,
    });

    React.useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const openModal = (modal: keyof typeof modalState, item: ProductWithStock | null) => {
        setSelectedItem(item);
        setModalState(prev => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modalState) => {
        setModalState(prev => ({ ...prev, [modal]: false }));
        setSelectedItem(null);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    {/* El título ahora es manejado por PageHeader, se mantiene la barra de botones */}
                    <div className="flex justify-end items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span>Filtrar</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span>Exportar</span>
                        </Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => openModal('isFormOpen', null)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Agregar Producto</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Existencia</TableHead>
                                <TableHead>Precio de Lista</TableHead>
                                <TableHead className="text-right">Costo Promedio</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((item) => {
                                const isLowStock = item.stock_min ? item.stock <= item.stock_min : false;
                                return (
                                    <TableRow key={item.id} className={cn(isLowStock && "bg-destructive/10 hover:bg-destructive/20")}>
                                        <TableCell>
                                            <Button variant="link" className="p-0 h-auto font-medium" onClick={() => openModal('isDetailOpen', item)}>
                                                {item.sku}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{item.nombre}</TableCell>
                                        <TableCell>
                                            <Button variant="link" className={cn("p-0 h-auto font-semibold", isLowStock && "text-destructive")} onClick={() => openModal('isStockOpen', item)}>
                                                {item.stock} {item.unidad}
                                            </Button>
                                        </TableCell>
                                        <TableCell>${Number(item.precio_lista).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${Number(item.costo_promedio).toFixed(4)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => openModal('isFormOpen', item)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => openModal('isAiOpen', item)}>
                                                        <Bot className="mr-2 h-4 w-4" />Sugerencia de Stock (IA)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onSelect={() => openModal('isDeleteOpen', item)}>
                                                        Dar de Baja
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>{products.length}</strong> productos.
                    </div>
                </CardFooter>
            </Card>

            <ProductFormModal
                isOpen={modalState.isFormOpen}
                onCloseAction={() => closeModal('isFormOpen')}
                providers={providers}
                brands={brands}
                product={selectedItem}
            />

            {selectedItem && (
                <ProductDetailModal
                    isOpen={modalState.isDetailOpen}
                    onCloseAction={() => closeModal('isDetailOpen')}
                    item={selectedItem}
                    brands={brands}
                />
            )}

            {selectedItem && (
                <StockLocationModal
                    isOpen={modalState.isStockOpen}
                    onCloseAction={() => closeModal('isStockOpen')}
                    item={selectedItem}
                />
            )}

            {selectedItem && (
                <AiSuggestionDialog
                    item={selectedItem}
                    open={modalState.isAiOpen}
                    onOpenChangeAction={(open) => !open && closeModal('isAiOpen')}
                />
            )}

            <ProductDeleteDialog
                isOpen={modalState.isDeleteOpen}
                onCloseAction={() => closeModal('isDeleteOpen')}
                product={selectedItem}
            />
        </>
    );
}
