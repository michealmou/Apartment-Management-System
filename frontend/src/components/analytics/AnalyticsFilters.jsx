import React, { useState } from 'react';

const AnalyticsFilters = ({ onDateRangeChange, onExport }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
            onDateRangeChange(value, endDate);
        } else {
            setEndDate(value);
            onDateRangeChange(startDate, value);
        }
    };

    const handlePreset = (days) => {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - days);

        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        setStartDate(startStr);
        setEndDate(endStr);
        onDateRangeChange(startStr, endStr);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        onDateRangeChange('', '');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Export Button */}
                <div className="flex items-end">
                    <button
                        onClick={() => onExport(startDate, endDate)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        📥 Export PDF
                    </button>
                </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => handlePreset(7)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                    Last 7 days
                </button>
                <button
                    onClick={() => handlePreset(30)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                    Last 30 days
                </button>
                <button
                    onClick={() => handlePreset(90)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                    Last 90 days
                </button>
                <button
                    onClick={handleReset}
                    className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300 text-sm"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AnalyticsFilters;
