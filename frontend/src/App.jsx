import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// layouts

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

//pages

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tenants from './pages/Tenants';
import AdminDashboard from './pages/AdminDashboard';
import TenantDetails from './pages/TenantDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Header />

                    <main className="app-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes - Tenant/User */}
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute requiredRole={['tenant', 'admin']}>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/tenants"
                                element={
                                    <PrivateRoute requiredRole={['tenant', 'admin']}>
                                        <Tenants />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/payments"
                                element={
                                    <PrivateRoute requiredRole={['tenant', 'admin']}>
                                        <Payments />
                                    </PrivateRoute>
                                }
                            />

                            {/* Protected Routes - Admin Only */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <PrivateRoute requiredRole="admin">
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />

                            {/* Error Routes */}
                            <Route path="/unauthorized" element={<NotFound />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;