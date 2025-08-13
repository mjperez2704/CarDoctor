import { AppLayout } from "@/components/layout";
import { Employees } from "@/components/employees";
import { getEmpleados } from "@/lib/mock-data";

export default function EmployeesPage() {
  const employees = getEmpleados();
  return (
    <AppLayout title="Empleados">
      <Employees initialEmployees={employees} />
    </AppLayout>
  );
}
