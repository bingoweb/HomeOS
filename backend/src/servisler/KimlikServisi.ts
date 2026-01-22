/**
 * Kimlik Servisi
 * Authentication and authorization business logic
 */

import { injectable, inject } from 'tsyringe';
import { KullaniciRepository } from '../repositories/KullaniciRepository';
import { OturumRepository } from '../repositories/OturumRepository';
import { DenetimLoguRepository } from '../repositories/DenetimLoguRepository';
import { IGirisYap, IGirisYapCevap, ISifreDegistir, IJWTPayload } from '../types';
import { AuthenticationError, ValidationError, TooManyRequestsError } from '../utils/errors';
import { generateTokens } from '../middleware/auth';
import logger, { logAudit } from '../utils/logger';

@injectable()
export class KimlikServisi {
    constructor(
        @inject('KullaniciRepository') private kullaniciRepo: KullaniciRepository,
        @inject('OturumRepository') private oturumRepo: OturumRepository,
        @inject('DenetimLoguRepository') private denetimRepo: DenetimLoguRepository
    ) {}

    /**
     * Kullanıcı girişi
     */
    async girisYap(
        veri: IGirisYap,
        ipAdresi?: string,
        userAgent?: string
    ): Promise<IGirisYapCevap> {
        try {
            // Kullanıcıyı bul
            const kullanici = await this.kullaniciRepo.findByKullaniciAdi(veri.kullaniciAdi);

            // Timing attack önleme - kullanıcı yoksa bile aynı sürede cevap ver
            if (!kullanici) {
                // Dummy bcrypt işlemi
                await this.kullaniciRepo.validateSifre(
                    { sifre: '$2a$12$dummyhashfordummyuser' } as any,
                    veri.sifre
                );

                // Audit log
                await this.denetimRepo.createLog({
                    aksiyon: 'giris_basarisiz',
                    kaynak: 'kimlik',
                    detay: { kullaniciAdi: veri.kullaniciAdi, sebep: 'kullanici_bulunamadi' },
                    ipAdresi,
                    userAgent,
                    basarili: false
                });

                throw new AuthenticationError('Kullanıcı adı veya şifre hatalı');
            }

            // Kullanıcı aktif mi?
            if (!kullanici.aktif) {
                await this.denetimRepo.createLog({
                    kullaniciId: kullanici.id,
                    aksiyon: 'giris_basarisiz',
                    kaynak: 'kimlik',
                    detay: { sebep: 'hesap_pasif' },
                    ipAdresi,
                    userAgent,
                    basarili: false
                });

                throw new AuthenticationError('Hesabınız pasif durumda');
            }

            // Hesap kilitli mi?
            const kilitliMi = await this.kullaniciRepo.isAccountLocked(kullanici);
            if (kilitliMi) {
                await this.denetimRepo.createLog({
                    kullaniciId: kullanici.id,
                    aksiyon: 'giris_basarisiz',
                    kaynak: 'kimlik',
                    detay: { sebep: 'hesap_kilitli' },
                    ipAdresi,
                    userAgent,
                    basarili: false
                });

                throw new TooManyRequestsError('Hesabınız kilitlendi. Lütfen 15 dakika sonra tekrar deneyin');
            }

            // Şifre doğrulama
            const sifreDogruMu = await this.kullaniciRepo.validateSifre(kullanici, veri.sifre);

            if (!sifreDogruMu) {
                // Başarısız deneme sayısını artır
                await this.kullaniciRepo.incrementBasarisizDenemeler(kullanici.id);

                await this.denetimRepo.createLog({
                    kullaniciId: kullanici.id,
                    aksiyon: 'giris_basarisiz',
                    kaynak: 'kimlik',
                    detay: { sebep: 'yanlis_sifre' },
                    ipAdresi,
                    userAgent,
                    basarili: false
                });

                throw new AuthenticationError('Kullanıcı adı veya şifre hatalı');
            }

            // Başarılı giriş - denemeleri sıfırla
            await this.kullaniciRepo.resetBasarisizDenemeler(kullanici.id);

            // Token üret
            const payload: IJWTPayload = {
                id: kullanici.id,
                kullaniciAdi: kullanici.kullaniciAdi,
                rol: kullanici.rol
            };

            const { accessToken, refreshToken } = generateTokens(payload);

            // Oturum oluştur
            const sonlanmaTarihi = new Date();
            sonlanmaTarihi.setDate(sonlanmaTarihi.getDate() + 7); // 7 gün

            await this.oturumRepo.createOturum({
                kullaniciId: kullanici.id,
                token: accessToken,
                refreshToken,
                ipAdresi,
                userAgent,
                sonlanmaTarihi
            });

            // Audit log
            await this.denetimRepo.createLog({
                kullaniciId: kullanici.id,
                aksiyon: 'giris_basarili',
                kaynak: 'kimlik',
                ipAdresi,
                userAgent,
                basarili: true
            });

            logger.info('Kullanıcı girişi başarılı', {
                kullaniciId: kullanici.id,
                kullaniciAdi: kullanici.kullaniciAdi,
                ipAdresi
            });

            return {
                kullanici: {
                    id: kullanici.id,
                    kullaniciAdi: kullanici.kullaniciAdi,
                    email: kullanici.email || undefined,
                    ad: kullanici.ad || undefined,
                    soyad: kullanici.soyad || undefined,
                    rol: kullanici.rol,
                    aktif: kullanici.aktif,
                    olusturulmaTarihi: kullanici.olusturulmaTarihi,
                    sonGirisTarihi: kullanici.sonGirisTarihi || undefined
                },
                token: accessToken,
                refreshToken
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Kullanıcı çıkışı
     */
    async cikisYap(token: string, kullaniciId: string, ipAdresi?: string): Promise<void> {
        try {
            // Oturumu sonlandır
            await this.oturumRepo.terminateByToken(token);

            // Audit log
            await this.denetimRepo.createLog({
                kullaniciId,
                aksiyon: 'cikis',
                kaynak: 'kimlik',
                ipAdresi,
                basarili: true
            });

            logger.info('Kullanıcı çıkışı', { kullaniciId, ipAdresi });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Şifre değiştir
     */
    async sifreDegistir(
        kullaniciId: string,
        veri: ISifreDegistir,
        ipAdresi?: string
    ): Promise<void> {
        try {
            // Kullanıcıyı bul
            const kullanici = await this.kullaniciRepo.findById(kullaniciId);
            if (!kullanici) {
                throw new AuthenticationError('Kullanıcı bulunamadı');
            }

            // Eski şifreyi doğrula
            const eskiSifreDogruMu = await this.kullaniciRepo.validateSifre(
                kullanici,
                veri.eskiSifre
            );

            if (!eskiSifreDogruMu) {
                await this.denetimRepo.createLog({
                    kullaniciId,
                    aksiyon: 'sifre_degistirme_basarisiz',
                    kaynak: 'kimlik',
                    detay: { sebep: 'yanlis_eski_sifre' },
                    ipAdresi,
                    basarili: false
                });

                throw new AuthenticationError('Eski şifre hatalı');
            }

            // Yeni şifre validasyonu
            if (veri.yeniSifre.length < 8) {
                throw new ValidationError('Şifre en az 8 karakter olmalıdır');
            }

            if (!/[A-Z]/.test(veri.yeniSifre)) {
                throw new ValidationError('Şifre en az bir büyük harf içermelidir');
            }

            if (!/[0-9]/.test(veri.yeniSifre)) {
                throw new ValidationError('Şifre en az bir rakam içermelidir');
            }

            // Şifreyi değiştir
            await this.kullaniciRepo.changeSifre(kullaniciId, veri.yeniSifre);

            // Tüm oturumları sonlandır (güvenlik için)
            await this.oturumRepo.terminateAllByKullaniciId(kullaniciId);

            // Audit log
            await this.denetimRepo.createLog({
                kullaniciId,
                aksiyon: 'sifre_degistirme',
                kaynak: 'kimlik',
                ipAdresi,
                basarili: true
            });

            logger.info('Şifre değiştirildi', { kullaniciId, ipAdresi });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Token yenile (refresh)
     */
    async refreshToken(refreshToken: string): Promise<IGirisYapCevap> {
        try {
            // Refresh token ile oturumu bul
            const oturum = await this.oturumRepo.findByRefreshToken(refreshToken);

            if (!oturum || !oturum.aktif) {
                throw new AuthenticationError('Geçersiz refresh token');
            }

            // Kullanıcıyı bul
            const kullanici = await this.kullaniciRepo.findById(oturum.kullaniciId);
            if (!kullanici || !kullanici.aktif) {
                throw new AuthenticationError('Kullanıcı bulunamadı veya pasif');
            }

            // Yeni tokenlar üret
            const payload: IJWTPayload = {
                id: kullanici.id,
                kullaniciAdi: kullanici.kullaniciAdi,
                rol: kullanici.rol
            };

            const tokens = generateTokens(payload);

            // Eski oturumu sonlandır
            await this.oturumRepo.terminateOturum(oturum.id);

            // Yeni oturum oluştur
            const sonlanmaTarihi = new Date();
            sonlanmaTarihi.setDate(sonlanmaTarihi.getDate() + 7);

            await this.oturumRepo.createOturum({
                kullaniciId: kullanici.id,
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                ipAdresi: oturum.ipAdresi,
                userAgent: oturum.userAgent,
                sonlanmaTarihi
            });

            return {
                kullanici: {
                    id: kullanici.id,
                    kullaniciAdi: kullanici.kullaniciAdi,
                    email: kullanici.email || undefined,
                    ad: kullanici.ad || undefined,
                    soyad: kullanici.soyad || undefined,
                    rol: kullanici.rol,
                    aktif: kullanici.aktif,
                    olusturulmaTarihi: kullanici.olusturulmaTarihi,
                    sonGirisTarihi: kullanici.sonGirisTarihi || undefined
                },
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            throw error;
        }
    }
}
