import React from 'react';
import '../../styles/TenantTable.css';

const TenantTable = ({ tenants, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const statusClass = status === 'active' ? 'badge-success' : 'badge-danger';
        return (
            <span className={`badge ${statusClass}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    return (
        <div className="tenant-table-container">
            <table className="tenant-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Apartment</th>
                        <th>Contact Info</th>
                        <th>Move-in Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map((tenant) => (
                        <tr key={tenant.id} className="tenant-row">
                            <td data-label="Name">{tenant.name}</td>
                            <td data-label="Apartment">{tenant.unit_number}</td>
                            <td data-label="Contact Info">
                                <div className="contact-info">
                                    <div>{tenant.email}</div>
                                    <div>{tenant.phone}</div>
                                </div>
                            </td>
                            <td data-label="Move-in Date">
                                {formatDate(tenant.move_in_date || tenant.created_at)}
                            </td>
                            <td data-label="Status">
                                {getStatusBadge(tenant.status)}
                            </td>
                            <td data-label="Actions" className="actions-cell">
                                <button
                                    className="btn-icon btn-edit"
                                    onClick={() => onEdit(tenant)}
                                    title="Edit tenant"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => onDelete(tenant.id)}
                                    title="Delete tenant"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TenantTable;