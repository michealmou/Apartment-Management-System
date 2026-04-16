import React from 'react';
import '../../styles/ConfirmationModal.css';

const ConfirmationModal = ({ 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    loading, 
    confirmText = 'Confirm',
    confirmVariant = 'primary' 
}) => {
    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="confirmation-modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>

                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`btn btn-${confirmVariant}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;