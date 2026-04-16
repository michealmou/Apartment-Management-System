import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TenantTable from '../components/tables/TenantTable';
import TenantModal from '../components/modals/TenantModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import FilterPanel from '../components/filters/FilterPanel';
import Pagination from '../components/pagination/Pagination';
import tenantService from '../services/tenantService';
import '../styles/Tenants.css';

const Tenants = () => {
    const { user } = useAuth();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingTenantId, setDeletingTenantId] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalTenants, setTotalTenants] = useState(0);
    
    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: null,
        unitType: null,
        rentRange: [0, 5000],
    });

    useEffect(() => {
        fetchTenants();
    }, [currentPage, pageSize, searchTerm, filters]);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                limit: pageSize,
                search: searchTerm,
                ...filters,
            };

            const response = await tenantService.getAllTenants(params);
            setTenants(response.data.data || []);
            setTotalTenants(response.data.pagination?.total || 0);
        } catch (err) {
            console.error('Error fetching tenants:', err);
            setError('Failed to load tenants. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTenant = () => {
        setEditingTenant(null);
        setShowModal(true);
    };

    const handleEditTenant = (tenant) => {
        setEditingTenant(tenant);
        setShowModal(true);
    };

    const handleDeleteTenant = (tenantId) => {
        setDeletingTenantId(tenantId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await tenantService.deleteTenant(deletingTenantId);
            setTenants(tenants.filter(t => t.id !== deletingTenantId));
            setShowDeleteConfirm(false);
            setDeletingTenantId(null);
            // Reset to page 1 if current page is now empty
            if (tenants.length === 1 && currentPage > 1) {
                setCurrentPage(1);
            }
        } catch (err) {
            setError('Failed to delete tenant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingTenant(null);
    };

    const handleModalSave = (savedTenant) => {
        if (editingTenant) {
            // Update existing
            setTenants(tenants.map(t => t.id === savedTenant.id ? savedTenant : t));
        } else {
            // Add new tenant - reset filters and search to show it
            setSearchTerm('');
            setFilters({
                status: null,
                unitType: null,
                rentRange: [0, 5000],
            });
            setCurrentPage(1);
        }
        handleModalClose();
        // Refresh to get accurate counts (filters will be cleared due to state updates above)
        setTimeout(() => fetchTenants(), 100);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page
    };

    const totalPages = Math.ceil(totalTenants / pageSize);

    return (
        <div className="tenants-page">
            <div className="tenants-header">
                <h1>Tenant Management</h1>
                <button 
                    className="btn btn-primary"
                    onClick={handleAddTenant}
                >
                    ➕ Add New Tenant
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={fetchTenants}>Retry</button>
                </div>
            )}

            <div className="tenants-container">
                <FilterPanel 
                    onFilterChange={handleFilterChange}
                    filters={filters}
                />

                <div className="tenants-main">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name, email, or apartment number..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => handleSearchChange('')}
                                className="clear-search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="results-info">
                        <p>Showing {tenants.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalTenants)} of {totalTenants} tenants</p>
                    </div>

                    {loading ? (
                        <div className="loading">Loading tenants...</div>
                    ) : tenants.length > 0 ? (
                        <>
                            <TenantTable
                                tenants={tenants}
                                onEdit={handleEditTenant}
                                onDelete={handleDeleteTenant}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setPageSize}
                            />
                        </>
                    ) : (
                        <div className="no-data">
                            <p>No tenants found</p>
                            <button 
                                className="btn btn-primary"
                                onClick={handleAddTenant}
                            >
                                Add First Tenant
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <TenantModal
                    tenant={editingTenant}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmationModal
                    title="Delete Tenant"
                    message={`Are you sure you want to delete this tenant? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setDeletingTenantId(null);
                    }}
                    loading={loading}
                    confirmText="Delete"
                    confirmVariant="danger"
                />
            )}
        </div>
    );
};

export default Tenants;