import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import { AuthWrapper } from '../test-utils/AuthWrapper';
import * as authService from '../services/authService';

jest.mock('../services/authService', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getToken: jest.fn(() => null),
        getRefreshToken: jest.fn(() => null),
        getStoredUser: jest.fn(() => null),
        setToken: jest.fn(),
    }
}));

describe('Login Component', () => {
    beforeEach(() => {
        authService.default.login.mockClear();
    });

    const renderLogin = () => {
        return render(
            <AuthWrapper>
                <Login />
            </AuthWrapper>
        );
    };

    describe('form rendering', () => {
        it('should render email and password input fields', () => {
            renderLogin();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        });

        it('should render login button', () => {
            renderLogin();
            expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        });

        it('should render register link', () => {
            renderLogin();
            expect(screen.getByText(/register/i)).toBeInTheDocument();
        });
    });
    describe('form validation', () => {
        it('should show error for invalid email format', async () => {
            renderLogin();

            const emailInput = screen.getByLabelText(/email/i);
            await userEvent.type(emailInput, 'invalid-email');

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/valid email/i)).toBeInTheDocument();
            });
        });
        it('should show error for password less than 8 characters', async () => {
            renderLogin();
            const passwordInput = screen.getByLabelText(/password/i);
            await userEvent.type(passwordInput, 'short');

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
            });
        });

        it('should enable login button when form is valid', async () => {
            renderLogin();

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'validpassword');
            const loginButton = screen.getByRole('button', { name: /login/i });
            expect(loginButton).not.toBeDisabled();
        });
    });
    describe('login functionality', () => {
        it('should call login service with email and password', async () => {
            authService.default.login.mockResolvedValueOnce({
                accessToken: 'token',
                refreshToken: 'refresh',
                user:{
                    id :'1',
                    email: 'test@example.com',
                    role: 'tenant'
                }
            });
            renderLogin();
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'validpassword');

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(authService.default.login).toHaveBeenCalledWith(
                    'test@example.com',
                    'validpassword'
                );
            });
        });
        it('should show error message on login failure', async () => {
            authService.default.login.mockRejectedValueOnce(
                new Error('Invalid credentials')
            );
            renderLogin();
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'wrongpassword');

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);
            await waitFor(() => {
                // Use queryAllByText to handle duplicate error messages in strict mode
                const errorMessages = screen.queryAllByText(/invalid credentials/i);
                expect(errorMessages.length).toBeGreaterThan(0);
            });
        });
        it('should show loading state during login', async () => {
            // Mock a delayed login response
            authService.default.login.mockImplementationOnce(() =>
                new Promise(resolve => 
                    setTimeout(() => {
                        resolve({
                            accessToken: 'token',
                            refreshToken: 'refresh',
                            user: {
                                id: '1',
                                email: 'test@example.com',
                                role: 'tenant'
                            }
                        });
                    }, 100)
                )
            );

            renderLogin();
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'validpassword');

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);

            // Button should be disabled during loading
            await waitFor(() => {
                expect(loginButton).toBeDisabled();
            }, { timeout: 200 });
        });
    });
});