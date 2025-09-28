// activador.js
// MEGA-BOT Feature Activation Script

const fs = require('fs');
const path = require('path');

console.log('\x1b[35m--- Iniciando el script de activación de funcionalidades de MEGA-BOT ---\x1b[0m');

// --- CONFIGURACIÓN DE MÓDULOS A ACTIVAR ---

const modulesToActivate = [
    {
        // --- PROVEEDORES ---
        name: 'Provider',
        plural: 'providers',
        parentComponentPath: 'src/components/providers.tsx',
        actionsPath: 'src/app/(protected)/providers/actions.ts',
        modalPath: 'src/components/provider-form-modal.tsx',
        zodSchema: `
const providerSchema = z.object({
  razon_social: z.string().min(3, "La razón social es requerida."),
  rfc: z.string().optional(),
  email: z.string().email("El email no es válido.").optional().or(z.literal('')),
  telefono: z.string().optional(),
  dias_credito: z.coerce.number().int().min(0).default(0),
});`,
        actionFunction: `
export async function createProvider(prevState: any, formData: FormData) {
    const validatedFields = providerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }
    const { razon_social, rfc, email, telefono, dias_credito } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        await db.query(
            'INSERT INTO proveedores (razon_social, rfc, email, telefono, dias_credito) VALUES (?, ?, ?, ?, ?)',
            [razon_social, rfc || null, email || null, telefono || null, dias_credito]
        );
        revalidatePath('/providers');
        return { success: true, message: 'Proveedor creado exitosamente.' };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un proveedor con ese RFC.' };
        }
        return { success: false, message: 'Error al guardar el proveedor.' };
    } finally {
        if (db) db.release();
    }
}`,
        modalFormFields: `
          <div className="space-y-2">
            <Label htmlFor="razon_social">Razón Social</Label>
            <Input id="razon_social" name="razon_social" placeholder="Nombre comercial del proveedor" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rfc">RFC</Label>
            <Input id="rfc" name="rfc" placeholder="Registro Federal de Contribuyentes" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="contacto@proveedor.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" placeholder="Ej. 55-1234-5678" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dias_credito">Días de Crédito</Label>
            <Input id="dias_credito" name="dias_credito" type="number" defaultValue={0} />
          </div>
        `
    },
    {
        // --- EMPLEADOS ---
        name: 'Employee',
        plural: 'employees',
        parentComponentPath: 'src/components/employees.tsx',
        actionsPath: 'src/app/(protected)/employees/actions.ts',
        modalPath: 'src/components/employee-form-modal.tsx',
        zodSchema: `
const employeeSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido."),
  apellido_p: z.string().min(2, "El apellido es requerido."),
  email: z.string().email("El email no es válido.").optional().or(z.literal('')),
  puesto: z.string().optional(),
});`,
        actionFunction: `
export async function createEmployee(prevState: any, formData: FormData) {
    const validatedFields = employeeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos." };
    }
    const { nombre, apellido_p, email, puesto } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        await db.query(
            'INSERT INTO empleados (nombre, apellido_p, email, puesto, activo) VALUES (?, ?, ?, ?, 1)',
            [nombre, apellido_p, email || null, puesto || null]
        );
        revalidatePath('/employees');
        return { success: true, message: 'Empleado creado exitosamente.' };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un empleado con ese email.' };
        }
        return { success: false, message: 'Error al guardar el empleado.' };
    } finally {
        if (db) db.release();
    }
}`,
        modalFormFields: `
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="nombre">Nombre(s)</Label>
                <Input id="nombre" name="nombre" placeholder="Juan" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="apellido_p">Apellido(s)</Label>
                <Input id="apellido_p" name="apellido_p" placeholder="Pérez" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="juan.perez@taller.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="puesto">Puesto</Label>
            <Input id="puesto" name="puesto" placeholder="Mecánico B" />
          </div>
        `
    }
];

// --- TEMPLATES ---

