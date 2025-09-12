
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, Empleado } from "@/lib/types";

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
  FormDescription,
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
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  // Datos principales
  clientId: z.string().min(1, "Debe seleccionar un cliente."),
  vehicleId: z.string().min(1, "Debe seleccionar un vehículo."),
  mileage: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  serviceReason: z.string().min(10, "El motivo debe tener al menos 10 caracteres."),
  
  // Checklist de inventario
  fuelLevel: z.array(z.number()).default([50]),
  spareTire: z.boolean().default(false),
  jack: z.boolean().default(false),
  jackHandle: z.boolean().default(false),
  lugWrench: z.boolean().default(false),
  stereo: z.boolean().default(false),
  carMats: z.boolean().default(false),
  
  // Daños y observaciones
  damageFrontBumper: z.string().optional(),
  damageHood: z.string().optional(),
  damageRoof: z.string().optional(),
  damageRearBumper: z.string().optional(),
  damageTrunk: z.string().optional(),
  damageHeadlights: z.string().optional(),
  damageTaillights: z.string().optional(),
  damageWindshield: z.string().optional(),
  damageRearWindow: z.string().optional(),
  damageLeftMirror: z.string().optional(),
  damageRightMirror: z.string().optional(),
  damageTires: z.string().optional(),
  notes: z.string().optional(),
});

type ReceptionChecklistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  clients: Cliente[];
  employees: Empleado[]; // Aunque no se usa en el form, puede ser útil para asignación
};

export function ReceptionChecklistModal({
  isOpen,
  onClose,
  onSave,
  clients,
}: ReceptionChecklistModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fuelLevel: [50],
      spareTire: false,
      jack: false,
      jackHandle: false,
      lugWrench: false,
      stereo: false,
      carMats: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Aquí, se crearía tanto la recepción como la orden de servicio inicial.
    onSave(values);
    form.reset();
    toast({
      title: "Recepción Registrada",
      description: "El vehículo ha sido registrado y se ha creado una nueva Orden de Servicio.",
    });
    onClose();
  };

  const fuelLevelValue = form.watch('fuelLevel')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registrar Recepción de Vehículo</DialogTitle>
          <DialogDescription>
            Complete el checklist y los datos del vehículo para crear una nueva Orden de Servicio.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
             <div className="overflow-y-auto pr-6 h-[calc(80vh-150px)]">
                <div className="space-y-6">
                    {/* Sección de Datos Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="clientId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger></FormControl>
                                <SelectContent>{clients.map((client) => (<SelectItem key={client.id} value={String(client.id)}>{client.razon_social}</SelectItem>))}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="vehicleId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehículo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('clientId')}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un vehículo" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="1">Nissan Versa 2020 (ABC-123)</SelectItem>
                                    <SelectItem value="3">Ford Mustang 2022 (XYZ-789)</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="mileage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kilometraje</FormLabel>
                            <FormControl><Input type="number" placeholder="Ej. 55000" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="serviceReason" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Falla o Servicio Solicitado</FormLabel>
                            <FormControl><Textarea placeholder="Ej. El motor hace un ruido extraño al acelerar, revisar frenos..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    
                    <Separator />

                    {/* Sección de Checklist */}
                    <h3 className="text-lg font-semibold">Inventario de Recepción</h3>
                    <FormField control={form.control} name="fuelLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nivel de Gasolina: {fuelLevelValue}%</FormLabel>
                            <FormControl><Slider defaultValue={[50]} max={100} step={1} onValueChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         <FormField control={form.control} name="spareTire" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Llanta de Refacción</FormLabel>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="jack" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Gato Hidráulico</FormLabel>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="jackHandle" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Maneral de Gato</FormLabel>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="lugWrench" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Llave de Cruz</FormLabel>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="stereo" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Estéreo</FormLabel>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="carMats" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Tapetes</FormLabel>
                            </FormItem>
                        )}/>
                    </div>

                    <Separator />
                    
                    {/* Sección de Observaciones */}
                    <h3 className="text-lg font-semibold">Registro de Daños Visibles</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="damageFrontBumper" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fascia Delantera</FormLabel>
                                <FormControl><Input placeholder="Rayones leves, raspadura en esquina..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="damageRearBumper" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fascia Trasera</FormLabel>
                                <FormControl><Input placeholder="Golpe ligero, pintura saltada..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="damageHood" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cofre</FormLabel>
                                <FormControl><Input placeholder="Pequeña abolladura, rayón..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="damageTrunk" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cajuela</FormLabel>
                                <FormControl><Input placeholder="Daños, rayones..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="damageRoof" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Toldo</FormLabel>
                                <FormControl><Input placeholder="Daños, rayones..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="damageWindshield" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parabrisas</FormLabel>
                                <FormControl><Input placeholder="Estrellado, rayado por plumas..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="damageLeftMirror" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Espejo Izquierdo</FormLabel>
                                <FormControl><Input placeholder="Carcasa rota, luna estrellada..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="damageRightMirror" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Espejo Derecho</FormLabel>
                                <FormControl><Input placeholder="Rayado, flojo..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="damageTires" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Llantas y Rines</FormLabel>
                                <FormControl><Input placeholder="Rines raspados, llantas bajas..." {...field} /></FormControl>
                            </FormItem>
                        )}/>
                     </div>
                     
                     <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas Adicionales</FormLabel>
                            <FormControl><Textarea placeholder="Cualquier otra observación relevante. Ej. Puerta delantera derecha no cierra bien." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Generar Orden de Servicio</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    