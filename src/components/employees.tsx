"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, ListFilter, File } from "lucide-react";
import type { Employee } from "@/app/(protected)/employees/actions";
import { Badge } from "./ui/badge";
import { EmployeeFormModal } from "./employee-form-modal";
import { EmployeeStatusDialog } from "./employee-status-dialog"; // Importar diálogo de estado

export function Employees({ initialEmployees }: { initialEmployees: Employee[] }) {
    const [employees, setEmployees] = React.useState(initialEmployees);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isStatusDialogOpen, setStatusDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setEmployees(initialEmployees);
    }, [initialEmployees]);

    const handleOpenFormModal = (employee: Employee | null) => {
        setSelectedEmployee(employee);
        setFormModalOpen(true);
    };

    const handleOpenStatusDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setStatusDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span>Filtrar</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span>Exportar</span>
                        </Button>
                        <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenFormModal(null)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Agregar Empleado</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Puesto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">{employee.nombre} {employee.apellido_p}</TableCell>
                                    <TableCell>{employee.email || 'N/A'}</TableCell>
                                    <TableCell><Badge variant="outline">{employee.puesto || 'Sin Puesto'}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={employee.activo ? "default" : "destructive"}>
                                            {employee.activo ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(employee)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenStatusDialog(employee)}>
                                                    {employee.activo ? 'Desactivar' : 'Activar'}
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

            <EmployeeFormModal
                isOpen={isFormModalOpen}
                onCloseActionAction={() => setFormModalOpen(false)}
                employee={selectedEmployee}
            />

            <EmployeeStatusDialog
                isOpen={isStatusDialogOpen}
                onCloseAction={() => setStatusDialogOpen(false)}
                employee={selectedEmployee}
            />
        </>
    );
}
