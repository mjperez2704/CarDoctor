"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { addMovement } from "@/lib/data";
import type { InventoryItem, MovementLog } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  itemId: z.string().min(1, "Please select an item."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
  reason: z.string().min(1, "Reason is required."),
  osId: z.string().optional(),
});

type MovementFormProps = {
  inventory: InventoryItem[];
  onSave: (updatedItem: InventoryItem, newLog: MovementLog) => void;
};

export function MovementForm({ inventory, onSave }: MovementFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      osId: "",
    },
  });

  const selectedItemId = form.watch("itemId");
  const selectedItem = inventory.find((item) => item.id === selectedItemId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedItem) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected item not found.",
      });
      return;
    }

    const { updatedItem, newLog } = addMovement(selectedItem, values.quantity, {
      user: "user",
      origin: values.origin,
      destination: values.destination,
      reason: values.reason,
      osId: values.osId,
    });
    
    onSave(updatedItem, newLog);

    toast({
      title: "Movement Saved",
      description: `Logged movement of ${values.quantity} x ${selectedItem.name}.`,
    });
    form.reset();
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Add Inventory Movement</SheetTitle>
        <SheetDescription>
          Log a new stock movement for any item.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object/Item</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.location})
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablero">Tablero</SelectItem>
                    <SelectItem value="Vitrina">Vitrina</SelectItem>
                    <SelectItem value="Estaciones">Estaciones</SelectItem>
                    <SelectItem value="Almacén">Almacén</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Repair Bay">Repair Bay</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablero">Tablero</SelectItem>
                    <SelectItem value="Vitrina">Vitrina</SelectItem>
                    <SelectItem value="Estaciones">Estaciones</SelectItem>
                    <SelectItem value="Almacén">Almacén</SelectItem>
                    <SelectItem value="Repair Bay">Repair Bay</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Initial Stock">Initial Stock</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="osId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OS ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., OS-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit">Save Movement</Button>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}
