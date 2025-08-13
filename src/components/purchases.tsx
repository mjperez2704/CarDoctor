"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, File, ListFilter, Truck } from "lucide-react";
import type { Purchase, Provider } from "@/lib/types";
import { Badge } from "./ui/badge";
import { ReceptionModal } from "./reception-modal";

export function Purchases({
  initialPurchases,
  initialProviders,
}: {
  initialPurchases: Purchase[];
  initialProviders: Provider[];
}) {
  const [purchases, setPurchases] = React.useState(initialPurchases);
  const [providers, setProviders] = React.useState(initialProviders);
  const [selectedPurchase, setSelectedPurchase] = React.useState<Purchase | null>(null);
  const [isReceptionModalOpen, setReceptionModalOpen] = React.useState(false);

  const getProviderName = (providerId: string) => {
    return providers.find((p) => p.id === providerId)?.name || "N/A";
  };
  
  const handleOpenReception = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setReceptionModalOpen(true);
  }

  const statusVariant: Record<Purchase["status"], "default" | "secondary" | "outline"> = {
    "Pendiente": "secondary",
    "Recibida Parcial": "outline",
    "Recibida Completa": "default"
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Compras</CardTitle>
            <CardDescription>
              Administra las compras a proveedores.
            </CardDescription>
          </div>
           <div className="flex gap-2">
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
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Registrar Compra
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Compra</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.id}</TableCell>
                <TableCell>{getProviderName(purchase.providerId)}</TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[purchase.status]}>{purchase.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${purchase.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenReception(purchase)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Recibir Mercancía
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {selectedPurchase && (
        <ReceptionModal
          isOpen={isReceptionModalOpen}
          onClose={() => setReceptionModalOpen(false)}
          purchase={selectedPurchase}
        />
      )}
    </>
  );
}
