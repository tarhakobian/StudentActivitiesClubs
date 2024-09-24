class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;  // Flag to differentiate between operational and programming errors
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = "Invalid request") {
        super(message, 400);
    }
}

module.exports = { ValidationError, NotFoundError, AppError }