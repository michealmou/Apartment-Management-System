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
