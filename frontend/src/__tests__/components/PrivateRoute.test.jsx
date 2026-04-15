import React from 'react';
import { render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('PrivateRoute Component', () => {
    const renderWithRouter = (component) => {
        render(
            <BrowserRouter>
                {component}
            </BrowserRouter>
        );
    };
    beforeEach(() => {
        useAuth.mockClear();
    });

    describe('Authentication checks', () => {
        it('should show loading state when chehcking authentication', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => false),
                loading: true,
            });

            renderWithRouter(
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            );

            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
        it('should render protected content for authenticated users', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => true),
                loading: false,
                user:{
                    id: '1',
                    role: 'tenant',
                }
            });

            renderWithRouter(
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            );

            expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
        });

        it('should redirect to login wwwhen not authenticated', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => false),
                loading: false,
            });
            renderWithRouter(
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            );
            //navigate component will handle the redirect 
            expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
        });
    });
    describe('Role based access control', () => {
        it('should render content for authorized roles', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => true),
                loading: false,
                user:{
                    id: '1',
                    role: 'admin',
                }
            });
            renderWithRouter(
                <PrivateRoute requiredRole={'admin'}>
                    <div>Admin Content</div>
                </PrivateRoute>
            );
            expect(screen.getByText(/Admin Content/i)).toBeInTheDocument();
        });
        it('should deny access for unauthorized roles', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => true),
                loading: false,                
                user:{
                    id: '1',
                    role: 'tenant',
                }
            });
            renderWithRouter(
                <PrivateRoute requiredRole={'admin'}>
                    <div>Admin Content</div>    
                </PrivateRoute>
            );

            expect(screen.queryByText(/Admin Content/i)).not.toBeInTheDocument();
        });
        it('should support multiple allowed roles', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => true),
                loading: false,
                user:{
                    id: '1',
                    role: 'manager',
                }
            });
            renderWithRouter(
                <PrivateRoute requiredRole={['admin', 'manager']}>
                    <div>Protected Content</div>
                </PrivateRoute>
            );
            expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
        });
        it ('should redirect unthorized page for insufficient roles', () => {
            useAuth.mockReturnValue({
                isAuthenticated: jest.fn(() => true),
                loading: false,
                user:{
                    id: '1',
                    role: 'tenant',
                }
            });
            renderWithRouter(
                <PrivateRoute requiredRole={'admin'}>
                    <div>Admin Content</div>
                </PrivateRoute>
            );
            expect(screen.queryByText(/Admin Content/i)).not.toBeInTheDocument();
        });
    });
});