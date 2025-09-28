// src/app/(protected)/finances/expenses/page.tsx
import { ExpensesManager } from "@/components/expenses-manager";
import { getEmpleados, getExpenses } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function ExpensesPage() {
    const expenses = await getExpenses();
    const employees = await getEmpleados();

    return (
        <>
            <PageHeader
                title="Gestión de Gastos"
                description="Administra los gastos registrados en el sistema."
            />
            <ExpensesManager initialExpenses={expenses} employees={employees} />
        </>
    );
}
