import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tenantService from '../services/tenantService';
import TenantForm from '../components/forms/TenantForm';
import '../styles/TenantDetails.css';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTenantDetails();
    }, [id]);

    const fetchTenantDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await tenantService.getTenantById(id);
            setTenant(response.data);
        } catch (err) {
            console.error('Error fetching tenant details:', err);
            setError('Failed to load tenant details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = (updatedTenant) => {
        setTenant(updatedTenant);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await tenantService.deleteTenant(id);
                navigate('/tenants', { state: { message: 'Tenant deleted successfully' } });
            } catch (err) {
                setError('Failed to delete tenant. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="tenant-details-page">
                <button
                    onClick={() => navigate('/tenants')}
                    className="btn btn-secondary mb-4"
                >
                    ← Back to Tenants
                </button>
                <div className="loading">Loading tenant details...</div>
            </div>
        );
    }

    if (error || !tenant) {
        return (
            <div className="tenant-details-page">
                <button
                    onClick={() => navigate('/tenants')}
                    className="btn btn-secondary mb-4"
                >
                    ← Back to Tenants
                </button>
                <div className="alert alert-error">
                    {error || 'Tenant not found'}
                </div>
                <button 
                    onClick={fetchTenantDetails}
                    className="btn btn-primary mt-4"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="tenant-details-page">
            <div className="details-header">
                <button
                    onClick={() => navigate('/tenants')}
                    className="btn btn-secondary"
                >
                    ← Back to Tenants
                </button>
                <h1>Tenant Details</h1>
                <div className="header-actions">
                    {!isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-primary"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-danger"
                            >
                                🗑️ Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {isEditing ? (
                <div className="edit-form-container">
                    <h2>Edit Tenant Information</h2>
                    <TenantForm
                        tenant={tenant}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            ) : (
                <div className="tenant-info">
                    <div className="info-section">
                        <h2>Personal Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Name:</label>
                                <p>{tenant.name}</p>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <p>
                                    <a href={`mailto:${tenant.email}`}>{tenant.email}</a>
                                </p>
                            </div>
                            <div className="info-item">
                                <label>Phone:</label>
                                <p>{tenant.phone}</p>
                            </div>
                            <div className="info-item">
                                <label>Status:</label>
                                <p>
                                    <span className={`status-badge status-${tenant.status || 'active'}`}>
                                        {(tenant.status || 'active').toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h2>Apartment Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Apartment Number:</label>
                                <p>{tenant.unit_number}</p>
                            </div>
                            <div className="info-item">
                                <label>Unit Type:</label>
                                <p>{tenant.unit_type}</p>
                            </div>
                            <div className="info-item">
                                <label>Lease Start Date:</label>
                                <p>{tenant.lease_start_date ? new Date(tenant.lease_start_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <label>Lease End Date:</label>
                                <p>{tenant.lease_end_date ? new Date(tenant.lease_end_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h2>Financial Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Rent Amount:</label>
                                <p>${tenant.rent_amount}</p>
                            </div>
                            <div className="info-item">
                                <label>Deposit Amount:</label>
                                <p>${tenant.deposit_amount}</p>
                            </div>
                        </div>
                    </div>

                    {tenant.notes && (
                        <div className="info-section">
                            <h2>Notes</h2>
                            <p>{tenant.notes}</p>
                        </div>
                    )}

                    <div className="info-section">
                        <h2>System Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Created At:</label>
                                <p>{new Date(tenant.created_at).toLocaleString()}</p>
                            </div>
                            <div className="info-item">
                                <label>Updated At:</label>
                                <p>{new Date(tenant.updated_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantDetails;
