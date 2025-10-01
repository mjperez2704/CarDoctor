'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Reception } from './actions';
import { ReceptionSheet } from './reception-sheet';
import { deleteReception } from './actions';

interface ReceptionManagerProps {
  initialReceptions: Reception[];
  clients: any[];
  employees: any[];
}

// Componente para renderizar la fecha de forma segura y evitar errores de hidratación.
function SafeDate({ dateString }: { dateString: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente, después del renderizado inicial.
    setIsClient(true);
  }, []);

  // Si no estamos en el cliente, no renderizamos nada. Esto asegura que el render del servidor y del cliente coincidan.
  if (!isClient) {
    return null;
  }

  // Una vez que estamos en el cliente, formateamos y mostramos la fecha.
  const date = new Date(dateString);
  const formattedDate = !isNaN(date.getTime())
    ? date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Fecha inválida';

  return <>{formattedDate}</>;
}

export function ReceptionManager({ initialReceptions, clients, employees }: ReceptionManagerProps) {
  const [receptions, setReceptions] = useState(initialReceptions);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedReception, setSelectedReception] = useState<Reception | null>(null);

  const handleAddReception = () => {
    setSelectedReception(null);
    setSheetOpen(true);
  };

  const handleEditReception = (reception: Reception) => {
    setSelectedReception(reception);
    setSheetOpen(true);
  };

  const handleDeleteReception = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta recepción?')) {
      const result = await deleteReception(id);
      if (result.success) {
        setReceptions(receptions.filter(r => r.id !== id));
      }
      alert(result.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recepciones</CardTitle>
            <CardDescription>Gestiona las recepciones de vehículos y órdenes de servicio.</CardDescription>
          </div>
          <Button onClick={handleAddReception}>Agregar Recepción</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableTableHead>
              <TableHead>Diagnóstico Inicial</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receptions.map((reception) => (
              <TableRow key={reception.id}>
                <TableCell className="font-medium">{reception.folio}</TableCell>
                <TableCell><Badge variant="outline">{reception.estado}</Badge></TableCell>
                <TableCell>
                  {/* Usando el componente SafeDate para evitar el error de hidratación */}
                  <SafeDate dateString={reception.fecha} />
                </TableCell>
                <TableCell>{reception.cliente_razon_social}</TableCell>
                <TableCell>{reception.vehiculo_descripcion}</TableCell>
                <TableCell>{reception.diagnostico_ini}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => handleEditReception(reception)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDeleteReception(reception.id)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <ReceptionSheet
        isOpen={isSheetOpen}
        setOpen={setSheetOpen}
        reception={selectedReception}
        clients={clients}
        employees={employees} 
      />
    </Card>
  );
}