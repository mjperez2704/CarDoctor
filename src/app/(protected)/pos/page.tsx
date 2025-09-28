import { getSucursales } from "./actions";
import { POSLauncher } from "./_components/pos-launcher";
import { getClientes } from "@/lib/data";

export default async function POSPage() {
    // Obtenemos los datos necesarios en el servidor
    const sucursales = await getSucursales();
    const clientes = await getClientes();

    // El cliente "Cliente Final" o "Público General" debería tener ID 1
    const defaultClient = clientes.find(c => c.id === 1) || clientes[0];

    return (
        <POSLauncher
            sucursales={sucursales}
            clientes={clientes}
            defaultClient={defaultClient}
        />
    );
}
