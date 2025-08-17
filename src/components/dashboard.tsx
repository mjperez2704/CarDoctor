"use client";

import * as React from "react";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Bot,
  Wrench,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Producto, MovimientoInventario } from "@/lib/types";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";

export function Dashboard({
  initialInventory,
  initialAuditLogs,
}: {
  initialInventory: Producto[];
  initialAuditLogs: MovimientoInventario[];
}) {
  const [inventory, setInventory] =
    React.useState<Producto[]>(initialInventory);
  const [auditLogs, setAuditLogs] =
    React.useState<MovimientoInventario[]>(initialAuditLogs);
  
  const [selectedItemForAI, setSelectedItemForAI] = React.useState<Producto | null>(null);
  const [isAIDialogOpen, setAIDialogOpen] = React.useState(false);

  const handleOpenAISuggestion = (item: Producto) => {
    setSelectedItemForAI(item);
    setAIDialogOpen(true);
  }

  return (
    <>
      <Tabs defaultValue="services">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="services">Órdenes de Servicio</TabsTrigger>
            <TabsTrigger value="inventory">Inventario de Refacciones</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtrar
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuItem>Mecánico</DropdownMenuItem>
                <DropdownMenuItem>Estado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nueva Orden
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="services">
           <Card>
            <CardHeader>
              <CardTitle>Órdenes de Servicio Activas</CardTitle>
              <CardDescription>
                Vehículos actualmente en el taller.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <Car className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Aún no hay órdenes de servicio.</p>
                <Button className="mt-2">Crear Primera Orden</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventario de Refacciones</CardTitle>
              <CardDescription>
                Gestiona las refacciones y consumibles del taller.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Costo Promedio</TableHead>
                    <TableHead>
                      <span className="sr-only">Acciones</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.unidad}</TableCell>
                      <TableCell>${item.precio_lista.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.costo_promedio.toFixed(4)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenAISuggestion(item)}>
                              <Bot className="mr-2 h-4 w-4" />
                              Sugerencia de Stock (IA)
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Mostrando <strong>1-{inventory.length}</strong> de{" "}
                <strong>{inventory.length}</strong> refacciones
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedItemForAI && (
        <AiSuggestionDialog
          item={selectedItemForAI}
          open={isAIDialogOpen}
          onOpenChange={setAIDialogOpen}
        />
      )}
    </>
  );
}
