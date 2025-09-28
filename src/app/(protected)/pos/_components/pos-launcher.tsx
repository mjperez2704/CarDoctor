"use client";

import * as React from "react";
import type { Sucursal } from "../actions";
import type { Cliente } from "@/lib/types";
import { BranchSelectorModal } from "./branch-selector-modal";
import { POSInterface } from "./pos-interface";

interface POSLauncherProps {
    sucursales: Sucursal[];
    clientes: Cliente[];
    defaultClient: Cliente;
}

export function POSLauncher({ sucursales, clientes, defaultClient }: POSLauncherProps) {
    const [selectedBranch, setSelectedBranch] = React.useState<Sucursal | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(true);

    const handleSelectBranch = (branchId: string) => {
        const branch = sucursales.find(s => String(s.id) === branchId);
        if (branch) {
            setSelectedBranch(branch);
            setIsModalOpen(false);
        }
    };

    const handleChangeBranch = () => {
        setSelectedBranch(null);
        setIsModalOpen(true);
    }

    if (!selectedBranch) {
        return (
            // ===== INICIO DE LA MODIFICACIÓN =====
            <BranchSelectorModal
                isOpen={isModalOpen}
                sucursales={sucursales}
                onSelectBranchAction={handleSelectBranch} // <-- PROP ACTUALIZADA
            />
            // ===== FIN DE LA MODIFICACIÓN =====
        );
    }

    return (
        // ===== INICIO DE LA MODIFICACIÓN =====
        <POSInterface
            branch={selectedBranch}
            clientes={clientes}
            defaultClient={defaultClient}
            onChangeBranchAction={handleChangeBranch} // <-- PROP ACTUALIZADA
        />
        // ===== FIN DE LA MODIFICACIÓN =====
    );
}
