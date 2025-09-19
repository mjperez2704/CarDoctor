
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Send,
  FileCheck,
  FileX,
  Edit,
  Trash2
} from "lucide-react";
import type { Cotizacion, Cliente, Producto } from "@/lib/types";
import { getClientes, getProductos } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QuoteFormModal } from "./quote-form-modal";

const mockQuotes: Cotizacion[] = [
    { id: 1, folio: 'COT-2024-001', cliente_id: 1, cliente_nombre: "Carlos Sánchez", fecha: '2024-07-30', total: 150.00, estado: 'GENERADA' },
    { id: 2, folio: 'COT-2024-002', cliente_id: 2, cliente_nombre: "Laura Gómez", fecha: '2024-07-29', total: 300.00, estado: 'ENVIADA' },
    { id: 3, folio: 'COT-2024-003', cliente_id: 3, cliente_nombre: "Transportes Rápidos S.A.", fecha: '2024-07-28', total: 1250.00, estado: 'ACEPTADA' },
    { id: 4, folio: 'COT-2024-004', cliente_id: 1, cliente_nombre: "Carlos Sánchez", fecha: '2024-07-27', total: 80.00, estado: 'RECHAZADA' },
];


export function Quotes() {
  const [quotes, setQuotes] = React.useState<Cotizacion[]>(mockQuotes);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [products, setProducts] = React.useState<Producto[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    setClients(getClientes());
    setProducts(getProductos());
  }, []);

  const handleUpdateStatus = (id: number, newStatus: Cotizacion['estado']) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, estado: newStatus } : q));
    toast({
        title: "Estado Actualizado",
        description: `La cotización se ha marcado como ${newStatus.toLowerCase()}.`
    });
  }

  const handleDelete = (id: number) => {
    setQuotes(quotes.filter(q => q.id !== id));
    toast({
        variant: "destructive",
        title: "Cotización Eliminada",
        description: `La cotización ha sido eliminada.`,
    });
  }

  const handleSaveQuote = (values: any) => {
    console.log("Saving quote", values);
    const newQuote: Cotizacion = {
        id: Math.max(...quotes.map(q => q.id)) + 1,
        folio: `COT-2024-${String(quotes.length + 1).padStart(3, '0')}`,
        cliente_id: Number(values.clientId),
        cliente_nombre: clients.find(c => String(c.id) === values.clientId)?.razon_social || 'N/A',
        fecha: new Date().toISOString(),
        total: values.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0),
        estado: 'GENERADA',
    };
    setQuotes([newQuote, ...quotes]);
    setIsModalOpen(false);
  }

  const statusVariant: Record<Cotizacion["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    GENERADA: "outline",
    ENVIADA: "secondary",
    ACEPTADA: "default",
    RECHAZADA: "destructive",
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Cotizaciones</CardTitle>
        <CardDescription>
          Crea y administra cotizaciones para clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2 mb-4">
           <Button variant="outline" size="sm" className="h-7 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtrar
              </span>
            </Button>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-7 gap-1" onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Agregar Cotización
              </span>
            </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
                 <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.folio}</TableCell>
                    <TableCell>{quote.cliente_nombre}</TableCell>
                    <TableCell>{new Date(quote.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={statusVariant[quote.estado]}>{quote.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${quote.total.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            {quote.estado === 'GENERADA' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, 'ENVIADA')}>
                                    <Send className="mr-2 h-4 w-4" /> Enviar
                                </DropdownMenuItem>
                            )}
                             {quote.estado === 'ENVIADA' && (
                                <>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, 'ACEPTADA')}>
                                        <FileCheck className="mr-2 h-4 w-4" /> Generar Orden
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, 'RECHAZADA')}>
                                        <FileX className="mr-2 h-4 w-4" /> Marcar como Rechazada
                                    </DropdownMenuItem>
                                </>
                            )}
                            {(quote.estado === 'GENERADA' || quote.estado === 'ENVIADA') && (
                                 <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(quote.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{quotes.length}</strong> de <strong>{quotes.length}</strong> cotizaciones.
          </div>
        </CardFooter>
    </Card>
    <QuoteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuote}
        clients={clients}
        products={products}
    />
    </>
  );
}
