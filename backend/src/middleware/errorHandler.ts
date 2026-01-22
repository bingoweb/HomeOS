/**
 * Global Error Handler Middleware
 * Centralized error processing and response formatting
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger, { logError } from '../utils/logger';

/**
 * Error response formatter
 */
interface ErrorResponse {
    basarili: false;
    hata: {
        mesaj: string;
        kod?: string;
        detaylar?: any;
        stack?: string;
    };
}

/**
 * Global error handler
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default values
    let statusCode = 500;
    let message = 'Sunucu hatası';
    let code: string | undefined;
    let details: any;
    let isOperational = false;

    // AppError instance check
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
        isOperational = err.isOperational;
        details = (err as any).details;
    } else {
        message = err.message || message;
    }

    // Log the error
    logError(err, {
        url: req.url,
        method: req.method,
        ip: req.ip,
        kullaniciId: (req as any).kullanici?.id,
        statusCode,
        isOperational
    });

    // Prepare error response
    const errorResponse: ErrorResponse = {
        basarili: false,
        hata: {
            mesaj: message,
            kod: code
        }
    };

    // Add details in non-production
    if (process.env.NODE_ENV !== 'production') {
        if (details) {
            errorResponse.hata.detaylar = details;
        }
        errorResponse.hata.stack = err.stack;
    }

    // Send response
    res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(404).json({
        basarili: false,
        hata: {
            mesaj: 'API endpoint bulunamadı',
            kod: 'NOT_FOUND',
            yol: req.url
        }
    });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Validation error formatter for express-validator
 */
export const formatValidationErrors = (errors: any[]): any => {
    return errors.reduce((acc, error) => {
        acc[error.path || error.param] = error.msg;
        return acc;
    }, {});
};
