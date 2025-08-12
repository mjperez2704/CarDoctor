import { AppLayout } from "@/components/layout";
import { Employees } from "@/components/employees";

export default function EmployeesPage() {
  return (
    <AppLayout title="Empleados">
      <Employees />
    </AppLayout>
  );
}