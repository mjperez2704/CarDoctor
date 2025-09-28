"use client";

import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/app/(protected)/customers/actions";
import { type ProductForQuote, saveQuote, getQuoteDetails } from "@/app/(protected)/quotes/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

const quoteItemSchema = z.object({
    productId: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => val > 0, "Selecciona un producto."),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
    description: z.string(),
});

const formSchema = z.object({
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    notes: z.string().optional(),
    items: z.array(quoteItemSchema).min(1, "Debe agregar al menos un concepto."),
});

// CORRECCIÓN: Se renombra la prop 'onCloseActionAction'
type QuoteFormModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    clients: Customer[];
    products: ProductForQuote[];
    quoteId?: number | null;
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Guardar Cotización'}
        </Button>
    );
}

export function QuoteFormModal({ isOpen, onCloseAction, clients, products, quoteId }: QuoteFormModalProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(saveQuote, undefined);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { clientId: "", notes: "", items: [] },
    });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
    const isEditing = !!quoteId;

    useEffect(() => {
        if (isOpen && isEditing) {
            getQuoteDetails(quoteId).then(data => {
                if (data) {
                    form.reset({
                        clientId: String(data.cliente_id),
                        notes: data.notas || "",
                        items: data.items.map(item => ({
                            productId: Number(item.producto_id),
                            quantity: item.cantidad,
                            unitPrice: Number(item.precio_unitario),
                            description: item.descripcion
                        }))
                    });
                }
            });
        } else if (isOpen) {
            // CORRECCIÓN: Usamos 0 como valor inicial para productId
            form.reset({ clientId: "", notes: "", items: [{ productId: 0, quantity: 1, unitPrice: 0, description: "" }] });
        }
    }, [quoteId, isOpen, form, isEditing]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            // CORRECCIÓN: Se llama a la prop con el nuevo nombre
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    const watchItems = form.watch("items");
    const subtotal = watchItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const handleProductChange = (productId: string, index: number) => {
        const product = products.find(p => String(p.id) === productId);
        if(product) {
            form.setValue(`items.${index}.unitPrice`, Number(product.precio_lista));
            form.setValue(`items.${index}.description`, product.nombre);
        }
    }

    const handleFormSubmit = form.handleSubmit((data) => {
        const formData = new FormData();
        if (isEditing) formData.append('id', String(quoteId));
        formData.append('clientId', data.clientId);
        formData.append('items', JSON.stringify(data.items));
        if (data.notes) formData.append('notes', data.notes);
        formAction(formData);
    });

    return (
        // CORRECCIÓN: Se pasa la prop con el nuevo nombre
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Cotización' : 'Crear Nueva Cotización'}</DialogTitle>
                    <DialogDescription>Complete los datos para generar una nueva cotización.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)] space-y-4">
                            {/* ... (resto del formulario sin cambios, pero el código corregido de abajo lo incluye) ... */}
                            <FormField control={form.control} name="clientId" render={({ field }) => (
                                <FormItem>
                                    <Label>Cliente</Label>
                                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger></FormControl><SelectContent>{clients.map(c => (<SelectItem key={c.id} value={String(c.id)}>{c.razon_social}</SelectItem>))}</SelectContent></Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <Separator/>
                            <h3 className="text-lg font-medium">Conceptos</h3>
                            {fields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-md">
                                    <div className="col-span-6"><FormField control={form.control} name={`items.${index}.productId`} render={({ field }) => (
                                        <FormItem><Label>Producto</Label>
                                            {/* CORRECCIÓN: Manejo de tipos para el Select */}
                                            <Select onValueChange={v => {field.onChange(Number(v)); handleProductChange(v, index);}} value={String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione producto"/></SelectTrigger></FormControl><SelectContent>{products.map(p => (<SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>))}</SelectContent></Select>
                                            <FormMessage/></FormItem>)}/></div>
                                    <div className="col-span-2"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><Label>Cant.</Label><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>)}/></div>
                                    <div className="col-span-3"><FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (<FormItem><Label>Precio U.</Label><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>)}/></div>
                                    <div className="col-span-1 flex items-end h-full"><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                                    <div className="col-span-12"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><Label className="text-xs">Desc.</Label><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)}/></div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, description: '' })}><PlusCircle className="mr-2 h-4 w-4" />Agregar Concepto</Button>
                        </div>
                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                            <SubmitButton isEditing={isEditing} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
