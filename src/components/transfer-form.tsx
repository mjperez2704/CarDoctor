"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Almacen, Producto, Lote } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { saveTransfer } from "@/app/(protected)/transfers/actions";

const formSchema = z.object({
    transferType: z.enum(["inter-warehouse", "intra-warehouse"]),
    originWarehouse: z.string().optional(),
    destinationWarehouse: z.string().optional(),
    warehouse: z.string().optional(),
    originLot: z.string().min(1, "El lote de origen es requerido."),
    destinationLot: z.string().min(1, "El lote de destino es requerido."),
    product: z.string().min(1, "El producto es requerido."),
    quantity: z.coerce.number().int().positive("La cantidad debe ser un número positivo."),
    transferAll: z.boolean().optional(),
}).refine(data => {
    if (data.transferType === 'inter-warehouse') {
        return !!data.originWarehouse && !!data.destinationWarehouse && data.originWarehouse !== data.destinationWarehouse;
    }
    return true;
}, {
    message: "El almacén de origen y destino deben ser seleccionados y no pueden ser el mismo.",
    path: ["destinationWarehouse"],
}).refine(data => {
    if (data.transferType === 'intra-warehouse') {
        return data.originLot !== data.destinationLot;
    }
    return true;
}, {
    message: "El lote de origen y destino no pueden ser el mismo.",
    path: ["destinationLot"],
});

type TransferFormProps = {
    almacenes: Almacen[];
    productos: Producto[];
    lotes: Lote[];
};

export function TransferForm({ almacenes, productos, lotes }: TransferFormProps) {
    const { toast } = useToast();
    const [availableQuantity, setAvailableQuantity] = React.useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema.refine(data => {
            if(availableQuantity !== null) {
                return data.quantity <= availableQuantity;
            }
            return true;
        }, {
            message: "La cantidad a trasladar no puede ser mayor que la disponible.",
            path: ["quantity"]
        })),
        defaultValues: {
            transferType: "inter-warehouse",
            quantity: 1,
            transferAll: false,
        },
    });

    const transferType = form.watch("transferType");
    const originWarehouseId = form.watch("originWarehouse");
    const intraWarehouseId = form.watch("warehouse");
    const originLotId = form.watch("originLot");
    const productId = form.watch("product");
    const transferAll = form.watch("transferAll");

    React.useEffect(() => {
        if(originLotId && productId) {
            const lot = lotes.find(l => String(l.id) === originLotId && String(l.producto_id) === productId);
            if(lot) {
                setAvailableQuantity(lot.cantidad);
                if(transferAll) {
                    form.setValue('quantity', lot.cantidad);
                }
            } else {
                setAvailableQuantity(null);
            }
        } else {
            setAvailableQuantity(null);
        }
    }, [originLotId, productId, transferAll, form, lotes]);


    const getLotsForWarehouse = (warehouseId: string | undefined) => {
        if (!warehouseId) return [];
        return lotes.filter(lote => String(lote.almacen_id) === warehouseId);
    }

    const originLots = getLotsForWarehouse(transferType === 'inter-warehouse' ? originWarehouseId : intraWarehouseId);
    const destinationLots = getLotsForWarehouse(transferType === 'inter-warehouse' ? form.watch("destinationWarehouse") : intraWarehouseId);

    const [submitting, setSubmitting] = React.useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitting(true);
        const formData = new FormData();
        formData.append('transferType', values.transferType);
        if (values.originWarehouse) formData.append('originWarehouse', values.originWarehouse);
        if (values.destinationWarehouse) formData.append('destinationWarehouse', values.destinationWarehouse);
        if (values.warehouse) formData.append('warehouse', values.warehouse);
        formData.append('originLot', values.originLot);
        formData.append('destinationLot', values.destinationLot);
        formData.append('product', values.product);
        formData.append('quantity', String(values.quantity));
        formData.append('transferAll', values.transferAll ? 'true' : 'false');
        try {
            const result = await saveTransfer(null, formData);
            toast({
                title: result.success ? 'Éxito' : 'Error',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
            if (result.success) {
                form.reset();
                setAvailableQuantity(null);
            }
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudo registrar el traslado.', variant: 'destructive' });
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="transferType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Tipo de Traslado</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                form.reset({
                                                    ...form.getValues(),
                                                    transferType: value as any,
                                                    originWarehouse: undefined,
                                                    destinationWarehouse: undefined,
                                                    warehouse: undefined,
                                                    originLot: undefined,
                                                    destinationLot: undefined,
                                                });
                                                setAvailableQuantity(null);
                                            }}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="inter-warehouse" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Entre Almacenes
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="intra-warehouse" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Entre Lotes (mismo almacén)
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {transferType === "inter-warehouse" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="originWarehouse" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Almacén Origen</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione almacén origen"/></SelectTrigger></FormControl>
                                            <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="destinationWarehouse" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Almacén Destino</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione almacén destino"/></SelectTrigger></FormControl>
                                            <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}

                        {transferType === "intra-warehouse" && (
                            <FormField control={form.control} name="warehouse" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Almacén</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un almacén"/></SelectTrigger></FormControl>
                                        <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="originLot" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lote Origen</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={originLots.length === 0}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione lote origen"/></SelectTrigger></FormControl>
                                        <SelectContent>{originLots.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.codigo_lote}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="destinationLot" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lote Destino</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={destinationLots.length === 0}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione lote destino"/></SelectTrigger></FormControl>
                                        <SelectContent>{destinationLots.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.codigo_lote}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                        <FormField control={form.control} name="product" render={({field}) => (
                            <FormItem>
                                <FormLabel>Producto (SKU)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!originLotId}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un producto"/></SelectTrigger></FormControl>
                                    <SelectContent>{productos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre} ({p.sku})</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad a Trasladar</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={transferAll}/>
                                        </FormControl>
                                        {availableQuantity !== null && (
                                            <FormDescription>
                                                Disponible: {availableQuantity} unidades
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="transferAll"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 pb-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={availableQuantity === null}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal mt-0!">
                                            Trasladar todo el stock
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Registrar Traslado
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
