import React, { useState, useEffect } from 'react';
import tenantService from '../../services/tenantService';
import '../../styles/TenantForm.css';

const TenantForm = ({ tenant, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        unit_number: '',
        unit_type: 'apartment',
        rent_amount: '',
        deposit_amount: '',
        move_in_date: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                email: tenant.email || '',
                phone: tenant.phone || '',
                unit_number: tenant.unit_number || '',
                unit_type: tenant.unit_type || 'apartment',
                rent_amount: tenant.rent_amount || '',
                deposit_amount: tenant.deposit_amount || '',
                move_in_date: tenant.move_in_date ? tenant.move_in_date.split('T')[0] : '',
                status: tenant.status || 'active',
            });
        }
    }, [tenant]);

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone format - at least 8 digits required';
        }

        // Unit number validation
        if (!formData.unit_number.trim()) {
            newErrors.unit_number = 'Apartment number is required';
        }

        // Rent amount validation
        if (!formData.rent_amount) {
            newErrors.rent_amount = 'Rent amount is required';
        } else if (parseFloat(formData.rent_amount) < 0) {
            newErrors.rent_amount = 'Rent amount cannot be negative';
        }

        // Deposit amount validation
        if (!formData.deposit_amount) {
            newErrors.deposit_amount = 'Deposit amount is required';
        } else if (parseFloat(formData.deposit_amount) < 0) {
            newErrors.deposit_amount = 'Deposit amount cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            let response;

            if (tenant) {
                // Update existing
                response = await tenantService.updateTenant(tenant.id, formData);
            } else {
                // Create new
                response = await tenantService.createTenant(formData);
            }

            onSave(response.data.data);
        } catch (err) {
            console.error('Error saving tenant:', err);
            setErrors({ general: err.message || 'Failed to save tenant' });
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Name', name: 'name', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Phone', name: 'phone', type: 'tel', required: true, placeholder: '+970xxxxxxxxx' },
        { label: 'Apartment Number', name: 'unit_number', type: 'text', required: true },
        {
            label: 'Unit Type',
            name: 'unit_type',
            type: 'select',
            options: [
                { value: 'apartment', label: 'Apartment' },
                { value: 'condo', label: 'Condo' },
                { value: 'house', label: 'House' },
            ],
        },
        { label: 'Move-in Date', name: 'move_in_date', type: 'date' },
        { label: 'Rent Amount ($)', name: 'rent_amount', type: 'number', required: true, min: 0 },
        { label: 'Deposit Amount ($)', name: 'deposit_amount', type: 'number', required: true, min: 0 },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
            ],
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="tenant-form">
            {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
            )}

            <div className="form-grid">
                {formFields.map(field => (
                    <div key={field.name} className="form-group">
                        <label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="required">*</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors[field.name] && touched[field.name] ? 'error' : ''}`}
                            >
                                {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field.name}
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={field.placeholder}
                                min={field.min}
                                className={`form-input ${errors[field.name] && touched[field.name] ? 'error' : ''}`}
                            />
                        )}

                        {errors[field.name] && touched[field.name] && (
                            <span className="error-message">{errors[field.name]}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : tenant ? 'Update Tenant' : 'Add Tenant'}
                </button>
            </div>
        </form>
    );
};

export default TenantForm;