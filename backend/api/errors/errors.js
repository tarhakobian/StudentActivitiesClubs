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

class DuplicateUserError extends Error {
    constructor(message = "User with these credentials already exists") {
        super(message, 400);
    }
}

class PasswordValidationError extends Error {
    constructor(message = "Password doesn't match") {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized request") {
        super(message, 401);
    }
}

class CabinetMemberRequiredError extends AppError {
    constructor(message = "You must be a cabinet member to perform this action") {
        super(message, 403); // 403 Forbidden
    }
}

class MissingParametersError extends AppError {
    constructor(message = "Missing required parameters") {
        super(message, 400);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Missing required parameters or don't match the constraints") {
        super(message, 400);
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    CabinetMemberRequiredError,
    DuplicateUserError,
    PasswordValidationError,
    MissingParametersError,
    BadRequestError,
    AppError
}