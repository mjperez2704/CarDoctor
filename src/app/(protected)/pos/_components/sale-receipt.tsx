"use client";

import * as React from "react";
import type { Sucursal } from "../actions";
import type { Cliente } from "@/lib/types";

// Tipo para los datos que se mostrarán en el ticket
export interface SaleReceiptData {
    folio: string;
    date: string;
    branch: Sucursal;
    client: Cliente;
    items: {
        quantity: number;
        name: string;
        unitPrice: number;
        subtotal: number;
    }[];
    subtotal: number;
    iva: number;
    total: number;
}

interface SaleReceiptProps {
    data: SaleReceiptData;
}

export const SaleReceipt = React.forwardRef<HTMLDivElement, SaleReceiptProps>(({ data }, ref) => {
    return (
        <div ref={ref} className="p-4 bg-white text-black font-mono text-xs w-[302px]">
            {/* Encabezado */}
            <div className="text-center mb-2">
                <h2 className="text-lg font-bold">Car Doctor</h2>
                <p>{data.branch.nombre}</p>
                <p>Fecha: {new Date(data.date).toLocaleString('es-MX')}</p>
                <p>Folio Venta: {data.folio}</p>
            </div>

            {/* Datos del Cliente */}
            <div className="border-t border-dashed border-black pt-1 mb-2">
                <p>Cliente: {data.client.razon_social}</p>
            </div>

            {/* Cuerpo de la venta */}
            <div className="border-t border-dashed border-black pt-1">
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="text-left">CANT</th>
                        <th className="text-left">DESCRIPCIÓN</th>
                        <th className="text-right">IMPORTE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index}>
                            <td className="align-top">{item.quantity}</td>
                            <td>
                                {item.name}
                                <br />
                                <span className="pl-2">@{Number(item.unitPrice).toFixed(2)}</span>
                            </td>
                            <td className="align-top text-right">${Number(item.subtotal).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="border-t border-dashed border-black pt-1 mt-2">
                <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>${Number(data.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>IVA:</span>
                    <span>${Number(data.iva).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-1">
                    <span>TOTAL:</span>
                    <span>${Number(data.total).toFixed(2)}</span>
                </div>
            </div>

            {/* Pie de página */}
            <div className="text-center border-t border-dashed border-black pt-2 mt-2">
                <p>¡GRACIAS POR SU COMPRA!</p>
            </div>
        </div>
    );
});

SaleReceipt.displayName = "SaleReceipt";
