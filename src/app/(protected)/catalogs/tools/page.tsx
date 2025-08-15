import { ToolsManager } from "@/components/tools-manager";
import { getHerramientas, getEmpleados } from "@/lib/data";

export default function ToolsCatalogPage() {
  const tools = getHerramientas();
  const employees = getEmpleados();

  return (
    <ToolsManager initialTools={tools} employees={employees} />
  );
}
