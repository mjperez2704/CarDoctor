
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, Producto } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

const quoteItemSchema = z.object({
  productId: z.string().min(1, "Selecciona un producto."),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
  unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
  description: z.string(),
});

const formSchema = z.object({
  clientId: z.string().min(1, "Debe seleccionar un cliente."),
  vehicleId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "Debe agregar al menos un concepto a la cotización."),
});

type QuoteFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  clients: Cliente[];
  products: Producto[];
};

export function QuoteFormModal({
  isOpen,
  onClose,
  onSave,
  clients,
  products,
}: QuoteFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        items: [{ productId: "", quantity: 1, unitPrice: 0, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const subtotal = watchItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
  };
  
  const handleProductChange = (productId: string, index: number) => {
    const product = products.find(p => String(p.id) === productId);
    if(product) {
        form.setValue(`items.${index}.unitPrice`, product.precio_lista);
        form.setValue(`items.${index}.description`, product.nombre);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Cotización</DialogTitle>
          <DialogDescription>
            Complete los datos para generar una nueva cotización.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
             <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="clientId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un cliente"/></SelectTrigger></FormControl>
                                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.razon_social}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="vehicleId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehículo (Opcional)</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('clientId')}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un vehículo"/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="1">Nissan Versa 2020 (ABC-123)</SelectItem>
                                    <SelectItem value="3">Ford Mustang 2022 (XYZ-789)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}/>
                </div>
                
                <Separator/>

                <h3 className="text-lg font-semibold">Conceptos de la Cotización</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_100px_120px_auto] gap-2 items-start p-2 border rounded-md">
                      <FormField control={form.control} name={`items.${index}.productId`} render={({ field: formField }) => (
                        <FormItem>
                           <Select onValueChange={(value) => { formField.onChange(value); handleProductChange(value, index); }} defaultValue={formField.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Producto/Servicio"/></SelectTrigger></FormControl>
                                <SelectContent>{products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Cant." {...field} /></FormControl><FormMessage/></FormItem>
                      )}/>
                      <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" step="0.01" placeholder="Precio U." {...field} /></FormControl><FormMessage/></FormItem>
                      )}/>
                       <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1, unitPrice: 0, description: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Agregar Concepto
                  </Button>
                </div>
                
                 <Separator/>

                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas / Observaciones</FormLabel>
                            <FormControl><Textarea placeholder="Condiciones, vigencia, etc." {...field}/></FormControl>
                        </FormItem>
                    )}/>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex justify-between w-full max-w-xs text-sm">
                            <span>Subtotal:</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between w-full max-w-xs text-sm">
                            <span>IVA (16%):</span>
                            <span className="font-medium">${iva.toFixed(2)}</span>
                        </div>
                        <Separator className="my-1"/>
                         <div className="flex justify-between w-full max-w-xs text-lg font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                 </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Cotización</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
