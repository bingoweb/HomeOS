/**
 * Dependency Injection Container Configuration
 * Using tsyringe for IoC container
 */

import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

// Repositories
import { KullaniciRepository } from '../repositories/KullaniciRepository';
import { OturumRepository } from '../repositories/OturumRepository';
import { DenetimLoguRepository } from '../repositories/DenetimLoguRepository';

// Initialize Prisma Client
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty'
});

// Register Prisma Client as singleton
container.register('PrismaClient', {
    useValue: prisma
});

// Register Repositories as singletons
container.registerSingleton('KullaniciRepository', KullaniciRepository);
container.registerSingleton('OturumRepository', OturumRepository);
container.registerSingleton('DenetimLoguRepository', DenetimLoguRepository);

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { container, prisma };
