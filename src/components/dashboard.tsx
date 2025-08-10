"use client";

import * as React from "react";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Bot,
  Minus,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import type { InventoryItem, MovementLog } from "@/lib/types";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";

type Status = "ok" | "low" | "out";

const StatusBadge = ({ quantity }: { quantity: number }) => {
  let status: Status;
  let variant: "outline" | "secondary" | "destructive";
  let text: string;

  if (quantity === 0) {
    status = "out";
    variant = "destructive";
    text = "Agotado";
  } else if (quantity <= 10) {
    status = "low";
    variant = "secondary";
    text = "Stock bajo";
  } else {
    status = "ok";
    variant = "outline";
    text = "En Stock";
  }

  return <Badge variant={variant}>{text}</Badge>;
};

export function Dashboard({
  initialInventory,
  initialAuditLogs,
}: {
  initialInventory: InventoryItem[];
  initialAuditLogs: MovementLog[];
}) {
  const [inventory, setInventory] =
    React.useState<InventoryItem[]>(initialInventory);
  const [auditLogs, setAuditLogs] =
    React.useState<MovementLog[]>(initialAuditLogs);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [selectedItemForSuggestion, setSelectedItemForSuggestion] =
    React.useState<InventoryItem | null>(null);

  const handleMovementSave = (
    updatedItem: InventoryItem,
    newLog: MovementLog
  ) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setAuditLogs((prev) => [newLog, ...prev]);
    setSheetOpen(false);
  };

  const handleQuickQuantityChange = (item: InventoryItem, change: number) => {
    const updatedItem = { ...item, quantity: Math.max(0, item.quantity + change) };
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? updatedItem : i))
    );
    const newLog: MovementLog = {
      id: `log${Date.now()}`,
      timestamp: new Date(),
      user: 'usuario', // Reemplazar con usuario real
      itemName: item.name,
      itemType: item.type,
      quantityChange: change,
      origin: item.location,
      destination: item.location,
      reason: `Acción rápida`,
      osId: item.osId
    };
    setAuditLogs((prev) => [newLog, ...prev]);
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
                <DropdownMenuItem>Ubicación</DropdownMenuItem>
                <DropdownMenuItem>Tipo</DropdownMenuItem>
                <DropdownMenuItem>Estado</DropdownMenuItem>
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
                Gestiona tus partes, accesorios, SIMs y equipos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>
                      <span className="sr-only">Acciones</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <StatusBadge quantity={item.quantity} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleQuickQuantityChange(item, -1)}>
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleQuickQuantityChange(item, 1)}>
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem
                              onSelect={() => setSelectedItemForSuggestion(item)}
                            >
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artículo</TableHead>
                    <TableHead>Cambio</TableHead>
                    <TableHead>Razón</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.itemName}
                      </TableCell>
                      <TableCell
                        className={
                          log.quantityChange > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {log.quantityChange > 0 ? "+" : ""}
                        {log.quantityChange}
                      </TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             <CardFooter>
              <div className="text-xs text-muted-foreground">
                Mostrando <strong>1-{auditLogs.length}</strong> de{" "}
                <strong>{auditLogs.length}</strong> entradas de registro
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedItemForSuggestion && (
        <AiSuggestionDialog
          item={selectedItemForSuggestion}
          open={!!selectedItemForSuggestion}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedItemForSuggestion(null);
            }
          }}
        />
      )}
    </>
  );
}
