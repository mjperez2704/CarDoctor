
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

type ReceptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
};

export function ReceptionModal({ isOpen, onClose, purchase }: ReceptionModalProps) {
  const [receptionItems, setReceptionItems] = React.useState<ReceptionItem[]>([]);

  React.useEffect(() => {
    if (purchase) {
      setReceptionItems(
        purchase.items.map((item) => ({
          name: item.name,
          orderedQuantity: item.quantity,
          unitCost: item.price,
          receivedQuantity: item.quantity,
          isComplete: true,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recibir Mercancía de Compra: {purchase.id}</DialogTitle>
          <DialogDescription>
            Confirma las cantidades recibidas para cada artículo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU/Descripción</TableHead>
                <TableHead className="text-center">Cantidad Pedida</TableHead>
                <TableHead className="text-center">Costo Unitario</TableHead>
                <TableHead className="text-center">Completa</TableHead>
                <TableHead className="text-center">Cantidad Recibida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {receptionItems.map(item => (
                    <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                        <TableCell className="text-center">${item.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                            <Checkbox 
                                checked={item.isComplete}
                                onCheckedChange={(checked) => handleCompleteToggle(item.name, !!checked)}
                            />
                        </TableCell>
                        <TableCell className="text-center">
                            <Input
                                type="number"
                                value={item.receivedQuantity}
                                onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                                className="w-24 mx-auto"
                                disabled={item.isComplete}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button>Asignar a Almacén</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
