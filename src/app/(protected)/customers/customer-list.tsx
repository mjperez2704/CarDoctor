// src/app/(protected)/customers/customer-list.tsx
"use client";
// ... (imports sin cambios)
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Car, ListFilter, File } from "lucide-react";
import type { CustomerWithVehicleCount } from './actions';
import { useCustomerModal } from './customer-modals';

export function CustomerList({ initialCustomers }: { initialCustomers: CustomerWithVehicleCount[] }) {
    const [customers, setCustomers] = React.useState(initialCustomers);
    const { onOpen } = useCustomerModal();

    React.useEffect(() => {
        setCustomers(initialCustomers);
    }, [initialCustomers]);

    return (
        <Card>
            <CardHeader>
                {/* ... (botones sin cambios) ... */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1"><ListFilter className="h-3.5 w-3.5" /><span>Filtrar</span></Button>
                    <Button size="sm" variant="outline" className="h-7 gap-1"><File className="h-3.5 w-3.5" /><span>Exportar</span></Button>
                    <Button size="sm" className="h-7 gap-1" onClick={() => onOpen('addCustomer')}><PlusCircle className="h-3.5 w-3.5" /><span>Agregar Cliente</span></Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    {/* ... (TableHeader sin cambios) ... */}
                    <TableHeader><TableRow><TableHead>Nombre / Razón Social</TableHead><TableHead>Email</TableHead><TableHead>Teléfono</TableHead><TableHead className="text-center">Vehículos</TableHead><TableHead><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                {/* ... (TableCells sin cambios) ... */}
                                <TableCell className="font-medium">{customer.razon_social}</TableCell>
                                <TableCell>{customer.email || 'N/A'}</TableCell>
                                <TableCell>{customer.telefono || 'N/A'}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="outline" size="sm" onClick={() => onOpen('viewVehicles', { customer })}>
                                        <Car className="mr-2 h-4 w-4" />
                                        {customer.vehicle_count}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            {/* SE AÑADE EL onSelect PARA ABRIR EL MODAL DE EDICIÓN */}
                                            <DropdownMenuItem onSelect={() => onOpen('editCustomer', { customer })}>
                                                Editar Cliente
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onOpen('viewVehicles', { customer })}>Ver Vehículos</DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onSelect={() => onOpen('deleteCustomer', { customer })}
                                            >
                                                Eliminar Cliente
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
