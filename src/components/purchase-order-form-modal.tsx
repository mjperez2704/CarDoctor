"use client";

import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Proveedor, Producto } from "@/lib/types";
import { savePurchaseOrder, getPurchaseOrderDetails } from "@/app/(protected)/purchases/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

// CORRECCIÓN: El schema ahora transforma la entrada a número de forma segura.
const purchaseItemSchema = z.object({
    productId: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => val > 0, "Selecciona un producto."),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const formSchema = z.object({
    providerId: z.string().min(1, "Debe seleccionar un proveedor."),
    items: z.array(purchaseItemSchema).min(1, "Debe agregar al menos un producto."),
});

type PurchaseOrderFormModalProps = {
    isOpen: boolean;
    onCloseActionAction: () => void;
    providers: Proveedor[];
    products: Producto[];
    orderId?: number | null;
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Orden de Compra'}
        </Button>
    );
}

export function PurchaseOrderFormModal({ isOpen, onCloseActionAction, providers, products, orderId }: PurchaseOrderFormModalProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(savePurchaseOrder, undefined);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { providerId: "", items: [] },
    });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
    const isEditing = !!orderId;

    useEffect(() => {
        if (isOpen && isEditing) {
            getPurchaseOrderDetails(orderId).then(data => {
                if (data) {
                    form.reset({
                        providerId: String(data.proveedor_id),
                        items: data.items.map(item => ({
                            // CORRECCIÓN: Aseguramos que los valores sean numéricos al cargar
                            productId: Number(item.producto_id),
                            quantity: Number(item.cantidad),
                            unitPrice: Number(item.precio_unitario),
                        }))
                    });
                }
            });
        } else if (isOpen) {
            // CORRECCIÓN: Usamos 0 como valor inicial para productId, que es un número.
            form.reset({ providerId: "", items: [{ productId: 0, quantity: 1, unitPrice: 0 }] });
        }
    }, [orderId, isOpen, form, isEditing]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) onCloseActionAction();
        }
    }, [state, toast, onCloseActionAction]);

    const handleProductChange = (productId: string, index: number) => {
        const product = products.find(p => String(p.id) === productId);
        if (product) {
            form.setValue(`items.${index}.unitPrice`, Number(product.costo_promedio || 0));
        }
    };

    const handleFormSubmit = form.handleSubmit((data) => {
        const formData = new FormData();
        if (isEditing) formData.append('id', String(orderId));
        formData.append('providerId', data.providerId);
        formData.append('items', JSON.stringify(data.items));
        formAction(formData);
    });

    return (
        <Dialog open={isOpen} onOpenChange={onCloseActionAction}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Orden de Compra' : 'Crear Nueva Orden de Compra'}</DialogTitle>
                    <DialogDescription>Complete los datos para generar la orden de compra.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)] space-y-4">
                            <FormField control={form.control} name="providerId" render={({ field }) => (
                                <FormItem>
                                    <Label>Proveedor</Label>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un proveedor" /></SelectTrigger></FormControl>
                                        <SelectContent>{providers.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.razon_social}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-medium">Conceptos de la Orden</h3>
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-md">
                                    <div className="col-span-6">
                                        <FormField control={form.control} name={`items.${index}.productId`} render={({ field }) => (
                                            <FormItem>
                                                <Label>Producto</Label>
                                                {/* CORRECCIÓN: El valor del Select se convierte a string y el onChange a número */}
                                                <Select onValueChange={(value) => { field.onChange(Number(value)); handleProductChange(value, index); }} value={String(field.value)}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un producto" /></SelectTrigger></FormControl>
                                                    <SelectContent>{products.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.nombre} ({p.sku})</SelectItem>))}</SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <div className="col-span-2">
                                        <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                            <FormItem><Label>Cantidad</Label><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                    <div className="col-span-3">
                                        <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                                            <FormItem><Label>Costo Unit.</Label><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                    <div className="col-span-1 flex items-end h-full">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {/* CORRECCIÓN: Usamos 0 como valor inicial para productId al agregar un nuevo item. */}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0 })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Concepto
                            </Button>
                        </div>
                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={onCloseActionAction}>Cancelar</Button>
                            <SubmitButton isEditing={isEditing} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
