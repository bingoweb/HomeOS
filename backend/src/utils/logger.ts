/**
 * Winston Logger Configuration
 * Structured logging with file and console transports
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Log dizinini oluştur
const logDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Log formatları
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr = '';
        if (Object.keys(meta).length > 0) {
            metaStr = '\n' + JSON.stringify(meta, null, 2);
        }
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

// Logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'homeos-backend' },
    transports: [
        // Hata logları
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5,
            tailable: true
        }),
        // Birleşik loglar
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 10485760, // 10MB
            maxFiles: 10,
            tailable: true
        }),
        // Audit logları (güvenlik olayları)
        new winston.transports.File({
            filename: path.join(logDir, 'audit.log'),
            level: 'info',
            maxsize: 10485760,
            maxFiles: 10
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log')
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log')
        })
    ]
});

// Development'ta console log ekle
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
        level: 'debug'
    }));
}

// Yardımcı fonksiyonlar
export const logAudit = (
    kullaniciId: string | undefined,
    aksiyon: string,
    kaynak: string,
    detay?: any,
    ipAdresi?: string,
    basarili: boolean = true
) => {
    logger.info('AUDIT', {
        kullaniciId,
        aksiyon,
        kaynak,
        detay: detay ? JSON.stringify(detay) : undefined,
        ipAdresi,
        basarili,
        zaman: new Date().toISOString()
    });
};

export const logError = (
    hata: Error,
    context?: any
) => {
    logger.error('ERROR', {
        mesaj: hata.message,
        stack: hata.stack,
        ...context
    });
};

export const logPerformance = (
    islem: string,
    sure: number,
    detay?: any
) => {
    logger.info('PERFORMANCE', {
        islem,
        sure_ms: sure,
        ...detay
    });
};

export default logger;
