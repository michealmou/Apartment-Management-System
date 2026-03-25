import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error: authError } = useAuth();
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [generalError, setGeneralError] = useState(null);

    const onSubmit = async (data) => {
        try {
            setGeneralError(null);
            const user = await login(data.email, data.password);

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'tenant') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setGeneralError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Apartment Management System</h1>
                <h2>Login</h2>

                {generalError && (
                    <div className="alert alert-error">
                        {generalError}
                    </div>
                )}

                {authError && (
                    <div className="alert alert-error">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email format'
                                }
                            })}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                }
                            })}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Register Link */}
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;