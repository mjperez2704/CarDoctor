"use client";

import * as React from "react";
import type { Expense } from "@/app/(protected)/finances/expenses/actions";
import type { Empleado } from "@/lib/types";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, ListFilter, File, Eye } from "lucide-react";
import { ExpensesFilterDialog, type ExpensesFilterValues } from "./expenses-filter-dialog";
import { ExpenseFormDialog } from "./expense-form-dialog"; // Import the new dialog

type ExpensesManagerProps = {
    initialExpenses: Expense[];
    employees: Empleado[];
};

export function ExpensesManager({ initialExpenses, employees }: ExpensesManagerProps) {
    const [filteredExpenses, setFilteredExpenses] = React.useState(initialExpenses);
    const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(false);
    const [isFormDialogOpen, setFormDialogOpen] = React.useState(false); // State for the form dialog
    const [rowsToShow, setRowsToShow] = React.useState(10);

    const handleApplyFilters = (filters: ExpensesFilterValues) => {
        let filtered = [...initialExpenses];
        if (filters.dateRange?.from) {
            filtered = filtered.filter(expense => new Date(expense.fecha) >= filters.dateRange!.from!);
        }
        if (filters.dateRange?.to) {
            filtered = filtered.filter(expense => new Date(expense.fecha) <= filters.dateRange!.to!);
        }
        if (filters.category && filters.category !== "all") {
            filtered = filtered.filter(expense => expense.categoria === filters.category);
        }
        if (filters.employeeId && filters.employeeId !== "all") {
            filtered = filtered.filter(expense => String(expense.empleado_id) === filters.employeeId);
        }
        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter(expense => expense.estado === filters.status);
        }
        setFilteredExpenses(filtered);
    };

    const statusVariant: Record<Expense["estado"], "default" | "secondary" | "destructive" | "outline"> = {
        APROBADO: "default",
        PENDIENTE: "secondary",
        RECHAZADO: "destructive",
    };

    const paginatedExpenses = filteredExpenses.slice(0, rowsToShow);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" className="h-9 gap-1" onClick={() => setFilterDialogOpen(true)}>
                            <ListFilter className="h-4 w-4" />
                            Filtrar
                        </Button>
                        <Button variant="outline" className="h-9 gap-1">
                            <File className="h-4 w-4" />
                            Exportar
                        </Button>
                        <Button className="h-9 gap-1" onClick={() => setFormDialogOpen(true)}>
                            <PlusCircle className="h-4 w-4" />
                            Registrar Gasto
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <Select value={String(rowsToShow)} onValueChange={(value) => setRowsToShow(Number(value))}>
                            <SelectTrigger className="w-20 h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">registros.</span>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Realizado por</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                                <TableHead>
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedExpenses.map((gasto) => (
                                <TableRow key={gasto.id}>
                                    <TableCell>{new Date(gasto.fecha + 'T00:00:00').toLocaleDateString('es-MX', { timeZone: 'UTC' })}</TableCell>
                                    <TableCell><Badge variant="outline">{gasto.categoria}</Badge></TableCell>
                                    <TableCell className="max-w-xs truncate">{gasto.descripcion}</TableCell>
                                    <TableCell>{gasto.empleado_nombre}</TableCell>
                                    <TableCell><Badge variant={statusVariant[gasto.estado]}>{gasto.estado}</Badge></TableCell>
                                    <TableCell className="text-right font-medium">${Number(gasto.monto.toFixed(2))}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/>Ver Detalles</DropdownMenuItem>
                                                {gasto.estado === 'PENDIENTE' && <DropdownMenuItem>Aprobar/Rechazar</DropdownMenuItem>}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {paginatedExpenses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No se encontraron gastos con los filtros actuales.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ExpensesFilterDialog
                isOpen={isFilterDialogOpen}
                onCloseAction={() => setFilterDialogOpen(false)}
                onApplyAction={handleApplyFilters}
                onClearAction={() => setFilteredExpenses(initialExpenses)}
                employees={employees}
                allCategories={[...new Set(initialExpenses.map(e => e.categoria))]}
            />

            <ExpenseFormDialog 
                isOpen={isFormDialogOpen} 
                onClose={() => setFormDialogOpen(false)} 
                employees={employees} 
            />
        </>
    );
}
