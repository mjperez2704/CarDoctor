
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
import type { Producto } from "@/lib/types";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";

export function ProductCatalog({
  initialProducts,
}: {
  initialProducts: Producto[];
}) {
  const [products, setProducts] =
    React.useState<Producto[]>(initialProducts);

  const [selectedItemForAI, setSelectedItemForAI] = React.useState<Producto | null>(null);
  const [isAIDialogOpen, setAIDialogOpen] = React.useState(false);

  const handleOpenAISuggestion = (item: Producto) => {
    setSelectedItemForAI(item);
    setAIDialogOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Catálogo de Productos</CardTitle>
              <CardDescription>
                Administra todos los productos, servicios y artículos del sistema.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filtrar
                    </span>
                </Button>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Exportar
                    </span>
                </Button>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Agregar Producto
                    </span>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Precio de Lista</TableHead>
                <TableHead className="text-right">Costo Promedio</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => (
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
                          Dar de Baja
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
            Mostrando <strong>1-{products.length}</strong> de{" "}
            <strong>{products.length}</strong> productos
          </div>
        </CardFooter>
      </Card>
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
