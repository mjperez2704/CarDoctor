
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
import type { Producto, Lote, Almacen, Seccion } from "@/lib/types";
import { getAlmacenes, getProductos, mockLotes } from "@/lib/data"; // Using mock data functions for now

type StockDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: Producto;
};

type StockLocation = {
  warehouseName: string;
  sectionName: string;
  lotCode: string;
  quantity: number;
};

export function StockDetailModal({ isOpen, onClose, item }: StockDetailModalProps) {
  const [stockLocations, setStockLocations] = React.useState<StockLocation[]>([]);
  const [totalStock, setTotalStock] = React.useState(0);
  const [almacenes, setAlmacenes] = React.useState<Almacen[]>([]);

  React.useEffect(() => {
    if (isOpen && item) {
      const allAlmacenes = getAlmacenes();
      setAlmacenes(allAlmacenes);
      
      const itemLotes = mockLotes.filter(lote => lote.producto_id === item.id);
      
      const locations: StockLocation[] = itemLotes.map(lote => {
        const warehouse = allAlmacenes.find(a => a.id === lote.almacen_id);
        const section = warehouse?.secciones?.find(s => s.id === lote.seccion_id);
        
        return {
          warehouseName: warehouse?.nombre || 'N/A',
          sectionName: section?.nombre || 'N/A',
          lotCode: lote.codigo_lote,
          quantity: lote.cantidad
        }
      });
      
      setStockLocations(locations);
      setTotalStock(locations.reduce((acc, loc) => acc + loc.quantity, 0));
    }
  }, [isOpen, item]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalle de Stock: {item.nombre}</DialogTitle>
          <DialogDescription>
            SKU: {item.sku} | Existencia Total: <Badge>{totalStock} {item.unidad}</Badge>
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
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockLocations.length > 0 ? (
                  stockLocations.map((loc, index) => (
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
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
