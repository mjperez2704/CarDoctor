// src/app/(protected)/catalogs/brands/actions.ts
"use server";

import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Version extends RowDataPacket {
    id: number;
    nombre: string;
}
export interface Model extends RowDataPacket {
    id: number;
    nombre: string;
    anio: number | null;
    versiones: Version[];
}
export interface BrandWithDetails extends RowDataPacket {
    id: number;
    nombre: string;
    pais_origen: string | null;
    tipo_marca: 'AUTOS' | 'REFACCIONES' | 'AMBOS';
    modelos: Model[];
}

export async function getBrandsWithDetails(): Promise<BrandWithDetails[]> {
    let db;
    try {
        db = await pool.getConnection();

        const [brands] = await db.query<BrandWithDetails[]>(`
            SELECT id, nombre, pais_origen, tipo_marca FROM marcas ORDER BY nombre ASC
        `);
        const [models] = await db.query<(Model & { marca_id: number })[]>(`
            SELECT id, nombre, anio, marca_id FROM modelos
        `);
        const [versions] = await db.query<(Version & { modelo_id: number })[]>(`
            SELECT id, nombre, modelo_id FROM versiones
        `);

        const modelsMap = new Map(models.map(m => [m.id, { ...m, versiones: [] as Version[] }]));
        for (const version of versions) {
            const model = modelsMap.get(version.modelo_id);
            if (model) {
                model.versiones.push(version);
            }
        }
        const brandsMap = new Map(brands.map(b => [b.id, { ...b, modelos: [] as Model[] }]));
        for (const model of modelsMap.values()) {
            const brand = brandsMap.get(model.marca_id);
            if (brand) {
                brand.modelos.push(model);
            }
        }
        return Array.from(brandsMap.values());
    } catch (error) {
        console.error("Error fetching brands with details:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}

const versionSchema = z.object({
    nombre: z.string().min(1, "El nombre de la versión es requerido."),
    modelo_id: z.coerce.number().min(1, "El ID del modelo es inválido."),
});

export async function createVersion(prevState: any, formData: FormData) {
    const validatedFields = versionSchema.safeParse({
        nombre: formData.get('nombre'),
        modelo_id: formData.get('modelo_id'),
    });
    if (!validatedFields.success) {
        return { success: false, message: "Datos inválidos." };
    }
    const { nombre, modelo_id } = validatedFields.data;
    let db;
    try {
        db = await pool.getConnection();
        await db.query(
            `INSERT INTO versiones (nombre, modelo_id) VALUES (?, ?)`,
            [nombre, modelo_id]
        );
        revalidatePath('/catalogs/brands');
        return { success: true, message: 'Versión agregada exitosamente.' };
    } catch (error) {
        console.error('Error creating version:', error);
        return { success: false, message: 'Error al guardar la versión en la base de datos.' };
    } finally {
        if (db) db.release();
    }
}
