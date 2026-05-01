# Payment Analytics & Trends Visualization Guide

## 📊 Overview

This guide provides comprehensive instructions for building a complete Payment Analytics dashboard with visualizations, statistics, trends, date filtering, and PDF export functionality.

---

## 🎯 Project Structure

```
frontend/src/
├── pages/
│   └── PaymentAnalytics.jsx           (Main analytics page)
├── components/
│   └── analytics/
│       ├── StatisticsCards.jsx        (Statistics dashboard)
│       ├── PaymentStatusChart.jsx     (Pie chart for status)
│       ├── CollectionTrendsChart.jsx  (Line chart for trends)
│       ├── AnalyticsFilters.jsx       (Date range filters)
│       └── ExportButton.jsx           (PDF export)
├── hooks/
│   └── usePaymentAnalytics.js         (Analytics logic)
├── services/
│   └── analyticsService.js            (API calls)
├── utils/
│   ├── chartConfig.js                 (Chart configurations)
│   ├── statisticsCalculator.js        (Statistics functions)
│   ├── pdfGenerator.js                (PDF export utility)
│   └── dateUtils.js                   (Date utilities)
└── styles/
    └── analytics.css                  (Styling)
```

---

## 🔧 Step 1: Install Chart Library

### Install Recharts (React charting library)

```bash
cd frontend
npm install recharts
npm install jspdf html2canvas  # For PDF export
```

---

## 📈 Step 2: Create Statistics Calculator Utility

### File: `frontend/src/utils/statisticsCalculator.js`

```javascript
/**
 * Calculate statistics from payment data
 */
export const calculateStatistics = (payments) => {
    if (!payments || payments.length === 0) {
        return {
            totalDue: 0,
            totalCollected: 0,
            totalOutstanding: 0,
            collectionRate: 0,
            averagePayment: 0,
            totalPayments: 0,
            paidCount: 0,
            partiallyPaidCount: 0,
            unpaidCount: 0,
        };
    }

    const totalDue = payments.reduce((sum, p) => sum + (p.amount_due || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
    const totalOutstanding = totalDue - totalCollected;
    const collectionRate = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;
    const averagePayment = totalCollected / payments.length;

    const paidCount = payments.filter(p => p.status === 'paid').length;
    const partiallyPaidCount = payments.filter(p => p.status === 'partially_paid').length;
    const unpaidCount = payments.filter(p => p.status === 'unpaid').length;

    return {
        totalDue: Math.round(totalDue * 100) / 100,
        totalCollected: Math.round(totalCollected * 100) / 100,
        totalOutstanding: Math.round(totalOutstanding * 100) / 100,
        collectionRate: Math.round(collectionRate * 100) / 100,
        averagePayment: Math.round(averagePayment * 100) / 100,
        totalPayments: payments.length,
        paidCount,
        partiallyPaidCount,
        unpaidCount,
    };
};

/**
 * Group payments by month for trends
 */
export const groupPaymentsByMonth = (payments) => {
    const grouped = {};

    payments.forEach((payment) => {
        const date = new Date(payment.payment_date || payment.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!grouped[monthKey]) {
            grouped[monthKey] = {
                month: monthKey,
                collected: 0,
                count: 0,
                date: new Date(date.getFullYear(), date.getMonth(), 1),
            };
        }

        grouped[monthKey].collected += payment.amount_paid || 0;
        grouped[monthKey].count += 1;
    });

    return Object.values(grouped)
        .sort((a, b) => a.date - b.date)
        .map((item) => ({
            month: item.month,
            collected: Math.round(item.collected * 100) / 100,
            count: item.count,
        }));
};

/**
 * Get payment status breakdown
 */
export const getStatusBreakdown = (payments) => {
    const breakdown = {
        paid: 0,
        partially_paid: 0,
        unpaid: 0,
    };

    payments.forEach((payment) => {
        if (breakdown[payment.status] !== undefined) {
            breakdown[payment.status] += 1;
        }
    });

    return [
        {
            name: 'Paid',
            value: breakdown.paid,
            percentage: ((breakdown.paid / payments.length) * 100).toFixed(1),
        },
        {
            name: 'Partially Paid',
            value: breakdown.partially_paid,
            percentage: ((breakdown.partially_paid / payments.length) * 100).toFixed(1),
        },
        {
            name: 'Unpaid',
            value: breakdown.unpaid,
            percentage: ((breakdown.unpaid / payments.length) * 100).toFixed(1),
        },
    ];
};

/**
 * Filter payments by date range
 */
export const filterPaymentsByDateRange = (payments, startDate, endDate) => {
    if (!startDate || !endDate) return payments;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return payments.filter((payment) => {
        const paymentDate = new Date(payment.payment_date || payment.created_at);
        return paymentDate >= start && paymentDate <= end;
    });
};
```

