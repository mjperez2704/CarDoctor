"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import type { Rol } from "@/lib/types";
import { saveUser } from "@/app/(protected)/users/actions";
import type { UserWithRoles } from "@/app/(protected)/users/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Guardar Usuario'}
        </Button>
    );
}

type UserFormModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    roles: Rol[];
    user?: UserWithRoles | null;
};

export function UserFormModal({ isOpen, onCloseAction, roles, user }: UserFormModalProps) {
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(saveUser, undefined);
    const isEditing = !!user;

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Éxito" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) onCloseAction();
        }
    }, [state, toast, onCloseAction]);

    useEffect(() => {
        if (!isOpen) formRef.current?.reset();
    }, [isOpen]);

    const defaultRoleIds = user?.roles.map(r => String(r.id)) || [];

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Modifica los datos de ${user.nombre}` : "Complete los campos para registrar un nuevo usuario."}
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-2">
                    {isEditing && <input type="hidden" name="id" value={user.id} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nombre">Nombre(s)</Label>
                            <Input id="nombre" name="nombre" placeholder="Ej. Juan" required defaultValue={user?.nombre ?? ''} />
                        </div>
                        <div>
                            <Label htmlFor="apellido_p">Apellido(s)</Label>
                            <Input id="apellido_p" name="apellido_p" placeholder="Ej. Pérez" required defaultValue={user?.apellido_p ?? ''} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="usuario@ejemplo.com" required defaultValue={user?.email ?? ''} />
                    </div>
                    {!isEditing && (
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    )}
                    <div>
                        <Label>Roles</Label>
                        <ScrollArea className="h-32 w-full rounded-md border p-4 mt-2">
                            {roles.map((rol) => (
                                <div key={rol.id} className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id={`role-${rol.id}`}
                                        name="roles"
                                        value={String(rol.id)}
                                        defaultChecked={defaultRoleIds.includes(String(rol.id))}
                                    />
                                    <Label htmlFor={`role-${rol.id}`} className="font-normal">{rol.nombre}</Label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
                        <SubmitButton isEditing={isEditing}/>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
