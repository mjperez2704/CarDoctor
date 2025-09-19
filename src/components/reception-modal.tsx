
"use client";

import * as React from "react";
import type { Purchase, ReceptionItem } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Warehouse, MapPin } from "lucide-react";
import { Label } from "./ui/label";

type ReceptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
};

export function ReceptionModal({ isOpen, onClose, purchase }: ReceptionModalProps) {
  const [receptionItems, setReceptionItems] = React.useState<ReceptionItem[]>([]);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (purchase) {
      setReceptionItems(
        purchase.items.map((item) => ({
          sku: item.sku,
          name: item.name,
          orderedQuantity: item.quantity,
          unitCost: item.price,
          receivedQuantity: item.quantity,
          isComplete: true,
          location: "Sin asignar", // Nueva propiedad
        }))
      );
    }
  }, [purchase]);

  const handleQuantityChange = (itemName: string, value: string) => {
    const receivedQty = parseInt(value, 10) || 0;
    setReceptionItems((prev) =>
      prev.map((item) =>
        item.name === itemName
          ? {
              ...item,
              receivedQuantity: receivedQty,
              isComplete: receivedQty === item.orderedQuantity,
            }
          : item
      )
    );
  };
  
  const handleCostChange = (itemName: string, value: string) => {
    const newCost = parseFloat(value) || 0;
     setReceptionItems((prev) =>
      prev.map((item) =>
        item.name === itemName
          ? { ...item, unitCost: newCost }
          : item
      )
    );
  }

  const handleCompleteToggle = (itemName: string, checked: boolean) => {
     setReceptionItems((prev) =>
      prev.map((item) =>
        item.name === itemName
          ? {
              ...item,
              isComplete: checked,
              receivedQuantity: checked ? item.orderedQuantity : 0,
            }
          : item
      )
    );
  }

  const totalAmount = receptionItems.reduce((acc, item) => acc + (item.receivedQuantity * item.unitCost), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Recibir Mercancía de Compra: {purchase.id}</DialogTitle>
          <DialogDescription>
            Confirma las cantidades recibidas para cada artículo y asigna su ubicación en el inventario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Artículos a Recibir</h4>
                 <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>SKU/Descripción</TableHead>
                            <TableHead className="text-center">Pedida</TableHead>
                            <TableHead className="text-center w-[120px]">Recibida</TableHead>
                            <TableHead className="text-center w-[130px]">Costo Unit.</TableHead>
                            <TableHead className="text-center">Ubicación</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receptionItems.map(item => (
                                <TableRow key={item.sku}>
                                    <TableCell className="font-medium">
                                        <p>{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                                    </TableCell>
                                    <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            type="number"
                                            value={item.receivedQuantity}
                                            onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                                            className="w-20 mx-auto h-8"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.unitCost.toFixed(2)}
                                            onChange={(e) => handleCostChange(item.name, e.target.value)}
                                            className="w-24 mx-auto h-8"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <Button variant="outline" size="sm" className="h-8 gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            Asignar
                                       </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold">Resumen y Notas</h4>
                <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                     <div className="flex justify-between items-center text-sm">
                        <span>Importe Total Recibido:</span>
                        <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                     </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reception-notes">Notas de Recepción</Label>
                    <Textarea 
                        id="reception-notes"
                        placeholder="Ej. Mercancía para revisión, empaque en mal estado..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[150px]"
                    />
                 </div>
            </div>

        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button>
                <Warehouse className="mr-2 h-4 w-4" />
                Ingresar Mercancía al Inventario
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
