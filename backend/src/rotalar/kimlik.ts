import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

const router = Router();

// ============================================
// YAPILANDIRMA
// ============================================

// Güvenlik: Minimum 12 round bcrypt
const BCRYPT_ROUND = 12;

// Güvenlik: Token ömrü (7 gün)
const TOKEN_SURESI = '7d';

// Güvenlik: Minimum şifre uzunluğu
const MIN_SIFRE_UZUNLUGU = 8;

// Kullanıcı deposu (production'da veritabanı kullanılmalı)
const kullanicilar: { [key: string]: { sifre: string; rol: string; basarisizDenemeler: number; sonDeneme: number } } = {
    admin: {
        sifre: bcrypt.hashSync('admin123', BCRYPT_ROUND),
        rol: 'yonetici',
        basarisizDenemeler: 0,
        sonDeneme: 0
    }
};

const JWT_GIZLI_ANAHTAR = process.env.JWT_SECRET || 'homeos-cok-gizli-anahtar-degistirin';

// ============================================
// DOĞRULAMA KURALLARI
// ============================================

const girisDogrulama = [
    body('kullaniciAdi')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Kullanıcı adı 3-50 karakter olmalı')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
    body('sifre')
        .notEmpty()
        .withMessage('Şifre gerekli')
];

const sifreDogrulama = [
    body('yeniSifre')
        .isLength({ min: MIN_SIFRE_UZUNLUGU })
        .withMessage(`Şifre en az ${MIN_SIFRE_UZUNLUGU} karakter olmalı`)
        .matches(/[A-Z]/)
        .withMessage('Şifre en az bir büyük harf içermeli')
        .matches(/[0-9]/)
        .withMessage('Şifre en az bir rakam içermeli')
];

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

/**
 * Hesap kilitleme kontrolü
 * 5 başarısız denemeden sonra 15 dakika kilitle
 */
function hesapKilitliMi(kullaniciAdi: string): boolean {
    const kullanici = kullanicilar[kullaniciAdi];
    if (!kullanici) return false;

    const simdi = Date.now();
    const kilitSuresi = 15 * 60 * 1000; // 15 dakika

    if (kullanici.basarisizDenemeler >= 5) {
        if (simdi - kullanici.sonDeneme < kilitSuresi) {
            return true;
        }
        // Kilit süresi doldu, sıfırla
        kullanici.basarisizDenemeler = 0;
    }

    return false;
}

/**
 * Başarısız giriş denemesini kaydet
 */
function basarisizDenemeKaydet(kullaniciAdi: string): void {
    if (kullanicilar[kullaniciAdi]) {
        kullanicilar[kullaniciAdi].basarisizDenemeler++;
        kullanicilar[kullaniciAdi].sonDeneme = Date.now();
    }
}

/**
 * Başarılı girişte deneme sayacını sıfırla
 */
function basariliGirisSonrasi(kullaniciAdi: string): void {
    if (kullanicilar[kullaniciAdi]) {
        kullanicilar[kullaniciAdi].basarisizDenemeler = 0;
    }
}

// ============================================
// ENDPOINT'LER
// ============================================

// Giriş
router.post('/giris', girisDogrulama, async (req: Request, res: Response) => {
    // Validasyon hatalarını kontrol et
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        return res.status(400).json({
            basarili: false,
            hata: hatalar.array()[0].msg
        });
    }

    try {
        const { kullaniciAdi, sifre } = req.body;

        // Hesap kilidi kontrolü
        if (hesapKilitliMi(kullaniciAdi)) {
            return res.status(423).json({
                basarili: false,
                hata: 'Hesap geçici olarak kilitlendi. Lütfen 15 dakika sonra tekrar deneyin.'
            });
        }

        const kullanici = kullanicilar[kullaniciAdi];
        if (!kullanici) {
            // Timing attack'a karşı sabit süre bekleme
            await bcrypt.compare(sifre, '$2a$12$dummy.hash.to.prevent.timing.attacks');
            return res.status(401).json({
                basarili: false,
                hata: 'Geçersiz kullanıcı adı veya şifre'
            });
        }

        const sifreGecerli = await bcrypt.compare(sifre, kullanici.sifre);
        if (!sifreGecerli) {
            basarisizDenemeKaydet(kullaniciAdi);
            return res.status(401).json({
                basarili: false,
                hata: 'Geçersiz kullanıcı adı veya şifre'
            });
        }

        // Başarılı giriş
        basariliGirisSonrasi(kullaniciAdi);

        const token = jwt.sign(
            { kullaniciAdi, rol: kullanici.rol },
            JWT_GIZLI_ANAHTAR,
            { expiresIn: TOKEN_SURESI }
        );

        // Güvenlik: Token sadece httpOnly cookie ile de gönderilebilir
        res.json({
            basarili: true,
            veri: {
                token,
                kullanici: { kullaniciAdi, rol: kullanici.rol }
            }
        });
    } catch (hata: any) {
        console.error('Giriş hatası:', hata);
        res.status(500).json({ basarili: false, hata: 'Sunucu hatası' });
    }
});

