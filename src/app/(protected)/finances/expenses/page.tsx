import { ExpensesManager } from "@/components/expenses-manager";
import { getGastos, getEmpleados } from "@/lib/data";

export default function ExpensesPage() {
  const expenses = getGastos();
  const employees = getEmpleados();

  return <ExpensesManager initialExpenses={expenses} employees={employees} />;
}
