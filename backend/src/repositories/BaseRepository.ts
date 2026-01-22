/**
 * Base Repository
 * Generic repository pattern implementation
 */

import { PrismaClient } from '@prisma/client';
import { DatabaseError } from '../utils/errors';
import logger from '../utils/logger';

export abstract class BaseRepository<T> {
    protected prisma: PrismaClient;
    protected modelName: string;

    constructor(prisma: PrismaClient, modelName: string) {
        this.prisma = prisma;
        this.modelName = modelName;
    }

    /**
     * Find all records with optional filtering
     */
    async findAll(where?: any, orderBy?: any, take?: number, skip?: number): Promise<T[]> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.findMany({
                where,
                orderBy,
                take,
                skip
            });
        } catch (error) {
            logger.error(`${this.modelName} findAll error:`, error);
            throw new DatabaseError(`${this.modelName} kayıtları alınamadı`);
        }
    }

    /**
     * Find one record by ID
     */
    async findById(id: string): Promise<T | null> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.findUnique({
                where: { id }
            });
        } catch (error) {
            logger.error(`${this.modelName} findById error:`, error);
            throw new DatabaseError(`${this.modelName} kaydı bulunamadı`);
        }
    }

    /**
     * Find one record by custom criteria
     */
    async findOne(where: any): Promise<T | null> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.findFirst({
                where
            });
        } catch (error) {
            logger.error(`${this.modelName} findOne error:`, error);
            throw new DatabaseError(`${this.modelName} kaydı bulunamadı`);
        }
    }

    /**
     * Create a new record
     */
    async create(data: any): Promise<T> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.create({
                data
            });
        } catch (error) {
            logger.error(`${this.modelName} create error:`, error);
            throw new DatabaseError(`${this.modelName} kaydı oluşturulamadı`);
        }
    }

    /**
     * Update a record by ID
     */
    async update(id: string, data: any): Promise<T> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.update({
                where: { id },
                data
            });
        } catch (error) {
            logger.error(`${this.modelName} update error:`, error);
            throw new DatabaseError(`${this.modelName} kaydı güncellenemedi`);
        }
    }

    /**
     * Delete a record by ID
     */
    async delete(id: string): Promise<T> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.delete({
                where: { id }
            });
        } catch (error) {
            logger.error(`${this.modelName} delete error:`, error);
            throw new DatabaseError(`${this.modelName} kaydı silinemedi`);
        }
    }

    /**
     * Count records
     */
    async count(where?: any): Promise<number> {
        try {
            const model = (this.prisma as any)[this.modelName];
            return await model.count({
                where
            });
        } catch (error) {
            logger.error(`${this.modelName} count error:`, error);
            throw new DatabaseError(`${this.modelName} sayısı alınamadı`);
        }
    }

    /**
     * Check if record exists
     */
    async exists(where: any): Promise<boolean> {
        try {
            const count = await this.count(where);
            return count > 0;
        } catch (error) {
            logger.error(`${this.modelName} exists error:`, error);
            throw new DatabaseError(`${this.modelName} kontrolü yapılamadı`);
        }
    }
}
