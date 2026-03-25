import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser, loading } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [generalError, setGeneralError] = useState(null);
    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            setGeneralError(null);
            await registerUser(data.name, data.email, data.password, data.phone);
            navigate('/dashboard');
        } catch (err) {
            setGeneralError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Apartment Management System</h1>
                <h2>Create Account</h2>

                {generalError && (
                    <div className="alert alert-error">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                }
                            })}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && (
                            <span className="error-message">{errors.name.message}</span>
                        )}
                    </div>

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
                            placeholder="Create a strong password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Password must contain uppercase, lowercase, and numbers'
                                }
                            })}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === password || 'Passwords do not match'
                            })}
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[\d\-\s\+\(\)]{10,}$/,
                                    message: 'Invalid phone number'
                                }
                            })}
                            className={errors.phone ? 'input-error' : ''}
                        />
                        {errors.phone && (
                            <span className="error-message">{errors.phone.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="register-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;