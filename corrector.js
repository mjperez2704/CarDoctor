// corrector.js
// MEGA-BOT Automated Project Corrector Script

const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN DE CORRECCIONES ---

const corrections = [
    // 1. Renombrar useFormState a useActionState y cambiar la importación
    {
        files: [
            'src/components/reception-checklist-modal.tsx',
            'src/components/work-order-form-modal.tsx',
            'src/components/quote-form-modal.tsx',
            'src/app/(protected)/customers/vehicle-form-modal.tsx',
            'src/components/version-form-modal.tsx',
            'src/app/login/page.tsx',
        ],
        find: /import { useFormState.* } from "react-dom";/g,
        replace: `import { useActionState, useFormStatus } from "react";`,
    },
    {
        files: [
            'src/components/reception-checklist-modal.tsx',
            'src/components/work-order-form-modal.tsx',
            'src/components/quote-form-modal.tsx',
            'src/app/(protected)/customers/vehicle-form-modal.tsx',
            'src/components/version-form-modal.tsx',
            'src/app/login/page.tsx',
        ],
        find: /useFormState/g,
        replace: `useActionState`,
    },
    // 2. Corregir error .toFixed() convirtiendo valores de la BD a Número
    {
        file: 'src/components/product-catalog.tsx',
        find: [
            /\${item\.precio_lista\.toFixed\(2\)}/g,
            /\${item\.costo_promedio\.toFixed\(4\)}/g
        ],
        replace: [
            '${Number(item.precio_lista).toFixed(2)}',
            '${Number(item.costo_promedio).toFixed(4)}'
        ]
    },
    {
        file: 'src/components/product-detail-modal.tsx',
        find: [
            /\${Number\(item\.precio_lista\.toFixed\(2\)\)}/g, // Corregir el anidado incorrecto
            /\${Number\(item\.costo_promedio\.toFixed\(4\)\)}/g,
            /type ProductDetailModalProps = {\s*isOpen: boolean;\s*onCloseAction: \(\) => void;\s*item: Producto;/
        ],
        replace: [
            '${Number(item.precio_lista).toFixed(2)}',
            '${Number(item.costo_promedio).toFixed(4)}',
            'type ProductDetailModalProps = {\n  isOpen: boolean;\n  onCloseAction: () => void;\n  item: ProductWithStock;'
        ]
    },
    {
        file: 'src/components/quotes.tsx',
        find: /\${quote\.total\.toFixed\(2\)}/g,
        replace: '${Number(quote.total).toFixed(2)}'
    },
    {
        file: 'src/components/purchases.tsx',
        find: /\${purchase\.total\.toFixed\(2\)}/g,
        replace: '${Number(purchase.total).toFixed(2)}'
    },
    {
        file: 'src/components/expenses-manager.tsx',
        find: /\${gasto\.monto\.toFixed\(2\)}/g,
        replace: '${Number(gasto.monto).toFixed(2)}'
    },
    // 3. Corregir incompatibilidad con JSON_ARRAYAGG en BBDD antiguas
    {
        file: 'src/app/(protected)/users/actions.ts',
        find: /export async function getUsersWithRoles\(\): Promise<UserWithRoles\[]> {[\s\S]*?return Array\.from\(usersMap\.values\(\)\);[\s\S]*?}/,
        replace: `export async function getUsersWithRoles(): Promise<UserWithRoles[]> {
    let db;
    try {
        db = await pool.getConnection();
        const [users] = await db.query<UserWithRoles[]}(\`
            SELECT id, nombre, apellido_p, email, activo FROM usuarios ORDER BY nombre ASC
        \`);
        const [roleMappings] = await db.query<RowDataPacket[]}(\`
            SELECT ur.usuario_id, r.id, r.nombre 
            FROM usuario_roles ur 
            JOIN roles r ON ur.rol_id = r.id
        \`);
        const usersMap = new Map(users.map(u => [u.id, { ...u, roles: [] as Rol[] }]));
        for (const mapping of roleMappings) {
            const user = usersMap.get(mapping.usuario_id);
            if (user) {
                user.roles.push({
                    id: mapping.id,
                    nombre: mapping.nombre
                });
            }
        }
        return Array.from(usersMap.values());
    } catch (error) {
        console.error("Error fetching users with roles:", error);
        return [];
    } finally {
        if (db) db.release();
    }
}`
    },
    {
        file: 'src/app/(protected)/catalogs/brands/actions.ts',
        find: /export async function getBrandsWithDetails\(\): Promise<BrandWithDetails\[]> {[\s\S]*?return Array\.from\(brandsMap\.values\(\)\);[\s\S]*?}/,
        replace: `export async function getBrandsWithDetails(): Promise<BrandWithDetails[]> {
    let db;
    try {
        db = await pool.getConnection();
        
        const [brands] = await db.query<BrandWithDetails[]}(\`
            SELECT id, nombre, pais_origen, tipo_marca FROM marcas ORDER BY nombre ASC
        \`);
        const [models] = await db.query<(Model & { marca_id: number })[]}(\`
            SELECT id, nombre, anio, marca_id FROM modelos
        \`);
        const [versions] = await db.query<(Version & { modelo_id: number })[]}(\`
            SELECT id, nombre, modelo_id FROM versiones
        \`);

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
}`
    },
    // 4. Corregir constraint de RowDataPacket
    {
        file: 'src/app/(protected)/catalogs/brands/actions.ts',
        find: [
            /export interface Version {/g,
            /export interface Model {/g
        ],
        replace: [
            'export interface Version extends RowDataPacket {',
            'export interface Model extends RowDataPacket {'
        ]
    }
];

// --- MOTOR DEL SCRIPT ---

function applyCorrections(correction) {
    const files = correction.files || [correction.file];
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`\x1b[33mAVISO: El archivo no existe, omitiendo: ${file}\x1b[0m`);
            return;
        }

        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;

            const findPatterns = Array.isArray(correction.find) ? correction.find : [correction.find];
            const replacePatterns = Array.isArray(correction.replace) ? correction.replace : [correction.replace];

            findPatterns.forEach((pattern, index) => {
                const replacement = replacePatterns[index] || replacePatterns[0];
                if (content.match(pattern)) {
                    content = content.replace(pattern, replacement);
                    changed = true;
                }
            });

            if (changed) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`\x1b[32mÉXITO: Se aplicaron correcciones en ${file}\x1b[0m`);
            } else {
                console.log(`\x1b[36mINFO: No se necesitaron cambios en ${file}\x1b[0m`);
            }
        } catch (error) {
            console.error(`\x1b[31mERROR: Falló al procesar el archivo ${file}: ${error.message}\x1b[0m`);
        }
    });
}

function main() {
    console.log('\x1b[35m--- Iniciando el script de corrección automática de MEGA-BOT ---\x1b[0m');
    corrections.forEach(applyCorrections);
    console.log('\x1b[35m--- Proceso de corrección finalizado. --- \x1b[0m');
    console.log('\x1b[32m\n¡Listo! Todos los archivos han sido actualizados. Puedes iniciar tu servidor de desarrollo.\x1b[0m');
}

main();
