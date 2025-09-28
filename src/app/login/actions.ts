// src/app/login/actions.ts
"use server";

import { redirect } from 'next/navigation';
import pool from '@/lib/db';

// AJUSTE: Se añade 'prevState' como primer parámetro
export async function validateCredentials(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email y contraseña son requeridos.' };
    }

    let db;
    try {
        db = await pool.getConnection();

        const [rows]: any = await db.query(
            'SELECT password_hash FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return { success: false, message: 'Credenciales incorrectas.' };
        }

        const user = rows[0];

        // VALIDACIÓN DIRECTA Y SENCILLA (SIN BCRYPT)
        const isPasswordValid = (password === user.password_hash);

        if (!isPasswordValid) {
            return { success: false, message: 'Credenciales incorrectas.' };
        }

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con la base de datos.' };
    } finally {
        if (db) db.release();
    }

    // Si todo es correcto, redirige al dashboard
    redirect('/dashboard');
}
