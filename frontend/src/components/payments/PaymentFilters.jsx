import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentFilters = ({ onFilterChange, onSearch }) => {
    const [status, setStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState('');

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/tenants', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTenants(response.data.data || []);
        } catch (error) {
            console.error('Error fetching tenants:', error);
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        onFilterChange({
            status: newStatus,
            tenantId: selectedTenant,
            startDate,
            endDate
        });
    };

    const handleDateChange = (type, value) => {
        if (type === 'start') setStartDate(value);
        if (type === 'end') setEndDate(value);

        onFilterChange({
            status,
            tenantId: selectedTenant,
            startDate: type === 'start' ? value : startDate,
            endDate: type === 'end' ? value : endDate
        });
    };

    const handleTenantChange = (e) => {
        const newTenantId = e.target.value;
        setSelectedTenant(newTenantId);
        onFilterChange({
            status,
            tenantId: newTenantId,
            startDate,
            endDate
        });
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term);
    };

    const handleReset = () => {
        setStatus('');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSelectedTenant('');
        onFilterChange({
            status: '',
            tenantId: '',
            startDate: '',
            endDate: ''
        });
        onSearch('');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                    onClick={handleReset}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                    Reset
                </button>
            </div>

            {/* Search */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                </label>
                <input
                    type="text"
                    placeholder="Search by tenant name or apartment..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="paid">Paid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>

                {/* Tenant Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant
                    </label>
                    <select
                        value={selectedTenant}
                        onChange={handleTenantChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Tenants</option>
                        {tenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.id}>
                                {tenant.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* End Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentFilters;