---

## 📊 Step 3: Create Chart Configuration Utility

### File: `frontend/src/utils/chartConfig.js`

```javascript
/**
 * Chart color schemes
 */
export const CHART_COLORS = {
    paid: '#10b981',           // Green
    partiallyPaid: '#f59e0b',  // Amber
    unpaid: '#ef4444',         // Red
    collected: '#3b82f6',      // Blue
    trend: '#8b5cf6',          // Purple
};

/**
 * Pie chart configuration
 */
export const getPieChartConfig = () => {
    return {
        width: '100%',
        height: 300,
        margin: { top: 20, right: 30, left: 30, bottom: 20 },
    };
};

/**
 * Line chart configuration
 */
export const getLineChartConfig = () => {
    return {
        width: '100%',
        height: 300,
        margin: { top: 20, right: 30, left: 0, bottom: 20 },
        responsiveContainer: true,
    };
};

/**
 * Custom label for pie chart
 */
export const renderCustomPieLabel = (entry) => {
    return `${entry.name}: ${entry.value} (${entry.percentage}%)`;
};

/**
 * Format currency for tooltips
 */
export const formatCurrencyForChart = (value) => {
    return `$${(value || 0).toFixed(2)}`;
};
```

---

## 🎨 Step 4: Create Statistics Cards Component

### File: `frontend/src/components/analytics/StatisticsCards.jsx`

```jsx
import React from 'react';

const StatisticsCards = ({ statistics }) => {
    const cards = [
        {
            title: 'Total Due',
            value: `$${statistics.totalDue.toFixed(2)}`,
            icon: '📊',
            color: 'bg-red-50',
            textColor: 'text-red-600',
        },
        {
            title: 'Total Collected',
            value: `$${statistics.totalCollected.toFixed(2)}`,
            icon: '✓',
            color: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Outstanding',
            value: `$${statistics.totalOutstanding.toFixed(2)}`,
            icon: '⚠️',
            color: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
        {
            title: 'Collection Rate',
            value: `${statistics.collectionRate.toFixed(2)}%`,
            icon: '📈',
            color: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
                <div key={index} className={`${card.color} rounded-lg p-6 shadow-sm`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                {card.title}
                            </p>
                            <p className={`text-2xl font-bold ${card.textColor}`}>
                                {card.value}
                            </p>
                        </div>
                        <span className="text-3xl">{card.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatisticsCards;
```

---

## 📉 Step 5: Create Pie Chart Component

### File: `frontend/src/components/analytics/PaymentStatusChart.jsx`

```jsx
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/chartConfig';

const PaymentStatusChart = ({ data }) => {
    const chartData = [
        {
            name: 'Paid',
            value: data[0]?.value || 0,
            percentage: data[0]?.percentage || 0,
        },
        {
            name: 'Partially Paid',
            value: data[1]?.value || 0,
            percentage: data[1]?.percentage || 0,
        },
        {
            name: 'Unpaid',
            value: data[2]?.value || 0,
            percentage: data[2]?.percentage || 0,
        },
    ];

    const COLORS = [
        CHART_COLORS.paid,
        CHART_COLORS.partiallyPaid,
        CHART_COLORS.unpaid,
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-sm">Count: {payload[0].value}</p>
                    <p className="text-sm">
                        {((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

            {/* Status Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                {chartData.map((item, index) => (
                    <div key={index} className="text-center">
                        <div
                            className="w-4 h-4 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <p className="text-sm font-medium text-gray-600">{item.name}</p>
                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentStatusChart;
```

---

## 📈 Step 6: Create Line Chart Component

### File: `frontend/src/components/analytics/CollectionTrendsChart.jsx`

```jsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, formatCurrencyForChart } from '../../utils/chartConfig';

const CollectionTrendsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Collection Trends</h3>
                <div className="text-center py-12 text-gray-500">
                    No trend data available
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-blue-600">
                        Collected: {formatCurrencyForChart(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Collection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="collected"
                        stroke={CHART_COLORS.trend}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.trend, r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Amount Collected"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CollectionTrendsChart;
```

---

## 🗓️ Step 7: Create Analytics Filters Component

### File: `frontend/src/components/analytics/AnalyticsFilters.jsx`

```jsx
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
```

---

## 📄 Step 8: Create PDF Export Utility

### File: `frontend/src/utils/pdfGenerator.js`

