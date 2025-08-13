"use client";

import * as React from "react";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Bot,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MovementForm } from "./movement-form";
import type { Producto, MovimientoInventario } from "@/lib/types";

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
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleMovementSave = () => {
    setSheetOpen(false);
  };

  return (
    <>
      <Tabs defaultValue="inventory">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
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
                <DropdownMenuItem>Categoría</DropdownMenuItem>
                <DropdownMenuItem>Marca</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Movimiento
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <MovementForm
                  inventory={inventory}
                  onSave={handleMovementSave}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>
                Gestiona tus productos, refacciones, accesorios y equipos.
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
                            <DropdownMenuItem>
                              <Bot className="mr-2 h-4 w-4" />
                              Obtener Sugerencia IA
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
                <strong>{inventory.length}</strong> productos
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Auditoría</CardTitle>
              <CardDescription>
                Un registro completo de todos los movimientos de inventario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>El registro de auditoría se implementará en un paso posterior.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
