
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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

const formSchema = z.object({
  clientId: z.string().min(1, "Debe seleccionar un cliente."),
  vehicleId: z.string().min(1, "Debe seleccionar un vehículo."), // Asumiendo que el ID es un string por ahora
  technicianId: z.string().optional(),
  initialDiagnosis: z.string().min(10, "El diagnóstico debe tener al menos 10 caracteres."),
  notes: z.string().optional(),
});

type WorkOrderFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  clients: Cliente[];
  employees: Empleado[];
};

export function WorkOrderFormModal({
  isOpen,
  onClose,
  onSave,
  clients,
  employees,
}: WorkOrderFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
    toast({
      title: "Orden de Servicio Creada",
      description: "La nueva orden ha sido guardada exitosamente (simulado).",
    });
    onClose();
  };

  const technicians = employees.filter(e => e.puesto?.toLowerCase().includes('mecánico') || e.puesto?.toLowerCase().includes('técnico'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Orden de Servicio</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo vehículo en el taller.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.razon_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('clientId')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un vehículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar vehículos del cliente seleccionado */}
                        <SelectItem value="1">Nissan Versa 2020 (ABC-123)</SelectItem>
                        <SelectItem value="3">Ford Mustang 2022 (XYZ-789)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                        Seleccione un cliente primero.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <FormField
                control={form.control}
                name="initialDiagnosis"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Falla o Servicio Solicitado (Diagnóstico Inicial)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Ej. El motor hace un ruido extraño al acelerar, revisar frenos..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignar a Técnico (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Asignar a un técnico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={String(tech.id)}>
                            {tech.nombre} {tech.apellido_p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Crear Orden</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
