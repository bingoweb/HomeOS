/**
 * Oturum Repository
 * Database operations for sessions
 */

import { injectable, inject } from 'tsyringe';
import { PrismaClient, Oturum } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { IOturumOlustur } from '../types';
import { NotFoundError } from '../utils/errors';

@injectable()
export class OturumRepository extends BaseRepository<Oturum> {
    constructor(@inject('PrismaClient') prisma: PrismaClient) {
        super(prisma, 'oturum');
    }

    /**
     * Token'a göre oturum bul
     */
    async findByToken(token: string): Promise<Oturum | null> {
        return await this.findOne({ token, aktif: true });
    }

    /**
     * Refresh token'a göre oturum bul
     */
    async findByRefreshToken(refreshToken: string): Promise<Oturum | null> {
        return await this.findOne({ refreshToken, aktif: true });
    }

    /**
     * Kullanıcıya ait aktif oturumları getir
     */
    async findActiveByKullaniciId(kullaniciId: string): Promise<Oturum[]> {
        return await this.findAll(
            { kullaniciId, aktif: true },
            { sonAktivite: 'desc' }
        );
    }

    /**
     * Yeni oturum oluştur
     */
    async createOturum(veri: IOturumOlustur): Promise<Oturum> {
        return await this.create(veri);
    }

    /**
     * Oturum son aktivite zamanını güncelle
     */
    async updateSonAktivite(id: string): Promise<Oturum> {
        return await this.update(id, {
            sonAktivite: new Date()
        });
    }

    /**
     * Oturumu sonlandır
     */
    async terminateOturum(id: string): Promise<Oturum> {
        return await this.update(id, {
            aktif: false
        });
    }

    /**
     * Token ile oturumu sonlandır
     */
    async terminateByToken(token: string): Promise<void> {
        const oturum = await this.findByToken(token);
        if (oturum) {
            await this.terminateOturum(oturum.id);
        }
    }

    /**
     * Kullanıcının tüm oturumlarını sonlandır
     */
    async terminateAllByKullaniciId(kullaniciId: string): Promise<void> {
        const oturumlar = await this.findActiveByKullaniciId(kullaniciId);
        for (const oturum of oturumlar) {
            await this.terminateOturum(oturum.id);
        }
    }

    /**
     * Süresi dolmuş oturumları temizle
     */
    async cleanExpiredSessions(): Promise<number> {
        try {
            const simdi = new Date();
            const result = await this.prisma.oturum.updateMany({
                where: {
                    sonlanmaTarihi: {
                        lt: simdi
                    },
                    aktif: true
                },
                data: {
                    aktif: false
                }
            });
            return result.count;
        } catch (error) {
            throw error;
        }
    }
}
