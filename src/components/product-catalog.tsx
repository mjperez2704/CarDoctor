
"use client";

import * as React from "react";
import { z } from "zod";
import { File, ListFilter, MoreHorizontal, PlusCircle, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
import { cn } from "@/lib/utils";

import type { Producto, Proveedor, Marca } from "@/lib/types";
import { saveProductAction, productFormSchema } from "@/app/actions";

import { AiSuggestionDialog } from "./ai-suggestion-dialog";
import { ProductFormModal } from "./product-form-modal";
import { StockDetailModal } from "./stock-detail-modal";


export function ProductCatalog({
  initialProducts,
  providers,
  brands,
}: {
  initialProducts: Producto[];
  providers: Proveedor[];
  brands: Marca[];
}) {
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Producto[]>(initialProducts);
  
  // State for modals
  const [isProductModalOpen, setProductModalOpen] = React.useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [isAIDialogOpen, setAIDialogOpen] = React.useState(false);
  
  // State for selected items
  const [selectedItemForAI, setSelectedItemForAI] = React.useState<Producto | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = React.useState<Producto | null>(null);

  // Form submission state
  const [isSaving, setIsSaving] = React.useState(false);

  const handleOpenDetailModal = (item: Producto) => {
    setSelectedItemForDetail(item);
    setDetailModalOpen(true);
  }

  const handleOpenAISuggestion = (item: Producto) => {
    setSelectedItemForAI(item);
    setAIDialogOpen(true);
  };

  const handleSaveProduct = async (values: z.infer<typeof productFormSchema>) => {
    setIsSaving(true);
    try {
      const result = await saveProductAction(values);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        setProductModalOpen(false);
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Ocurrió un error inesperado." });
    } finally {
      setIsSaving(false);
    }
  };

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
              <Button
                size="sm"
                className="h-7 gap-1"
                onClick={() => setProductModalOpen(true)}
              >
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
                <TableHead>Existencia</TableHead>
                <TableHead>Precio de Lista</TableHead>
                <TableHead className="text-right">Costo Promedio</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => {
                const stock = item.stock_actual || 0;
                const isLowStock = item.stock_min ? stock <= item.stock_min : false;

                return (
                  <TableRow
                    key={item.id}
                    className={cn(isLowStock && "bg-destructive/10 hover:bg-destructive/20")}
                  >
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto font-medium" onClick={() => handleOpenDetailModal(item)}>
                        {item.sku}
                      </Button>
                    </TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell className={cn("font-semibold", isLowStock && "text-destructive")}>
                        {stock} {item.unidad}
                    </TableCell>
                    <TableCell>${(item.precio_lista || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(item.costo_promedio || 0).toFixed(4)}
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
                            onClick={() => handleOpenAISuggestion(item)}
                          >
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
                );
              })}
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

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        providers={providers}
        brands={brands}
        isSaving={isSaving} 
      />
      
      {selectedItemForDetail && (
         <StockDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            item={selectedItemForDetail}
        />
      )}

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
