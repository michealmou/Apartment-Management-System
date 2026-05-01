import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentManagement from '../pages/PaymentManagement';
import paymentService from '../services/paymentService';

jest.mock('../services/paymentService', () => ({
    __esModule: true,
    default: {
        getPayments: jest.fn(),
        getPaymentStats: jest.fn(),
        recordPayment: jest.fn(),
        updatePayment: jest.fn(),
    }
}));

jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
}));

describe('PaymentManagement Component', () => {
    const mockPaymentsData = {
        data: [
            {
                id: 1,
                tenant_name: 'John Doe',
                apartment_number: '101',
                amount_due: 1000,
                amount_paid: 500,
                status: 'partially_paid',
                due_date: '2024-12-31'
            },
            {
                id: 2,
                tenant_name: 'Jane Smith',
                apartment_number: '102',
                amount_due: 1000,
                amount_paid: 0,
                status: 'unpaid',
                due_date: '2024-12-25'
            }
        ],
        pagination: {
            totalPages: 1
        }
    };

    const mockStatsData = {
        totalDue: 2000,
        totalCollected: 500,
        totalOutstanding: 1500,
        collectionRate: 25
    };

    beforeEach(() => {
        jest.clearAllMocks();
        paymentService.getPayments.mockResolvedValue(mockPaymentsData);
        paymentService.getPaymentStats.mockResolvedValue(mockStatsData);
    });

    test('renders PaymentManagement page with title', () => {
        render(<PaymentManagement />);
        expect(screen.getByText('Payment Management')).toBeInTheDocument();
    });

    test('displays statistics dashboard on load', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            expect(screen.getByText('Total Due')).toBeInTheDocument();
            expect(screen.getByText('Total Collected')).toBeInTheDocument();
            expect(screen.getByText('Outstanding')).toBeInTheDocument();
            expect(screen.getByText('Collection Rate')).toBeInTheDocument();
        });
    });

    test('displays payment statistics with correct values', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            expect(screen.getByText('$2,000.00')).toBeInTheDocument();
            expect(screen.getByText('$500.00')).toBeInTheDocument();
            expect(screen.getByText('$1,500.00')).toBeInTheDocument();
            expect(screen.getByText('25.00%')).toBeInTheDocument();
        });
    });

    test('renders payment table with data', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('101')).toBeInTheDocument();
            expect(screen.getByText('102')).toBeInTheDocument();
        });
    });

    test('renders filter controls', () => {
        render(<PaymentManagement />);

        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Tenant')).toBeInTheDocument();
    });

    test('opens record payment modal when Record button is clicked', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            const recordButtons = screen.getAllByText('Record');
            fireEvent.click(recordButtons[0]);
        });

        await waitFor(() => {
            expect(screen.getByText('Record Payment')).toBeInTheDocument();
        });
    });

    test('filters payments by status', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            const statusSelect = screen.getByDisplayValue('All Statuses');
            fireEvent.change(statusSelect, { target: { value: 'unpaid' } });
        });

        await waitFor(() => {
            expect(paymentService.getPayments).toHaveBeenCalledWith(
                1,
                10,
                expect.objectContaining({
                    status: 'unpaid'
                })
            );
        });
    });

    test('calls fetchPayments on component mount', async () => {
        render(<PaymentManagement />);

        await waitFor(() => {
            expect(paymentService.getPayments).toHaveBeenCalled();
            expect(paymentService.getPaymentStats).toHaveBeenCalled();
        });
    });

    test('refreshes data after payment is recorded', async () => {
        const { rerender } = render(<PaymentManagement />);

        await waitFor(() => {
            expect(paymentService.getPayments).toHaveBeenCalledTimes(1);
        });

        // Clear and rerender to simulate payment recorded
        jest.clearAllMocks();
        paymentService.getPayments.mockResolvedValue(mockPaymentsData);
        paymentService.getPaymentStats.mockResolvedValue(mockStatsData);

        rerender(<PaymentManagement />);

        await waitFor(() => {
            expect(paymentService.getPayments).toHaveBeenCalled();
            expect(paymentService.getPaymentStats).toHaveBeenCalled();
        });
    });

    test('handles pagination correctly', async () => {
        const mockPagedData = {
            data: [mockPaymentsData.data[0]],
            pagination: {
                totalPages: 2
            }
        };

        paymentService.getPayments.mockResolvedValue(mockPagedData);

        render(<PaymentManagement />);

        await waitFor(() => {
            expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
        });
    });

    test('displays empty state when no payments found', async () => {
        paymentService.getPayments.mockResolvedValue({
            data: [],
            pagination: { totalPages: 1 }
        });

        render(<PaymentManagement />);

        await waitFor(() => {
            expect(screen.getByText('No payments found')).toBeInTheDocument();
        });
    });
});
