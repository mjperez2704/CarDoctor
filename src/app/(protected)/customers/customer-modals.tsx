"use client";
//import React, { useActionState, useEffect } from "react";
import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import { VehicleListModal } from './vehicle-list-modal';
import { VehicleFormModal } from './vehicle-form-modal';
import { CustomerFormModal } from './customer-form-modal';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import type { CustomerWithVehicleCount } from './actions';

type ModalType = 'viewVehicles' | 'addVehicle' | 'addCustomer' | 'deleteCustomer' | 'editCustomer';

interface ModalData {
    customer?: CustomerWithVehicleCount;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    // CORRECCIÓN: Se renombra la función a 'onCloseAction' para ser consistente
    onCloseAction: () => void;
}

export const useCustomerModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    // CORRECCIÓN: Se renombra la función a 'onCloseAction'
    onCloseAction: () => set({ type: null, isOpen: false }),
}));

export const CustomerModals = () => {
    const [isClient, setIsClient] = useState(false);
    // CORRECCIÓN: Se usa el nuevo nombre 'onCloseAction' del store
    const { type, data, isOpen, onCloseAction } = useCustomerModal();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            {/* CORRECCIÓN: Se pasa la prop correcta 'onCloseAction' a todos los modales */}
            {type === 'viewVehicles' && data.customer && (<VehicleListModal isOpen={isOpen} onCloseAction={onCloseAction} customer={data.customer} />)}
            {type === 'addVehicle' && data.customer && (<VehicleFormModal isOpen={isOpen} onCloseAction={onCloseAction} customer={data.customer} />)}

            {(type === 'addCustomer' || type === 'editCustomer') && (
                <CustomerFormModal
                    isOpen={isOpen}
                    onCloseAction={onCloseAction}
                    customer={type === 'editCustomer' ? data.customer : null}
                />
            )}

            {type === 'deleteCustomer' && (<CustomerDeleteDialog isOpen={isOpen} onCloseAction={onCloseAction} customer={data.customer ?? null}/>)}
        </>
    );
};
