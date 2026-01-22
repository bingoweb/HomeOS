/**
 * Kullanıcı Repository
 * Database operations for users
 */

import { injectable, inject } from 'tsyringe';
import { PrismaClient, Kullanici } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { IKullaniciOlustur, IKullaniciGuncelle } from '../types';
import { NotFoundError, ConflictError } from '../utils/errors';
import bcrypt from 'bcryptjs';

@injectable()
export class KullaniciRepository extends BaseRepository<Kullanici> {
    constructor(@inject('PrismaClient') prisma: PrismaClient) {
        super(prisma, 'kullanici');
    }

    /**
     * Kullanıcı adına göre kullanıcı bul
     */
    async findByKullaniciAdi(kullaniciAdi: string): Promise<Kullanici | null> {
        return await this.findOne({ kullaniciAdi });
    }

    /**
     * Email'e göre kullanıcı bul
     */
    async findByEmail(email: string): Promise<Kullanici | null> {
        return await this.findOne({ email });
    }

    /**
     * Yeni kullanıcı oluştur
     */
    async createKullanici(veri: IKullaniciOlustur): Promise<Kullanici> {
        // Kullanıcı adı kontrolü
        const mevcutKullanici = await this.findByKullaniciAdi(veri.kullaniciAdi);
        if (mevcutKullanici) {
            throw new ConflictError('Bu kullanıcı adı zaten kullanılıyor');
        }

        // Email kontrolü
        if (veri.email) {
            const mevcutEmail = await this.findByEmail(veri.email);
            if (mevcutEmail) {
                throw new ConflictError('Bu email zaten kullanılıyor');
            }
        }

        // Şifreyi hashle
        const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedSifre = await bcrypt.hash(veri.sifre, bcryptRounds);

        // Kullanıcı oluştur
        return await this.create({
            kullaniciAdi: veri.kullaniciAdi,
            sifre: hashedSifre,
            email: veri.email,
            ad: veri.ad,
            soyad: veri.soyad,
            rol: veri.rol || 'kullanici'
        });
    }

    /**
     * Kullanıcı güncelle
     */
    async updateKullanici(id: string, veri: IKullaniciGuncelle): Promise<Kullanici> {
        // Kullanıcı var mı kontrol et
        const kullanici = await this.findById(id);
        if (!kullanici) {
            throw new NotFoundError('Kullanıcı bulunamadı');
        }

        // Email değişikliği varsa kontrol et
        if (veri.email && veri.email !== kullanici.email) {
            const mevcutEmail = await this.findByEmail(veri.email);
            if (mevcutEmail) {
                throw new ConflictError('Bu email zaten kullanılıyor');
            }
        }

        return await this.update(id, veri);
    }

    /**
     * Şifre doğrula
     */
    async validateSifre(kullanici: Kullanici, sifre: string): Promise<boolean> {
        return await bcrypt.compare(sifre, kullanici.sifre);
    }

    /**
     * Şifre değiştir
     */
    async changeSifre(id: string, yeniSifre: string): Promise<Kullanici> {
        const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedSifre = await bcrypt.hash(yeniSifre, bcryptRounds);

        return await this.update(id, {
            sifre: hashedSifre
        });
    }

    /**
     * Başarısız deneme sayısını artır
     */
    async incrementBasarisizDenemeler(id: string): Promise<Kullanici> {
        const kullanici = await this.findById(id);
        if (!kullanici) {
            throw new NotFoundError('Kullanıcı bulunamadı');
        }

        const yeniDenemeSayisi = kullanici.basarisizDenemeler + 1;
        const hesapKilitliMi = yeniDenemeSayisi >= 5;

        return await this.update(id, {
            basarisizDenemeler: yeniDenemeSayisi,
            sonDeneme: new Date(),
            hesapKilitliMi,
            hesapKilitTarihi: hesapKilitliMi ? new Date() : undefined
        });
    }

    /**
     * Başarılı giriş - denemeleri sıfırla
     */
    async resetBasarisizDenemeler(id: string): Promise<Kullanici> {
        return await this.update(id, {
            basarisizDenemeler: 0,
            sonDeneme: null,
            hesapKilitliMi: false,
            hesapKilitTarihi: null,
            sonGirisTarihi: new Date()
        });
    }

    /**
     * Hesap kilitli mi kontrol et
     */
    async isAccountLocked(kullanici: Kullanici): Promise<boolean> {
        if (!kullanici.hesapKilitliMi || !kullanici.hesapKilitTarihi) {
            return false;
        }

        // 15 dakika sonra kilidi aç
        const kilitSuresi = 15 * 60 * 1000; // 15 dakika
        const simdi = new Date().getTime();
        const kilitTarihi = kullanici.hesapKilitTarihi.getTime();

        if (simdi - kilitTarihi > kilitSuresi) {
            // Kilidi aç
            await this.update(kullanici.id, {
                hesapKilitliMi: false,
                hesapKilitTarihi: null,
                basarisizDenemeler: 0
            });
            return false;
        }

        return true;
    }
}
