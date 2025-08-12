import { AppLayout } from "@/components/layout";
import { Employees } from "@/components/employees";
import { getEmployees } from "@/lib/data";

export default function EmployeesPage() {
  const employees = getEmployees();
  return (
    <AppLayout title="Empleados">
      <Employees initialEmployees={employees} />
    </AppLayout>
  );
}
