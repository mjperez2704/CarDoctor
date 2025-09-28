"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, UserX, UserCheck, ListFilter, File } from "lucide-react";
import type { Rol } from "@/lib/types";
import type { UserWithRoles } from "@/app/(protected)/users/actions";
import { Badge } from "./ui/badge";
import { UserFormModal } from "./user-form-modal";
import { UserStatusDialog } from "./user-status-dialog"; // Importar

export function Users({ initialUsers, availableRoles }: { initialUsers: UserWithRoles[], availableRoles: Rol[] }) {
    const [users, setUsers] = React.useState(initialUsers);
    const [selectedUser, setSelectedUser] = React.useState<UserWithRoles | null>(null);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isStatusDialogOpen, setStatusDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleOpenFormModal = (user: UserWithRoles | null) => {
        setSelectedUser(user);
        setFormModalOpen(true);
    };

    const handleOpenStatusDialog = (user: UserWithRoles) => {
        setSelectedUser(user);
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
                            <span>Agregar Usuario</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.nombre} {user.apellido_p}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map(role => (
                                                <Badge key={role.id} variant="secondary">{role.nombre}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.activo ? "default" : "destructive"}>
                                            {user.activo ? "Activo" : "Inactivo"}
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
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(user)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenStatusDialog(user)}>
                                                    {user.activo ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                                    {user.activo ? 'Desactivar' : 'Activar'}
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

            <UserFormModal
                isOpen={isFormModalOpen}
                onCloseActionAction={() => setFormModalOpen(false)}
                roles={availableRoles}
                user={selectedUser}
            />

            <UserStatusDialog
                isOpen={isStatusDialogOpen}
                onCloseAction={() => setStatusDialogOpen(false)}
                user={selectedUser}
            />
        </>
    );
}
