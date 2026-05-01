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
