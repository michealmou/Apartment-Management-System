import React, { useState, useEffect } from 'react';
import '../../styles/WelcomeSection.css';

const WelcomeSection = ({ userName }) => {
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        updateGreeting();
        const interval = setInterval(() => {
            setCurrentTime(new Date());
            updateGreeting();
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const updateGreeting = () => {
        const hour = new Date().getHours();
        let greet = '';
        
        if (hour >= 5 && hour < 12) greet = 'Good Morning';
        else if (hour >= 12 && hour < 17) greet = 'Good Afternoon';
        else if (hour >= 17 && hour < 21) greet = 'Good Evening';
        else greet = 'Good Night';

        setGreeting(greet);
    };

    const formatDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return currentTime.toLocaleDateString('en-US', options);
    };

    return (
        <section className="welcome-section">
            <div className="welcome-content">
                <div className="greeting">
                    <h1>{greeting}, <span className="user-name">{userName || 'Admin'}</span>!</h1>
                    <p className="welcome-message">Welcome back to your apartment management dashboard</p>
                </div>
                <div className="date-time">
                    <p className="date">{formatDate()}</p>
                    <p className="time">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;