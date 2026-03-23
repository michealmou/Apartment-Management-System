class AuthError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AuthError';
    }
}

class ValidationError extends AuthError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }   
}

class UnauthorizedError extends AuthError {
    constructor(message = 'invalid credentials') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

class ForbiddenError extends AuthError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}
class ConflictError extends AuthError {
    constructor(message = 'resource already exists') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

module.exports = {
    AuthError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
};