
import { ServicesList } from "@/components/services-list";
import { getProductos } from "@/lib/data";

export default function ServicesPage() {
  const allProducts = getProductos();
  const services = allProducts.filter(p => p.tipo === "Servicio");

  return (
    <ServicesList initialServices={services} />
  );
}
