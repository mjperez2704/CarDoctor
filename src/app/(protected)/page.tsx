// src/app/(protected)/page.tsx
import { Dashboard } from "@/components/dashboard";
// SOLUCIÓN: Importamos las acciones del dashboard
import {
    getDashboardCardStats,
    getWorkOrdersByStatus,
    getInventoryByCategory
} from "./dashboard/actions"; // Asegúrate que la ruta sea correcta

export default async function HomePage() {
    // SOLUCIÓN: Obtenemos los datos reales para el dashboard
    const cardStats = await getDashboardCardStats();
    const workOrdersByStatus = await getWorkOrdersByStatus();
    const inventoryByCategory = await getInventoryByCategory();

    return (
        <Dashboard
            cardStats={cardStats}
            workOrdersByStatus={workOrdersByStatus}
            inventoryByCategory={inventoryByCategory}
        />
    );
}
