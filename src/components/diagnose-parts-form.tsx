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
import { Trash2, Package, Search } from "lucide-react";
import type { ProductForQuote } from "@/app/(protected)/quotes/actions";

export interface PartItem {
    id: number;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

interface DiagnosePartsFormProps {
    allProducts: ProductForQuote[];
    setParts: React.Dispatch<React.SetStateAction<PartItem[]>>;
}

export function DiagnosePartsForm({ allProducts, setParts }: DiagnosePartsFormProps) {
    const [parts, setInternalParts] = React.useState<PartItem[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<ProductForQuote[]>([]);

    React.useEffect(() => {
        setParts(parts);
    }, [parts, setParts]);
    
    React.useEffect(() => {
        if (searchTerm.length > 2) {
            const results = allProducts.filter(
                p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results.slice(0, 5)); // Limitar a 5 resultados
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, allProducts]);

    const addPart = (product: ProductForQuote) => {
        setInternalParts(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, {
                id: product.id,
                sku: product.sku,
                name: product.nombre,
                quantity: 1,
                unitPrice: Number(product.precio_lista),
            }];
        });
        setSearchTerm("");
        setSearchResults([]);
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removePart(id);
            return;
        }
        setInternalParts(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
    };

    const removePart = (id: number) => {
        setInternalParts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package /> Refacciones Necesarias</CardTitle>
                <CardDescription>
                    Busca y agrega las refacciones requeridas para esta reparación.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar refacción por nombre o SKU..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-card border rounded-md mt-1 shadow-lg">
                            {searchResults.map(product => (
                                <div
                                    key={product.id}
                                    className="p-2 hover:bg-muted cursor-pointer"
                                    onClick={() => addPart(product)}
                                >
                                    <p className="text-sm font-medium">{product.nombre}</p>
                                    <p className="text-xs text-muted-foreground">SKU: {product.sku} - Precio: ${Number(product.precio_lista).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="w-[100px]">Cantidad</TableHead>
                            <TableHead className="w-[120px] text-right">Precio Unit.</TableHead>
                            <TableHead className="w-[120px] text-right">Importe</TableHead>
                            <TableHead className="w-[50px]"><span className="sr-only">Quitar</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parts.length > 0 ? parts.map(part => (
                            <TableRow key={part.id}>
                                <TableCell>
                                    <p className="font-medium">{part.name}</p>
                                    <p className="text-xs text-muted-foreground">{part.sku}</p>
                                </TableCell>
                                <TableCell>
                                    <Input type="number" value={part.quantity} onChange={e => updateQuantity(part.id, parseInt(e.target.value, 10))} className="h-8" />
                                </TableCell>
                                <TableCell className="text-right">${part.unitPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-semibold">${(part.quantity * part.unitPrice).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removePart(part.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No se han agregado refacciones.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
