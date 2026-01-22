/**
 * Authentication Middleware
 * JWT verification and user authentication with HttpOnly cookies
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, IJWTPayload } from '../types';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { container } from '../config/container';
import { OturumRepository } from '../repositories/OturumRepository';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

/**
 * JWT doğrulama middleware
 */
export const authenticateJWT = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Token'ı cookie'den al (öncelikli)
        let token = req.cookies?.accessToken;

        // Cookie yoksa header'dan dene (backward compatibility)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            throw new AuthenticationError('Token bulunamadı');
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET) as IJWTPayload;

        // Oturum kontrolü
        const oturumRepo = container.resolve<OturumRepository>('OturumRepository');
        const oturum = await oturumRepo.findByToken(token);

        if (!oturum || !oturum.aktif) {
            throw new AuthenticationError('Geçersiz veya süresi dolmuş oturum');
        }

        // Oturum son aktivite zamanını güncelle
        await oturumRepo.updateSonAktivite(oturum.id);

        // Kullanıcı bilgisini request'e ekle
        req.kullanici = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AuthenticationError('Geçersiz token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new AuthenticationError('Token süresi dolmuş'));
        } else {
            next(error);
        }
    }
};

/**
 * Rol tabanlı yetkilendirme middleware
 */
export const authorize = (...roller: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.kullanici) {
            return next(new AuthenticationError('Kimlik doğrulanmamış'));
        }

        if (!roller.includes(req.kullanici.rol)) {
            return next(new AuthorizationError('Bu işlem için yetkiniz bulunmuyor'));
        }

        next();
    };
};

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as IJWTPayload;
            req.kullanici = decoded;
        }

        next();
    } catch (error) {
        // Optional auth - just continue without user
        next();
    }
};

/**
 * Token generator
 */
export const generateTokens = (
    payload: IJWTPayload
): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
        { id: payload.id },
        JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Set auth cookies
 */
export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction || process.env.COOKIE_SECURE === 'true',
        sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'strict' | 'lax' | 'none',
        path: '/'
    };

    // Access token cookie (7 days)
    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Refresh token cookie (30 days)
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

/**
 * Clear auth cookies
 */
export const clearAuthCookies = (res: Response) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
};
