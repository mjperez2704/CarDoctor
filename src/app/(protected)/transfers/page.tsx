import { TransferForm } from "@/components/transfer-form";
import { getAlmacenes, getProductos } from "@/lib/data";

export default function TransfersPage() {
  const almacenes = getAlmacenes();
  const productos = getProductos();

  return <TransferForm almacenes={almacenes} productos={productos} />;
}
