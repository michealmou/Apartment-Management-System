// Centeralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    const status = err.statue || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === 'development') && { stack: err.stack },
    });
};

module.exports = errorHandler;