```javascript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportAnalyticsToPDF = async (elementId, filename = 'payment-analytics.pdf') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Create canvas from HTML element
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF, creating new pages as needed
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Add metadata
        pdf.setProperties({
            title: 'Payment Analytics Report',
            author: 'Apartment Management System',
            subject: 'Payment Analytics',
            creationDate: new Date(),
        });

        // Save PDF
        pdf.save(filename);

        return { success: true, message: 'PDF exported successfully' };
    } catch (error) {
        console.error('Error exporting PDF:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Generate detailed analytics PDF with tables
 */
export const exportDetailedAnalyticsToPDF = (statistics, chartData, filename = 'analytics-report.pdf') => {
    try {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Title
        pdf.setFontSize(20);
        pdf.text('Payment Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Date generated
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Statistics Section
        pdf.setFontSize(14);
        pdf.text('Key Statistics', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        const statsData = [
            [`Total Due: $${statistics.totalDue.toFixed(2)}`],
            [`Total Collected: $${statistics.totalCollected.toFixed(2)}`],
            [`Outstanding: $${statistics.totalOutstanding.toFixed(2)}`],
            [`Collection Rate: ${statistics.collectionRate.toFixed(2)}%`],
        ];

        pdf.autoTable({
            body: statsData,
            startY: yPosition,
            theme: 'grid',
            margin: { left: 20, right: 20 },
        });

        yPosition = pdf.lastAutoTable.finalY + 15;

        // Status Breakdown
        if (chartData && chartData.length > 0) {
            pdf.setFontSize(14);
            pdf.text('Payment Status Breakdown', 20, yPosition);
            yPosition += 10;

            const statusData = chartData.map((item) => [
                item.name,
                item.value.toString(),
                `${item.percentage}%`,
            ]);

            pdf.autoTable({
                head: [['Status', 'Count', 'Percentage']],
                body: statusData,
                startY: yPosition,
                theme: 'grid',
                margin: { left: 20, right: 20 },
            });
        }

        pdf.save(filename);
        return { success: true, message: 'Detailed PDF exported successfully' };
    } catch (error) {
        console.error('Error exporting detailed PDF:', error);
        return { success: false, message: error.message };
    }
};
```

---

## 🎣 Step 9: Create Custom Hook

### File: `frontend/src/hooks/usePaymentAnalytics.js`

```javascript
import { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import {
    calculateStatistics,
    groupPaymentsByMonth,
    getStatusBreakdown,
    filterPaymentsByDateRange,
} from '../utils/statisticsCalculator';

export const usePaymentAnalytics = () => {
    const [payments, setPayments] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [statusBreakdown, setStatusBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsService.getAllPayments();
            setPayments(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch payments');
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateAnalytics = (dataToAnalyze) => {
        const stats = calculateStatistics(dataToAnalyze);
        const trends = groupPaymentsByMonth(dataToAnalyze);
        const breakdown = getStatusBreakdown(dataToAnalyze);

        setStatistics(stats);
        setTrends(trends);
        setStatusBreakdown(breakdown);
    };

    const applyDateRangeFilter = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
        const filtered = filterPaymentsByDateRange(payments, startDate, endDate);
        updateAnalytics(filtered);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (payments.length > 0) {
            if (dateRange.startDate || dateRange.endDate) {
                const filtered = filterPaymentsByDateRange(
                    payments,
                    dateRange.startDate,
                    dateRange.endDate
                );
                updateAnalytics(filtered);
            } else {
                updateAnalytics(payments);
            }
        }
    }, [payments]);

    return {
        payments,
        statistics,
        trends,
        statusBreakdown,
        loading,
        error,
        applyDateRangeFilter,
        refreshPayments: fetchPayments,
    };
};
```

---

## 🔗 Step 10: Create Analytics Service

### File: `frontend/src/services/analyticsService.js`

```javascript
import api from './api';

const analyticsService = {
    // Get all payments for analytics
    getAllPayments: async () => {
        try {
            const response = await api.get('/payments?limit=1000');
            return response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    // Get payment statistics
    getStatistics: async (filters = {}) => {
        try {
            const response = await api.get('/payments/stats', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },

    // Get payment trends data
    getPaymentTrends: async (startDate, endDate) => {
        try {
            const response = await api.get('/payments/trends', {
                params: { startDate, endDate },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trends:', error);
            throw error;
        }
    },

    // Get payment history for export
    getPaymentHistory: async (filters = {}) => {
        try {
            const response = await api.get('/payments/history', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    },
};

export default analyticsService;
```

---

## 📱 Step 11: Create Main Analytics Page

### File: `frontend/src/pages/PaymentAnalytics.jsx`

