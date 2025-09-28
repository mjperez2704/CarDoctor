"use client";

import * as React from "react";
import { useReactToPrint } from "react-to-print";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SaleReceipt, type SaleReceiptData } from "./sale-receipt";
import { Printer, X } from "lucide-react";

interface ReceiptModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    receiptData: SaleReceiptData | null;
}

export function ReceiptModal({ isOpen, onCloseAction, receiptData }: ReceiptModalProps) {
    const componentRef = React.useRef<HTMLDivElement>(null);

    // ===== INICIO DE LA CORRECCIÓN =====
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Venta-${receiptData?.folio || 'TICKET'}`,
        onAfterPrint: () => console.log("Impresión finalizada"),
    });
    // ===== FIN DE LA CORRECCIÓN =====

    if (!receiptData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Venta Finalizada</DialogTitle>
                </DialogHeader>
                <div className="py-4 flex justify-center bg-gray-200">
                    <SaleReceipt ref={componentRef} data={receiptData} />
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={onCloseAction}>
                        <X className="mr-2 h-4 w-4" /> Cerrar
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimir Ticket
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
