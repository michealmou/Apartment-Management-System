import React, { useState, useEffect } from 'react';
import TenantForm from '../forms/TenantForm';
import '../../styles/TenantModal.css';

const TenantModal = ({ tenant, onClose, onSave }) => {
    const isEditMode = !!tenant;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditMode ? 'Edit Tenant' : 'Add New Tenant'}</h2>
                    <button 
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <TenantForm
                        tenant={tenant}
                        onSave={onSave}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default TenantModal;
