// src/app/(protected)/work-orders/[id]/diagnose/page.tsx
import { PageHeader } from "@/components/page-header";
import { getWorkOrderDetails, getProductsForQuote } from "@/app/(protected)/work-orders/actions";
import { DiagnoseWorkOrder } from "@/components/diagnose-work-order";
import { notFound } from "next/navigation";

export default async function DiagnosePage({ params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    return notFound();
  }

  const orderDetails = await getWorkOrderDetails(orderId);
  const products = await getProductsForQuote();

  if (!orderDetails) {
    return notFound();
  }

  return (
    <>
        <PageHeader
            title={`Diagnóstico de Orden de Servicio #${orderDetails.folio}`}
            description={`Gestionando el vehículo: ${orderDetails.vehiculo_descripcion}`}
        />
        <DiagnoseWorkOrder order={orderDetails} products={products} />
    </>
  );
}
