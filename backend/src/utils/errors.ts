/**
 * Custom Error Classes
 * Centralized error handling with specific error types
 */

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        code?: string
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;

        Error.captureStackTrace(this);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Doğrulama hatası', details?: any) {
        super(message, 400, true, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        if (details) {
            (this as any).details = details;
        }
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Kimlik doğrulama başarısız') {
        super(message, 401, true, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Yetkiniz bulunmuyor') {
        super(message, 403, true, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Kaynak bulunamadı') {
        super(message, 404, true, 'NOT_FOUND_ERROR');
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Kaynak zaten mevcut') {
        super(message, 409, true, 'CONFLICT_ERROR');
        this.name = 'ConflictError';
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Çok fazla istek gönderildi') {
        super(message, 429, true, 'TOO_MANY_REQUESTS');
        this.name = 'TooManyRequestsError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string = 'Veritabanı hatası', originalError?: Error) {
        super(message, 500, true, 'DATABASE_ERROR');
        this.name = 'DatabaseError';
        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}

export class ExternalServiceError extends AppError {
    constructor(
        service: string,
        message: string = 'Harici servis hatası'
    ) {
        super(`${service}: ${message}`, 503, true, 'EXTERNAL_SERVICE_ERROR');
        this.name = 'ExternalServiceError';
    }
}

export class FileSystemError extends AppError {
    constructor(message: string = 'Dosya sistemi hatası') {
        super(message, 500, true, 'FILESYSTEM_ERROR');
        this.name = 'FileSystemError';
    }
}

export class DockerError extends AppError {
    constructor(message: string = 'Docker hatası') {
        super(message, 500, true, 'DOCKER_ERROR');
        this.name = 'DockerError';
    }
}

/**
 * Error factory - creates appropriate error based on type
 */
export const createError = (
    type: string,
    message: string,
    details?: any
): AppError => {
    switch (type) {
        case 'validation':
            return new ValidationError(message, details);
        case 'authentication':
            return new AuthenticationError(message);
        case 'authorization':
            return new AuthorizationError(message);
        case 'notFound':
            return new NotFoundError(message);
        case 'conflict':
            return new ConflictError(message);
        case 'database':
            return new DatabaseError(message);
        case 'docker':
            return new DockerError(message);
        case 'filesystem':
            return new FileSystemError(message);
        default:
            return new AppError(message);
    }
};
