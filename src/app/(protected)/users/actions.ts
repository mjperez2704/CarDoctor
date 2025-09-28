"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import type { Rol } from '@/lib/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface UserWithRoles extends RowDataPacket {
    id: number;
    nombre: string;
    apellido_p: string | null;
    email: string;
    activo: boolean;
    roles: Rol[];
}

export async function getUsersWithRoles(): Promise<UserWithRoles[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [users] = await db.query<UserWithRoles[]>(`
            SELECT id, nombre, apellido_p, email, activo FROM usuarios ORDER BY nombre ASC
        `);
        const [roleMappings] = await db.query<RowDataPacket[]>(`
            SELECT ur.usuario_id, r.id, r.nombre, r.descripcion
            FROM usuario_roles ur
                     JOIN roles r ON ur.rol_id = r.id
        `);
        const usersMap = new Map(users.map(u => [u.id, { ...u, roles: [] as Rol[] }]));
        for (const mapping of roleMappings) {
            const user = usersMap.get(mapping.usuario_id);
            if (user) {
                user.roles.push({
                    id: mapping.id,
                    nombre: mapping.nombre,
                    descripcion: mapping.descripcion
                } as Rol);
            }
        }
        return Array.from(usersMap.values());
    } catch (error) {
        console.error("Error fetching users with roles:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const userSchema = z.object({
    id: z.string().optional(),
    nombre: z.string().min(1, "El nombre es requerido."),
    apellido_p: z.string().min(1, "El apellido es requerido."),
    email: z.string().email("El email no es válido."),
    password: z.string().optional(),
    roles: z.array(z.string()).min(1, "Debe seleccionar al menos un rol."),
});

export async function saveUser(prevState: any, formData: FormData) {
    // CORRECCIÓN: Se construye el objeto para validar de forma segura para TypeScript
    const dataToValidate = {
        id: formData.get('id') || undefined,
        nombre: formData.get('nombre'),
        apellido_p: formData.get('apellido_p'),
        email: formData.get('email'),
        password: formData.get('password') || undefined,
        roles: formData.getAll('roles'),
    };

    const validatedFields = userSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, nombre, apellido_p, email, password, roles } = validatedFields.data;

    let db;
    try {
        db = await pool.getConnection();
        await db.beginTransaction();

        let userId = id ? parseInt(id, 10) : null;

        if (userId) {
            await db.query(
                'UPDATE usuarios SET nombre = ?, apellido_p = ?, email = ? WHERE id = ?',
                [nombre, apellido_p, email, userId]
            );
        } else {
            if (!password || password.length < 8) {
                return { success: false, message: "La contraseña es requerida y debe tener al menos 8 caracteres."};
            }
            const [result] = await db.query<any>(
                'INSERT INTO usuarios (nombre, apellido_p, email, password_hash, username, activo) VALUES (?, ?, ?, ?, ?, 1)',
                [nombre, apellido_p, email, password, email]
            );
            userId = result.insertId;
        }

        await db.query('DELETE FROM usuario_roles WHERE usuario_id = ?', [userId]);
        for (const roleId of roles) {
            await db.query('INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)', [userId, roleId]);
        }

        await db.commit();
        revalidatePath('/users');
        return { success: true, message: `Usuario ${id ? 'actualizado' : 'creado'} exitosamente.` };

    } catch (error: any) {
        if (db) await db.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un usuario con ese email.' };
        }
        console.error("Error saving user:", error);
        return { success: false, message: 'Error al guardar el usuario.' };
    } finally {
        if (db) db.release();
    }
}

export async function toggleUserStatus(userId: number, currentStatus: boolean) {
    let db;
    try {
        db = await pool.getConnection();
        const newStatus = !currentStatus;
        await db.query('UPDATE usuarios SET activo = ? WHERE id = ?', [newStatus, userId]);
        revalidatePath('/users');
        return { success: true, message: `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente.` };
    } catch (error) {
        console.error('Error toggling user status:', error);
        return { success: false, message: 'Error al cambiar el estado del usuario.' };
    } finally {
        if (db) db.release();
    }
}
