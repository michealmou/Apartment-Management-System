import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// layouts

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

//pages

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import NotFound from './pages/NotFound';

function App(){
    return(
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route
                    path = "/"
                    element={
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    }
                    />
                    <Route
                    path = "/login"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                    />
                    <Route
                    path = "/register"
                    element={
                        <AuthLayout>
                            <Register />
                        </AuthLayout>
                    }
                    />
                    <Route
                    path = "/dashboard"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </PrivateRoute>
                    }
                    />
                    <Route
                    path = "/tenants"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Tenants />
                            </MainLayout>
                        </PrivateRoute>
                    }
                    />
                    <Route
                    path = "/tenants/:id"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <TenantDetails />
                            </MainLayout>
                        </PrivateRoute>
                    }
                    />
                    <Route
                    path="/payments"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Payments />
                            </MainLayout>
                        </PrivateRoute>
                    }
                    />
                    <Route
                    path="/payments/:id"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <PaymentDetails />
                            </MainLayout>
                        </PrivateRoute>
                    }
                    />
                    {/* Catch-all route for 404 Not Found */}
                    <Route
                        path="*"
                        element={
                            <MainLayout>
                                <NotFound />
                            </MainLayout>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;