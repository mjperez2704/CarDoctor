"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Empleado, Usuario } from "@/lib/types";
import type { Seller } from "@/app/(protected)/vendedores/actions";
import { Input } from "./ui/input";
import { VendedorFormModal } from "./vendedor-form-modal";
import { Badge } from "./ui/badge";

export function Vendedores({
                               initialVendedores,
                               systemUsers,
                               allEmployees
                           }: {
    initialVendedores: Seller[],
    systemUsers: Usuario[],
    allEmployees: Empleado[]
}) {
    const [vendedores, setVendedores] = React.useState(initialVendedores);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleSave = (values: any) => {
        console.log("Saving seller data:", values);
        setIsModalOpen(false);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end">
                        <Button onClick={() => setIsModalOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Configurar Vendedor
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Cuota de Venta (Mensual)</TableHead>
                                <TableHead>
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendedores.map((vendedor) => (
                                <TableRow key={vendedor.id}>
                                    <TableCell className="font-medium">{vendedor.nombre} {vendedor.apellido_p}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{vendedor.slug_vendedor || 'N/A'}</Badge>
                                    </TableCell>
                                    <TableCell>{vendedor.email || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>$</span>
                                            <Input
                                                type="number"
                                                defaultValue={vendedor.meta_venta_mensual || 0}
                                                className="w-32"
                                            />
                                        </div>
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
                                                <DropdownMenuItem>Guardar Cambios</DropdownMenuItem>
                                                <DropdownMenuItem>Ver Desempeño</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <VendedorFormModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                onSaveAction={handleSave}
                allEmployees={allEmployees}
                systemUsers={systemUsers}
            />
        </>
    );
}