// Token doğrula
router.get('/dogrula', async (req: Request, res: Response) => {
    try {
        const yetkilendirmeBasligi = req.headers.authorization;
        if (!yetkilendirmeBasligi || !yetkilendirmeBasligi.startsWith('Bearer ')) {
            return res.status(401).json({ basarili: false, hata: 'Token gerekli' });
        }

        const token = yetkilendirmeBasligi.split(' ')[1];
        const cozulmus = jwt.verify(token, JWT_GIZLI_ANAHTAR) as { kullaniciAdi: string; rol: string };

        res.json({
            basarili: true,
            veri: { kullaniciAdi: cozulmus.kullaniciAdi, rol: cozulmus.rol }
        });
    } catch (hata) {
        res.status(401).json({ basarili: false, hata: 'Geçersiz veya süresi dolmuş token' });
    }
});

// Şifre değiştir
router.post('/sifre-degistir', sifreDogrulama, async (req: Request, res: Response) => {
    // Validasyon hatalarını kontrol et
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        return res.status(400).json({
            basarili: false,
            hata: hatalar.array()[0].msg
        });
    }

    try {
        const { kullaniciAdi, mevcutSifre, yeniSifre } = req.body;

        if (!kullaniciAdi || !mevcutSifre || !yeniSifre) {
            return res.status(400).json({
                basarili: false,
                hata: 'Tüm alanlar gerekli'
            });
        }

        const kullanici = kullanicilar[kullaniciAdi];
        if (!kullanici) {
            return res.status(404).json({ basarili: false, hata: 'Kullanıcı bulunamadı' });
        }

        const sifreGecerli = await bcrypt.compare(mevcutSifre, kullanici.sifre);
        if (!sifreGecerli) {
            return res.status(401).json({ basarili: false, hata: 'Mevcut şifre yanlış' });
        }

        // Yeni şifre eski şifreyle aynı olmamalı
        const ayniSifre = await bcrypt.compare(yeniSifre, kullanici.sifre);
        if (ayniSifre) {
            return res.status(400).json({ basarili: false, hata: 'Yeni şifre mevcut şifreyle aynı olamaz' });
        }

        kullanicilar[kullaniciAdi].sifre = await bcrypt.hash(yeniSifre, BCRYPT_ROUND);
        res.json({ basarili: true, mesaj: 'Şifre başarıyla değiştirildi' });
    } catch (hata: any) {
        console.error('Şifre değiştirme hatası:', hata);
        res.status(500).json({ basarili: false, hata: 'Sunucu hatası' });
    }
});

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Rota koruma middleware'i
 */
export const kimlikDogrulamaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const yetkilendirmeBasligi = req.headers.authorization;
        if (!yetkilendirmeBasligi || !yetkilendirmeBasligi.startsWith('Bearer ')) {
            return res.status(401).json({ basarili: false, hata: 'Yetkilendirme gerekli' });
        }

        const token = yetkilendirmeBasligi.split(' ')[1];
        const cozulmus = jwt.verify(token, JWT_GIZLI_ANAHTAR);
        (req as any).kullanici = cozulmus;
        next();
    } catch (hata) {
        res.status(401).json({ basarili: false, hata: 'Geçersiz veya süresi dolmuş token' });
    }
};

export default router;
