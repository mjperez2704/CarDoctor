"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { File, ListFilter, MoreHorizontal, PlusCircle, Send, FileCheck, FileX, Edit, Trash2 } from "lucide-react";
import type { Customer } from "@/app/(protected)/customers/actions";
import { type Quote, type ProductForQuote, updateQuoteStatus } from "@/app/(protected)/quotes/actions";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QuoteFormModal } from "./quote-form-modal";
import { QuoteDeleteDialog } from "./quote-delete-dialog";

type QuotesProps = {
    initialQuotes: Quote[];
    clients: Customer[];
    products: ProductForQuote[];
}

export function Quotes({ initialQuotes, clients, products }: QuotesProps) {
    const [quotes, setQuotes] = React.useState<Quote[]>(initialQuotes);
    const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        setQuotes(initialQuotes);
    }, [initialQuotes]);

    const handleOpenFormModal = (quote: Quote | null) => {
        setSelectedQuote(quote);
        setFormModalOpen(true);
    };

    const handleOpenDeleteDialog = (quote: Quote) => {
        setSelectedQuote(quote);
        setDeleteDialogOpen(true);
    };

    const handleUpdateStatus = async (id: number, newStatus: Quote['estado']) => {
        const result = await updateQuoteStatus(id, newStatus);
        toast({
            title: result.success ? "Éxito" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
    }

    const statusVariant: Record<Quote["estado"], "default" | "secondary" | "destructive" | "outline"> = {
        GENERADA: "outline", ENVIADA: "secondary", ACEPTADA: "default", RECHAZADA: "destructive",
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1"><ListFilter className="h-3.5 w-3.5" /><span>Filtrar</span></Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1"><File className="h-3.5 w-3.5" /><span>Exportar</span></Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenFormModal(null)}><PlusCircle className="h-3.5 w-3.5" /><span>Agregar Cotización</span></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Folio</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-center"><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell className="font-medium">{quote.folio}</TableCell>
                                    <TableCell>{quote.cliente_nombre}</TableCell>
                                    <TableCell>{new Date(quote.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={statusVariant[quote.estado]}>{quote.estado}</Badge></TableCell>
                                    <TableCell className="text-right">${Number(quote.total).toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                {quote.estado === 'GENERADA' && (<DropdownMenuItem onSelect={() => handleUpdateStatus(quote.id, 'ENVIADA')}><Send className="mr-2 h-4 w-4" /> Enviar</DropdownMenuItem>)}
                                                {quote.estado === 'ENVIADA' && (<><DropdownMenuItem onSelect={() => handleUpdateStatus(quote.id, 'ACEPTADA')}><FileCheck className="mr-2 h-4 w-4" /> Generar Orden</DropdownMenuItem><DropdownMenuItem onSelect={() => handleUpdateStatus(quote.id, 'RECHAZADA')}><FileX className="mr-2 h-4 w-4" /> Marcar como Rechazada</DropdownMenuItem></>)}
                                                {(quote.estado === 'GENERADA' || quote.estado === 'ENVIADA') && (<DropdownMenuItem onSelect={() => handleOpenFormModal(quote)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>)}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenDeleteDialog(quote)}><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <QuoteFormModal
                isOpen={isFormModalOpen}
                // CORRECCIÓN: Se usa el nuevo nombre de la prop
                onCloseAction={() => setFormModalOpen(false)}
                clients={clients}
                products={products}
                quoteId={selectedQuote?.id}
            />

            <QuoteDeleteDialog
                isOpen={isDeleteDialogOpen}
                // CORRECCIÓN: Se usa el nuevo nombre de la prop
                onCloseAction={() => setDeleteDialogOpen(false)}
                quote={selectedQuote}
            />
        </>
    );
}
