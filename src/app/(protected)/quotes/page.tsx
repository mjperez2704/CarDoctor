// src/app/(protected)/quotes/page.tsx
import { Quotes } from "@/components/quotes";
import { getQuotes, getProductsForQuote } from "./actions";
import { getCustomersWithVehicleCount } from '../customers/actions';
import { PageHeader } from "@/components/page-header";

export default async function QuotesPage() {
    const quotes = await getQuotes();
    const clients = await getCustomersWithVehicleCount();
    const products = await getProductsForQuote();

    return (
        <>
            <PageHeader
                title="Cotizaciones"
                description="Crea y administra cotizaciones para clientes."
            />
            <Quotes
                initialQuotes={quotes}
                clients={clients}
                products={products}
            />
        </>
    );
}
