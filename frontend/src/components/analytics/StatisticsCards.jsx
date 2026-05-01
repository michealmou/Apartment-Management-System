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
