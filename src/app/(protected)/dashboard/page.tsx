// src/app/(protected)/dashboard/page.tsx

import { Dashboard } from "@/components/dashboard";
// Importamos las nuevas acciones
import {
    getDashboardCardStats,
    getWorkOrdersByStatus,
    getInventoryByCategory
} from "./actions";

export default async function DashboardPage() {
    // Llamamos a las acciones para obtener los datos desde la base de datos
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
