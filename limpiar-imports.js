// limpiar-imports.js
// MEGA-BOT Import Cleanup Script

const fs = require('fs');
const path = require('path');

console.log('\x1b[35m--- Iniciando el script de limpieza de imports de MEGA-BOT ---\x1b[0m');

const filesToProcess = [
    'src/components/quote-form-modal.tsx',
    'src/components/reception-checklist-modal.tsx',
    'src/components/work-order-form-modal.tsx',
    'src/app/(protected)/customers/vehicle-form-modal.tsx',
    'src/components/version-form-modal.tsx',
    'src/app/login/page.tsx',
    'src/components/provider-form-modal.tsx',
    'src/components/employee-form-modal.tsx',
];

filesToProcess.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`\x1b[33mAVISO: El archivo no existe, omitiendo: ${file}\x1b[0m`);
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // 1. Eliminar cualquier importación obsoleta de 'react-dom' que contenga useFormState
        const oldImportRegex = /import.*useFormState.*from "react-dom";\r?\n/g;
        if (oldImportRegex.test(content)) {
            content = content.replace(oldImportRegex, '');
            changed = true;
        }

        // 2. Buscar la importación principal de React
        const reactImportRegex = /import React,?\s*{(.*)}\s*from "react";/;
        const match = content.match(reactImportRegex);

        if (match) {
            // Si existe una importación de React, nos aseguramos de que contenga 'useActionState'
            let hooks = match[1].split(',').map(h => h.trim()).filter(Boolean);
            if (!hooks.includes('useActionState')) {
                hooks.push('useActionState');

                // Reconstruir la línea de importación
                const newImport = `import React, { ${hooks.join(', ')} } from "react";`;
                content = content.replace(reactImportRegex, newImport);
                changed = true;
            }
        } else {
            // Si no hay una importación de React con hooks, buscamos una simple y la modificamos
            const simpleReactImport = /import React from "react";/;
            if(simpleReactImport.test(content)) {
                content = content.replace(simpleReactImport, 'import React, { useActionState, useEffect, useRef, useState } from "react";');
                changed = true;
            }
        }

        // 3. Reemplazar cualquier uso de useFormState por useActionState (por si quedó alguno)
        if (content.includes('useFormState')) {
            content = content.replace(/useFormState/g, 'useActionState');
            changed = true;
        }


        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`\x1b[32mÉXITO: Se limpiaron las importaciones en ${file}\x1b[0m`);
        } else {
            console.log(`\x1b[36mINFO: No se necesitaron cambios en ${file}\x1b[0m`);
        }

    } catch (error) {
        console.error(`\x1b[31mERROR: Falló al procesar el archivo ${file}: ${error.message}\x1b[0m`);
    }
});

console.log('\x1b[35m\n--- Proceso de limpieza finalizado. --- \x1b[0m');
console.log('\x1b[32m¡Listo! Todos los archivos han sido estandarizados. El error de compilación debería desaparecer.\x1b[0m');