const getModalTemplate = (config) => `
"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { create${config.name} } from "@/app/(protected)/${config.plural}/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
        </Button>
    );
}

type ${config.name}FormModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export function ${config.name}FormModal({ isOpen, onCloseAction }: ${config.name}FormModalProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(create${config.name}, undefined);

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

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo ${config.name === 'Provider' ? 'Proveedor' : 'Empleado'}</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo ${config.name === 'Provider' ? 'proveedor' : 'empleado'}.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 py-2">
          ${config.modalFormFields}
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onCloseAction}>Cancelar</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}`;

// --- SCRIPT ENGINE ---

function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`\x1b[32mÉXITO: Archivo creado/actualizado en ${filePath}\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31mERROR: No se pudo escribir el archivo ${filePath}: ${error.message}\x1b[0m`);
    }
}

function appendToFile(filePath, contentToAppend, marker) {
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent.includes(marker)) {
            console.log(`\x1b[36mINFO: El contenido ya existe en ${filePath}, se omite la adición.\x1b[0m`);
            return;
        }
        const finalContent = `${fileContent}\n${marker}\n${contentToAppend}`;
        writeFile(filePath, finalContent);
    } catch (error) {
        console.error(`\x1b[31mERROR: No se pudo modificar el archivo ${filePath}: ${error.message}\x1b[0m`);
    }
}

function modifyParentComponent(filePath, modalName, modalPath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Añadir import del modal si no existe
        const importStatement = `import { ${modalName} } from "./${modalName.replace('.tsx','').toLowerCase()}";`;
        if (!content.includes(importStatement)) {
            content = `import * as React from "react";\n${importStatement}\n${content.substring(content.indexOf('"use client";'))}`;
        }

        // 2. Añadir el estado para el modal si no existe
        const stateHook = 'const [isModalOpen, setIsModalOpen] = React.useState(false);';
        if (!content.includes(stateHook)) {
            content = content.replace(/(export function\s+\w+\({[^}]+}\) {\s*)/, `$1\n  ${stateHook}`);
        }

        // 3. Modificar el botón para que abra el modal
        content = content.replace(
            /(<Button>[\s\S]*?<\/Button>)/,
            (match) => {
                if(match.includes('onClick')) return match; // Si ya tiene onClick, no lo modificamos
                return match.replace('<Button>', '<Button onClick={() => setIsModalOpen(true)}>');
            }
        );

        // 4. Añadir el componente del modal al final del render
        const modalComponent = `<${modalName} isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />`;
        if (!content.includes(modalComponent)) {
            content = content.replace(/(<\/Card>\s*)/, `$1\n      ${modalComponent}\n    </>`);
            // Asegurar que el componente principal esté envuelto en un fragmento <> </> si no lo está
            if(!content.match(/return\s*\(/) && !content.match(/return\s*<>/)){
                content = content.replace(/(return\s*\()(\s*<Card>)/, '$1<>$2');
                content = content.replace(/(<\/Card>\s*\);)/, '$1</>; )');
            }
        }

        writeFile(filePath, content);

    } catch (error) {
        console.error(`\x1b[31mERROR: No se pudo modificar el componente padre ${filePath}: ${error.message}\x1b[0m`);
    }
}


modulesToActivate.forEach(config => {
    console.log(`\n\x1b[34m--- Activando Módulo: ${config.name} ---\x1b[0m`);
    const modalName = `${config.name}FormModal`;
    const actionsFilePath = path.join(__dirname, config.actionsPath);
    const modalFilePath = path.join(__dirname, config.modalPath);
    const parentComponentFilePath = path.join(__dirname, config.parentComponentPath);

    // Paso 1: Crear o actualizar el archivo de acciones
    appendToFile(actionsFilePath, `${config.zodSchema}\n${config.actionFunction}`, `// --- MEGA-BOT: ACCIONES PARA ${config.name.toUpperCase()} ---`);

    // Paso 2: Crear el archivo del modal
    const modalContent = getModalTemplate(config);
    writeFile(modalFilePath, modalContent);

    // Paso 3: Modificar el componente padre para usar el modal
    modifyParentComponent(parentComponentFilePath, modalName, config.modalPath);
});

console.log('\x1b[35m\n--- Proceso de activación finalizado. --- \x1b[0m');
console.log('\x1b[32m¡Listo! Los módulos han sido activados. Por favor, reinicia tu servidor de desarrollo para ver los cambios.\x1b[0m');
