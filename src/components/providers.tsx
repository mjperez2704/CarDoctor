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
import { MoreHorizontal, PlusCircle, ListFilter, File } from "lucide-react";
import type { Provider } from "@/app/(protected)/providers/actions";
import { ProviderFormModal } from "./provider-form-modal";
import { ProviderDeleteDialog } from "./provider-delete-dialog";

export function Providers({ initialProviders }: { initialProviders: Provider[] }) {
    const [providers, setProviders] = React.useState(initialProviders);
    const [isFormModalOpen, setFormModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);

    React.useEffect(() => {
        setProviders(initialProviders);
    }, [initialProviders]);

    const handleOpenFormModal = (provider: Provider | null) => {
        setSelectedProvider(provider);
        setFormModalOpen(true);
    };

    const handleOpenDeleteDialog = (provider: Provider) => {
        setSelectedProvider(provider);
        setDeleteModalOpen(true);
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
                            <span>Agregar Proveedor</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Razón Social</TableHead>
                                <TableHead>RFC</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Días de Crédito</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providers.map((provider) => (
                                <TableRow key={provider.id}>
                                    <TableCell className="font-medium">{provider.razon_social}</TableCell>
                                    <TableCell>{provider.rfc || 'N/A'}</TableCell>
                                    <TableCell>{provider.telefono || 'N/A'}</TableCell>
                                    <TableCell>{provider.email || 'N/A'}</TableCell>
                                    <TableCell>{provider.dias_credito ?? 'N/A'}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleOpenFormModal(provider)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenDeleteDialog(provider)}>
                                                    Eliminar
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

            <ProviderFormModal
                isOpen={isFormModalOpen}
                onCloseActionAction={() => setFormModalOpen(false)}
                provider={selectedProvider}
            />

            <ProviderDeleteDialog
                isOpen={isDeleteModalOpen}
                onCloseAction={() => setDeleteModalOpen(false)}
                provider={selectedProvider}
            />
        </>
    );
}
