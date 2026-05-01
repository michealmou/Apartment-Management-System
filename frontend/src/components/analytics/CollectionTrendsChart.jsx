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
