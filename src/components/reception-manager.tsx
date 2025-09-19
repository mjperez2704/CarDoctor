
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import type { OrdenServicio, Cliente, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";
import { ReceptionChecklistModal } from "./reception-checklist-modal";

type ReceptionManagerProps = {
  initialReceptions: OrdenServicio[];
  clients: Cliente[];
  employees: Empleado[];
};

export function ReceptionManager({
  initialReceptions,
  clients,
  employees,
}: ReceptionManagerProps) {
  const [receptions, setReceptions] = React.useState(initialReceptions);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getClientName = (clientId: number) => {
    return clients.find((c) => c.id === clientId)?.razon_social || "N/A";
  };

  const statusVariant: Record<
    OrdenServicio["estado"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    RECEPCION: "outline",
    DIAGNOSTICO: "secondary",
    AUTORIZACION: "secondary",
    EN_REPARACION: "default",
    PRUEBAS: "default",
    LISTO: "default",
    ENTREGADO: "default",
    CANCELADO: "destructive",
  };
  
  const handleSaveReception = (values: any) => {
    console.log("Saving new reception checklist:", values);
    // Lógica para guardar la nueva recepción y la OS asociada
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recepción de Vehículos</CardTitle>
              <CardDescription>
                Listado de vehículos actualmente en el taller y su estado.
              </CardDescription>
            </div>
            <div className="flex justify-end gap-2 mb-4">
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
              <Button size="sm" className="h-7 gap-1" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Registrar Recepción
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Imagen</TableHead>
                <TableHead>Folio OS</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo (ID)</TableHead>
                <TableHead>Fecha Recepción</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptions.map((reception, index) => (
                <TableRow key={reception.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={`Vehículo ${reception.equipo_id}`}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={`/assets/vehiculo_${(index % 4) + 1}.jpg`}
                            width="64"
                        />
                    </TableCell>
                  <TableCell className="font-medium">{reception.folio}</TableCell>
                  <TableCell>{getClientName(reception.cliente_id)}</TableCell>
                  <TableCell>ID: {reception.equipo_id}</TableCell>
                  <TableCell>
                    {new Date(reception.fecha).toLocaleDateString()}
                  </TableCell>
                   <TableCell className="max-w-xs truncate">{reception.diagnostico_ini}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[reception.estado]}>
                      {reception.estado.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalles de OS</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <ReceptionChecklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReception}
        clients={clients}
        employees={employees}
      />
    </>
  );
}
