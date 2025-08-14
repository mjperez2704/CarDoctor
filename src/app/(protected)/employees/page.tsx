import { Employees } from "@/components/employees";
import { getEmpleados } from "@/lib/data";

export default function EmployeesPage() {
  const employees = getEmpleados();
  return (
    <Employees initialEmployees={employees} />
  );
}
