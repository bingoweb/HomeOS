/**
 * Denetim Logu Repository
 * Database operations for audit logs
 */

import { injectable, inject } from 'tsyringe';
import { PrismaClient, DenetimLogu } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { IDenetimLogu, IPaginatedResponse } from '../types';

@injectable()
export class DenetimLoguRepository extends BaseRepository<DenetimLogu> {
    constructor(@inject('PrismaClient') prisma: PrismaClient) {
        super(prisma, 'denetimLogu');
    }

    /**
     * Denetim logu oluştur
     */
    async createLog(veri: IDenetimLogu): Promise<DenetimLogu> {
        return await this.create({
            ...veri,
            detay: veri.detay ? JSON.stringify(veri.detay) : undefined
        });
    }

    /**
     * Kullanıcıya ait logları getir
     */
    async findByKullaniciId(
        kullaniciId: string,
        sayfa: number = 1,
        limit: number = 50
    ): Promise<IPaginatedResponse<DenetimLogu>> {
        const skip = (sayfa - 1) * limit;

        const [veriler, toplamKayit] = await Promise.all([
            this.findAll(
                { kullaniciId },
                { olusturulmaTarihi: 'desc' },
                limit,
                skip
            ),
            this.count({ kullaniciId })
        ]);

        return {
            veriler,
            toplamSayfa: Math.ceil(toplamKayit / limit),
            mevcutSayfa: sayfa,
            toplamKayit,
            limit
        };
    }

    /**
     * Aksiyona göre logları getir
     */
    async findByAksiyon(
        aksiyon: string,
        sayfa: number = 1,
        limit: number = 50
    ): Promise<IPaginatedResponse<DenetimLogu>> {
        const skip = (sayfa - 1) * limit;

        const [veriler, toplamKayit] = await Promise.all([
            this.findAll(
                { aksiyon },
                { olusturulmaTarihi: 'desc' },
                limit,
                skip
            ),
            this.count({ aksiyon })
        ]);

        return {
            veriler,
            toplamSayfa: Math.ceil(toplamKayit / limit),
            mevcutSayfa: sayfa,
            toplamKayit,
            limit
        };
    }

    /**
     * Başarısız işlemleri getir
     */
    async findFailedOperations(
        sayfa: number = 1,
        limit: number = 50
    ): Promise<IPaginatedResponse<DenetimLogu>> {
        const skip = (sayfa - 1) * limit;

        const [veriler, toplamKayit] = await Promise.all([
            this.findAll(
                { basarili: false },
                { olusturulmaTarihi: 'desc' },
                limit,
                skip
            ),
            this.count({ basarili: false })
        ]);

        return {
            veriler,
            toplamSayfa: Math.ceil(toplamKayit / limit),
            mevcutSayfa: sayfa,
            toplamKayit,
            limit
        };
    }

    /**
     * Tarih aralığında logları getir
     */
    async findByDateRange(
        baslangic: Date,
        bitis: Date,
        sayfa: number = 1,
        limit: number = 50
    ): Promise<IPaginatedResponse<DenetimLogu>> {
        const skip = (sayfa - 1) * limit;

        const where = {
            olusturulmaTarihi: {
                gte: baslangic,
                lte: bitis
            }
        };

        const [veriler, toplamKayit] = await Promise.all([
            this.findAll(
                where,
                { olusturulmaTarihi: 'desc' },
                limit,
                skip
            ),
            this.count(where)
        ]);

        return {
            veriler,
            toplamSayfa: Math.ceil(toplamKayit / limit),
            mevcutSayfa: sayfa,
            toplamKayit,
            limit
        };
    }

    /**
     * Eski logları temizle (retention policy)
     */
    async cleanOldLogs(gunSayisi: number = 90): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - gunSayisi);

            const result = await this.prisma.denetimLogu.deleteMany({
                where: {
                    olusturulmaTarihi: {
                        lt: cutoffDate
                    }
                }
            });

            return result.count;
        } catch (error) {
            throw error;
        }
    }
}