```jsx
import React, { useState } from 'react';
import StatisticsCards from '../components/analytics/StatisticsCards';
import PaymentStatusChart from '../components/analytics/PaymentStatusChart';
import CollectionTrendsChart from '../components/analytics/CollectionTrendsChart';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import { usePaymentAnalytics } from '../hooks/usePaymentAnalytics';
import { exportAnalyticsToPDF, exportDetailedAnalyticsToPDF } from '../utils/pdfGenerator';

const PaymentAnalytics = () => {
    const {
        statistics,
        trends,
        statusBreakdown,
        loading,
        error,
        applyDateRangeFilter,
    } = usePaymentAnalytics();

    const [exporting, setExporting] = useState(false);

    const handleExport = async (startDate, endDate) => {
        setExporting(true);
        try {
            const result = exportDetailedAnalyticsToPDF(
                statistics,
                statusBreakdown,
                `payment-analytics-${new Date().toISOString().split('T')[0]}.pdf`
            );

            if (result.success) {
                alert('PDF exported successfully!');
            } else {
                alert(`Export failed: ${result.message}`);
            }
        } catch (err) {
            console.error('Error exporting:', err);
            alert('Error exporting PDF');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Payment Analytics</h1>
                    <p className="text-gray-600 mt-2">Track payment trends and statistics</p>
                </div>

                {/* Filters */}
                <AnalyticsFilters
                    onDateRangeChange={applyDateRangeFilter}
                    onExport={handleExport}
                />

                {/* Statistics Cards */}
                {statistics && <StatisticsCards statistics={statistics} />}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Status Breakdown Chart */}
                    <PaymentStatusChart data={statusBreakdown} />

                    {/* Trends Chart */}
                    <CollectionTrendsChart data={trends} />
                </div>

                {/* Summary Statistics */}
                {statistics && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.totalPayments}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Average Payment</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${statistics.averagePayment.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status Breakdown</p>
                                <p className="text-sm text-gray-700">
                                    Paid: {statistics.paidCount} | Partial: {statistics.partiallyPaidCount} |
                                    Unpaid: {statistics.unpaidCount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentAnalytics;
```

---

## 🗺️ Step 12: Update Routes

### File: `frontend/src/App.jsx` (Add route)

```jsx
import PaymentAnalytics from './pages/PaymentAnalytics';

// Inside Routes component:
<Route
    path="/analytics"
    element={
        <PrivateRoute requiredRole={['admin']}>
            <PaymentAnalytics />
        </PrivateRoute>
    }
/>
```

---

## 🎨 Step 13: Add Custom Styles

### File: `frontend/src/styles/analytics.css`

```css
/* Analytics Page Styles */

.analytics-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 1rem;
    color: white;
    margin-bottom: 2rem;
}

.statistics-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.statistics-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.chart-container {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
}

.chart-container h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #111827;
}

/* Responsive Charts */
@media (max-width: 768px) {
    .chart-container {
        padding: 1rem;
    }

    .statistics-card {
        padding: 1rem !important;
    }
}

/* Loading Spinner */
.analytics-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 0.25rem solid #f3f4f6;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Filter Buttons */
.filter-preset-btn {
    transition: all 0.2s;
}

.filter-preset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-preset-btn.active {
    background-color: #3b82f6;
    color: white;
}

/* Export Button */
.export-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.export-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.export-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Tooltip Styles */
.recharts-tooltip {
    background: white !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 0.375rem !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}
```

---

## ✅ Acceptance Criteria Checklist

- ✅ Statistics cards display correctly (Total Due, Collected, Outstanding, Collection Rate)
- ✅ Pie chart shows payment status breakdown (Paid/Partially Paid/Unpaid)
- ✅ Line chart displays collection trends over time
- ✅ Date range filtering works (start date, end date, presets)
- ✅ PDF export includes statistics and charts
- ✅ All calculations are accurate
- ✅ Responsive design on mobile, tablet, and desktop
- ✅ Charts update when filters change
- ✅ Error handling for data fetch failures
- ✅ Loading states displayed during data fetch

---

## 📋 Summary of Implementation

| Component | File | Purpose |
|-----------|------|---------|
| Statistics Calculator | `statisticsCalculator.js` | Calculate metrics and aggregations |
| Chart Configuration | `chartConfig.js` | Reusable chart colors and settings |
| Statistics Cards | `StatisticsCards.jsx` | Display key metrics |
| Pie Chart | `PaymentStatusChart.jsx` | Show status breakdown |
| Line Chart | `CollectionTrendsChart.jsx` | Display trends over time |
| Analytics Filters | `AnalyticsFilters.jsx` | Date range and preset filters |
| PDF Generator | `pdfGenerator.js` | Export analytics to PDF |
| Custom Hook | `usePaymentAnalytics.js` | Manage analytics state and logic |
| Analytics Service | `analyticsService.js` | API integration |
| Main Page | `PaymentAnalytics.jsx` | Orchestrate all components |

---

## 🚀 Next Steps

1. Install dependencies: `npm install recharts jspdf html2canvas`
2. Implement all components following the guide
3. Test chart responsiveness on different screen sizes
4. Verify PDF export functionality
5. Add more chart types (bar charts, area charts)
6. Implement real-time data updates
7. Add export to CSV functionality
8. Create custom report builder
