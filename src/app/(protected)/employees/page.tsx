// src/app/(protected)/employees/page.tsx
import { Employees } from "@/components/employees";
import { getEmployees } from "./actions";
import { PageHeader } from "@/components/page-header";

export default async function EmployeesPage() {
    const employees = await getEmployees();
    return (
        <>
            <PageHeader
                title="Empleados"
                description="Administra los empleados y sus roles en el sistema."
            />
            <Employees initialEmployees={employees} />
        </>
    );
}
