
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Package, Landmark, Settings } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const modules = [
  { id: "security", name: "Seguridad", icon: Shield },
  { id: "inventory", name: "Inventario", icon: Package },
  { id: "admin", name: "Administración", icon: Landmark },
  { id: "general", name: "General", icon: Settings },
];

export function BusinessRulesEngine() {
  const [selectedModule, setSelectedModule] = React.useState("inventory");

  const renderModuleContent = () => {
    switch (selectedModule) {
      case "inventory":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Inventario</CardTitle>
              <CardDescription>
                Define las restricciones y comportamientos para almacenes, secciones y lotes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['warehouses']}>
                <AccordionItem value="warehouses">
                  <AccordionTrigger className="text-lg">Reglas de Almacén</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="warehouse-name-unique" className="flex flex-col space-y-1">
                            <span>Nombres de Almacén Únicos</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                No permitir dos almacenes con el mismo nombre.
                            </span>
                        </Label>
                        <Switch id="warehouse-name-unique" defaultChecked disabled />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sections">
                  <AccordionTrigger className="text-lg">Reglas de Sección</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                     <p className="text-sm text-muted-foreground">Define las reglas para una sección específica:</p>
                     <div className="grid grid-cols-2 gap-4">
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Seleccionar Almacén..." /></SelectTrigger>
                            <SelectContent><SelectItem value="1">Almacén Principal</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Seleccionar Sección..." /></SelectTrigger>
                            <SelectContent><SelectItem value="1">Refacciones Apple</SelectItem></SelectContent>
                        </Select>
                     </div>
                     <h4 className="font-semibold">Condiciones de la sección seleccionada:</h4>
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Finalidad (USO)"/></SelectTrigger>
                            <SelectContent><SelectItem value="refacciones">Refacciones</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Estatus de SKU"/></SelectTrigger>
                            <SelectContent><SelectItem value="nuevos">Nuevos</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Marca Permitida"/></SelectTrigger>
                            <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
                        </Select>
                     </div>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="lots">
                  <AccordionTrigger className="text-lg">Reglas de Lote</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="lot-sku-limit" className="flex flex-col space-y-1">
                            <span>Máximo de SKUs por Lote</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Define la cantidad máxima de tipos de producto (SKUs) distintos por lote.
                            </span>
                        </Label>
                        <Input id="lot-sku-limit" type="number" defaultValue={2} className="w-24" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
                <Button>Guardar Reglas de Inventario</Button>
            </CardFooter>
          </Card>
        );
      case "security":
         return (
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Seguridad</CardTitle>
              <CardDescription>
                Define las políticas de acceso y permisos de los usuarios.
              </CardDescription>
            </CardHeader>
             <CardContent>
              <p className="text-muted-foreground">Próximamente.</p>
            </CardContent>
          </Card>
        );
      default:
        return <p>Selecciona un módulo para ver sus reglas.</p>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <nav className="flex flex-col gap-2">
        {modules.map((module) => (
          <Button
            key={module.id}
            variant={selectedModule === module.id ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => setSelectedModule(module.id)}
          >
            <module.icon className="mr-2 h-5 w-5" />
            {module.name}
          </Button>
        ))}
      </nav>
      <div>{renderModuleContent()}</div>
    </div>
  );
}
