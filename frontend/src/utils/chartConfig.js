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
