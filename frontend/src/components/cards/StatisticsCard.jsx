import React from 'react';
import '../../styles/StatisticsCard.css';

const StatisticsCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    variant = 'primary',
    onClick,
    loading = false
}) => {
    return (
        <div 
            className={`statistics-card card-${variant}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyPress={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            {loading ? (
                <div className="card-spinner"></div>
            ) : (
                <>
                    <div className="card-icon">{icon}</div>
                    <div className="card-content">
                        <h3 className="card-title">{title}</h3>
                        <p className="card-value">{value}</p>
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {onClick && <div className="card-arrow">→</div>}
                </>
            )}
        </div>
    );
};

export default StatisticsCard;