import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';

interface ModalState {
    show: boolean;
    message: string;
}

interface ModalContextValue extends ModalState {
    showModal: (message: string) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
    show: false,
    message: '',
    showModal: () => {},
    closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
    children: React.ReactNode;
}
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        message: '',
    });

    const showModal = (message: string) => {
        setModalState({ show: true, message });
    };

    const closeModal = () => {
        setModalState({ show: false, message: '' });
    };

    return (
        <ModalContext.Provider value={{ ...modalState, showModal, closeModal }}>
            {children}
            <Modal show={modalState.show} message={modalState.message} onClose={closeModal} />
        </ModalContext.Provider>
    );
};