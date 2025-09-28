"use client";

import * as React from "react";
import { Search, Expand, X, Plus, Minus, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getProductsByWarehouse, createSale, type Sucursal, type ProductForPOS } from "../actions";
import type { Cliente } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
// ===== INICIO DE LA MODIFICACIÓN =====
import { ReceiptModal } from "./receipt-modal";
import type { SaleReceiptData } from "./sale-receipt";
// ===== FIN DE LA MODIFICACIÓN =====

interface POSInterfaceProps {
    branch: Sucursal;
    clientes: Cliente[];
    defaultClient: Cliente;
    onChangeBranchAction: () => void;
}

type TicketItem = ProductForPOS & { quantity: number };

export function POSInterface({ branch, clientes, defaultClient, onChangeBranchAction }: POSInterfaceProps) {
    const { toast } = useToast();
    const [products, setProducts] = React.useState<ProductForPOS[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [ticketItems, setTicketItems] = React.useState<TicketItem[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // ===== INICIO DE LA MODIFICACIÓN =====
    const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);
    const [lastSaleData, setLastSaleData] = React.useState<SaleReceiptData | null>(null);
    // ===== FIN DE LA MODIFICACIÓN =====

    React.useEffect(() => {
        setIsLoading(true);
        getProductsByWarehouse(branch.almacen_id)
            .then(data => setProducts(data))
            .finally(() => setIsLoading(false));
    }, [branch.almacen_id]);

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToTicket = (product: ProductForPOS) => {
        setTicketItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                } else {
                    toast({ variant: "destructive", title: "Stock insuficiente" });
                    return prev;
                }
            }
            if (product.stock > 0) {
                return [...prev, { ...product, quantity: 1 }];
            } else {
                toast({ variant: "destructive", title: "Stock insuficiente" });
                return prev;
            }
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        const productInStock = products.find(p => p.id === productId);
        if (newQuantity <= 0) {
            setTicketItems(prev => prev.filter(item => item.id !== productId));
            return;
        }
        if (productInStock && newQuantity > productInStock.stock) {
            toast({ variant: "destructive", title: "Stock insuficiente" });
            return;
        }
        setTicketItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }

    const subtotal = React.useMemo(() => ticketItems.reduce((acc, item) => acc + (item.precio_lista * item.quantity), 0), [ticketItems]);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.length > 0) {
            e.preventDefault();
            const exactMatch = products.find(p => p.sku.toLowerCase() === searchTerm.toLowerCase());
            if (exactMatch) {
                addToTicket(exactMatch);
                setSearchTerm("");
            } else {
                toast({ variant: "destructive", title: "Producto no encontrado", description: `No se encontró un producto con el SKU: ${searchTerm}` });
            }
        }
    }

    // ===== INICIO DE LA MODIFICACIÓN =====
    const handleSale = async () => {
        const saleData = {
            sucursalId: branch.id,
            clienteId: defaultClient.id,
            usuarioId: 1, // TODO: Obtener de la sesión de usuario real
            items: ticketItems.map(item => ({ id: item.id, name: item.nombre, quantity: item.quantity, unitPrice: item.precio_lista })),
        };
        const result = await createSale(saleData);
        toast({ title: result.success ? "Éxito" : "Error", description: result.message, variant: result.success ? "default" : "destructive" });
        if(result.success && result.receiptData) {
            setLastSaleData({
                ...result.receiptData,
                branch: branch,
                client: defaultClient
            });
            setIsReceiptModalOpen(true);
            setTicketItems([]);
            // Recargar productos para actualizar stock
            getProductsByWarehouse(branch.almacen_id).then(setProducts);
        }
    }
    // ===== FIN DE LA MODIFICACIÓN =====

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-8rem)] w-full flex gap-4">
                {/* ... (resto del JSX de la interfaz sin cambios) ... */}
                {/* Columna Izquierda: Productos */}
                <Card className="w-2/3 flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Buscar por nombre o escanear SKU..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleBarcodeScan}
                            />
                            <Barcode className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <ScrollArea className="flex-grow">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {isLoading && Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
                            {!isLoading && filteredProducts.map(product => (
                                <Card key={product.id} className="cursor-pointer hover:border-primary" onClick={() => addToTicket(product)}>
                                    <CardContent className="p-2 text-center flex flex-col justify-center h-28">
                                        <p className="text-sm font-semibold leading-tight">{product.nombre}</p>
                                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                        <p className="text-sm font-bold mt-1">${Number(product.precio_lista).toFixed(2)}</p>
                                        <p className="text-xs text-green-600">Stock: {product.stock}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Columna Derecha: Ticket y Acciones */}
                <Card className="w-1/3 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Ticket de Venta</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={toggleFullScreen}><Expand className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="sm" onClick={onChangeBranchAction}>Cambiar Sucursal</Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow">
                        <div className="p-4 space-y-2">
                            {ticketItems.length === 0 && <p className="text-center text-muted-foreground py-10">Agrega productos al ticket</p>}
                            {ticketItems.map(item => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium">{item.nombre}</p>
                                        <p className="text-xs text-muted-foreground">${Number(item.precio_lista).toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3"/></Button>
                                        <Input value={item.quantity} className="h-6 w-10 text-center p-0" onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)} />
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3"/></Button>
                                    </div>
                                    <p className="font-semibold w-16 text-right">${(item.precio_lista * item.quantity).toFixed(2)}</p>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => updateQuantity(item.id, 0)}><X className="h-4 w-4"/></Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    {ticketItems.length > 0 && (
                        <div className="p-4 border-t mt-auto space-y-2">
                            <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span>IVA (16%):</span><span>${iva.toFixed(2)}</span></div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg"><span>TOTAL:</span><span>${total.toFixed(2)}</span></div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="w-full" onClick={() => setTicketItems([])}>Cancelar</Button>
                                <Button className="w-full" onClick={handleSale}>Cobrar</Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
            {/* ===== INICIO DE LA MODIFICACIÓN ===== */}
            <ReceiptModal
                isOpen={isReceiptModalOpen}
                onCloseAction={() => setIsReceiptModalOpen(false)}
                receiptData={lastSaleData}
            />
            {/* ===== FIN DE LA MODIFICACIÓN ===== */}
        </>
    );
}
