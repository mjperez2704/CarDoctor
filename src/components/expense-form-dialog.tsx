'use client';

import * as React from 'react';
import { createExpense } from '@/app/(protected)/finances/expenses/actions';
import type { Empleado } from '@/app/(protected)/finances/expenses/actions';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ExpenseFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  employees: Empleado[];
};

export function ExpenseFormDialog({ isOpen, onClose, employees }: ExpenseFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      fecha: formData.get('date') as string,
      categoria: formData.get('category') as string,
      descripcion: formData.get('description') as string,
      monto: Number(formData.get('amount') as string),
      empleado_id: Number(formData.get('employee') as string),
    };

    // Basic validation
    if (!data.fecha || !data.categoria || !data.monto || !data.empleado_id) {
        toast({
            title: 'Error de validación',
            description: 'Por favor, complete todos los campos requeridos.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await createExpense(data);
      if (result.success) {
        toast({
          title: 'Éxito',
          description: 'Gasto registrado correctamente.',
        });
        formRef.current?.reset();
        onClose(); // This will trigger revalidation on the parent page
      } else {
        throw new Error(result.message || 'Error al crear el gasto.');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo registrar el gasto.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Complete la información para registrar un nuevo gasto en el sistema.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Fecha
              </Label>
              <Input id="date" name="date" type="date" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Input id="category" name="category" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Monto
              </Label>
              <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Empleado
              </Label>
              <Select name="employee">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
