// src/app/(protected)/customers/page.tsx
import { getCustomersWithVehicleCount } from './actions';
import { CustomerModals } from './customer-modals';
import { CustomerList } from './customer-list';
import { PageHeader } from '@/components/page-header'; // Importar el nuevo componente

export default async function CustomersPage() {
    const customers = await getCustomersWithVehicleCount();

    return (
        <>
            {/* Añadir el PageHeader */}
            <PageHeader
                title="Clientes"
                description="Administra la información de los clientes y sus vehículos."
            />
            <CustomerList initialCustomers={customers} />
            <CustomerModals />
        </>
    );
}
