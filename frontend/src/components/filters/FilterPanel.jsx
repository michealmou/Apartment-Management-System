import React, { useState } from 'react';
import '../../styles/FilterPanel.css';

const FilterPanel = ({ onFilterChange, filters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (filterName, value) => {
        const newFilters = {
            ...localFilters,
            [filterName]: value,
        };
        setLocalFilters(newFilters);
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
        setIsOpen(false);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            status: null,
            unitType: null,
            rentRange: [0, 5000],
        };
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const activeFilterCount = Object.values(localFilters).filter(v => v !== null && v !== undefined).length - 1; // -1 for rentRange array

    return (
        <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
            <button 
                className="filter-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                🔍 Filters
                {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>

            {isOpen && (
                <div className="filter-content">
                    <div className="filter-group">
                        <label>Status</label>
                        <select
                            value={localFilters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value || null)}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Unit Type</label>
                        <select
                            value={localFilters.unitType || ''}
                            onChange={(e) => handleFilterChange('unitType', e.target.value || null)}
                        >
                            <option value="">All Types</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="house">House</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Rent Range</label>
                        <div className="range-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={localFilters.rentRange[0]}
                                onChange={(e) => handleFilterChange('rentRange', [parseInt(e.target.value) || 0, localFilters.rentRange[1]])}
                                min="0"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={localFilters.rentRange[1]}
                                onChange={(e) => handleFilterChange('rentRange', [localFilters.rentRange[0], parseInt(e.target.value) || 5000])}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button 
                            className="btn btn-secondary"
                            onClick={handleClearFilters}
                        >
                            Clear All
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;