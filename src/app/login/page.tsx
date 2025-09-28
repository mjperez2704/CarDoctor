// src/app/login/page.tsx
"use client";

// Se regresa a 'useActionState' de 'react-dom'
import React, { useActionState } from "react";
import { useFormStatus } from 'react-dom';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wrench } from "lucide-react";
import { validateCredentials } from './actions';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
        </Button>
    );
}

export default function LoginPage() {
    const { toast } = useToast();
    // Se regresa a 'useActionState'
    const [state, formAction] = useActionState(validateCredentials, undefined);

    useEffect(() => {
        if (state?.message) {
            toast({
                variant: "destructive",
                title: "Error de autenticación",
                description: state.message,
            });
        }
    }, [state, toast]);


    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-sm">
                <form action={formAction}>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Wrench className="h-16 w-16 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Mi Taller Mecánico</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales para acceder al sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                required
                                defaultValue="admin@taller.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                defaultValue="password123"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <LoginButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
