
"use client";

import * as React from "react";
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
import { Skeleton } from "./ui/skeleton";
import type { Producto } from "@/lib/types";
import { getLotesPorProducto, type LoteConDetalles } from "@/lib/data";

type StockDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Producto | null;
};

export function StockDetailModal({ isOpen, onClose, product }: StockDetailModalProps) {
  const [lotes, setLotes] = React.useState<LoteConDetalles[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && product) {
      const fetchLotes = async () => {
        setIsLoading(true);
        try {
          const fetchedLotes = await getLotesPorProducto(product.id);
          setLotes(fetchedLotes);
        } catch (error) {
          console.error("Error al obtener los lotes del producto:", error);
          setLotes([]); // Limpiar en caso de error
        } finally {
          setIsLoading(false);
        }
      };

      fetchLotes();
    } else {
      // Resetear estado cuando el modal se cierra
      setLotes([]);
    }
  }, [isOpen, product]);

  const totalStock = lotes.reduce((acc, lote) => acc + lote.cantidad, 0);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalle de Stock: {product.nombre}</DialogTitle>
          <DialogDescription>
            SKU: {product.sku} | Existencia Total: <Badge>{totalStock} {product.unidad}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold mb-2">Ubicaciones del Stock</h4>
          <div className="border rounded-md max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Fecha de Caducidad</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : lotes.length > 0 ? (
                  lotes.map((lote) => (
                    <TableRow key={lote.id}>
                      <TableCell>{lote.almacen_nombre || 'N/A'}</TableCell>
                      <TableCell>{lote.seccion_nombre || 'N/A'}</TableCell>
                      <TableCell>{lote.codigo_lote}</TableCell>
                      <TableCell>{lote.fecha_caducidad ? new Date(lote.fecha_caducidad).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="text-right font-medium">{lote.cantidad}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay existencias registradas para este producto.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
