import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold mb-4">About</h3>
                        <p className="text-sm opacity-75">
                            Apartment Management System for efficient property and tenant management.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="text-sm opacity-75 space-y-2">
                            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                            <li><Link to="/tenants" className="hover:text-white">Tenants</Link></li>
                            <li><Link to="/payments" className="hover:text-white">Payments</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Contact</h3>
                        <p className="text-sm opacity-75">
                            support@ams.com<br />
                            +1 (555) 123-4567
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center text-sm opacity-75">
                    <p>&copy; 2026 Apartment Management System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;