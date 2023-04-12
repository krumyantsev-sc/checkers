import React from 'react';
import '../../styles/Modal.css';

interface ModalProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, message, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">Сообщение сервера</h4>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-close-button" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;