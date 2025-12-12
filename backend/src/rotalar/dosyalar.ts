import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { DosyaServisi } from '../servisler/DosyaServisi';

const router = Router();
const dosyaServisi = new DosyaServisi(os.homedir());

// ============================================
// DOSYA YÜKLEME YAPILANDIRMASI
// ============================================

// Güvenli dosya yükleme ayarları
const depolama = multer.diskStorage({
    destination: (req, dosya, geriCagirma) => {
        const yukleYolu = req.body.yol || '';
        // Path traversal koruması
        const guvenliYol = yukleYolu.replace(/\.\./g, '').replace(/\/\//g, '/');
        geriCagirma(null, path.join(os.homedir(), guvenliYol));
    },
    filename: (req, dosya, geriCagirma) => {
        // Dosya adını temizle
        const temizAd = dosya.originalname
            .replace(/[<>:"\/\\|?*\x00-\x1f]/g, '') // Tehlikeli karakterleri kaldır
            .substring(0, 200); // Uzunluk limiti
        geriCagirma(null, temizAd);
    }
});

// Dosya türü filtresi
const dosyaFiltresi = (req: any, dosya: any, geriCagirma: any) => {
    // Tehlikeli dosya türlerini engelle
    const yasakliUzantilar = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.dll', '.msi'];
    const uzanti = path.extname(dosya.originalname).toLowerCase();

    if (yasakliUzantilar.includes(uzanti)) {
        return geriCagirma(new Error('Bu dosya türü güvenlik nedeniyle engellenmiştir'), false);
    }
    geriCagirma(null, true);
};

const yukleme = multer({
    storage: depolama,
    fileFilter: dosyaFiltresi,
    limits: {
        fileSize: 100 * 1024 * 1024, // Maksimum 100MB
        files: 10 // Tek seferde maksimum 10 dosya
    }
});

// ============================================
// ENDPOINT'LER
// ============================================

// Dizin içeriğini listele
router.get('/listele', async (req: Request, res: Response) => {
    try {
        const dizinYolu = (req.query.yol as string) || '/';
        const dosyalar = await dosyaServisi.dizinListele(dizinYolu);
        res.json({ basarili: true, veri: dosyalar, mevcutYol: dizinYolu });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosya bilgisi al
router.get('/bilgi', async (req: Request, res: Response) => {
    try {
        const dosyaYolu = req.query.yol as string;
        if (!dosyaYolu) {
            return res.status(400).json({ basarili: false, hata: 'Dosya yolu gerekli' });
        }
        const bilgi = await dosyaServisi.dosyaBilgisiGetir(dosyaYolu);
        res.json({ basarili: true, veri: bilgi });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosya içeriği oku
router.get('/oku', async (req: Request, res: Response) => {
    try {
        const dosyaYolu = req.query.yol as string;
        if (!dosyaYolu) {
            return res.status(400).json({ basarili: false, hata: 'Dosya yolu gerekli' });
        }
        const icerik = await dosyaServisi.dosyaOku(dosyaYolu);
        res.json({ basarili: true, veri: icerik });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosyaya yaz
router.post('/yaz', async (req: Request, res: Response) => {
    try {
        const { yol: dosyaYolu, icerik } = req.body;
        if (!dosyaYolu || icerik === undefined) {
            return res.status(400).json({ basarili: false, hata: 'Dosya yolu ve içerik gerekli' });
        }
        await dosyaServisi.dosyaYaz(dosyaYolu, icerik);
        res.json({ basarili: true, mesaj: 'Dosya kaydedildi' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Klasör oluştur
router.post('/klasor-olustur', async (req: Request, res: Response) => {
    try {
        const { yol: dizinYolu } = req.body;
        if (!dizinYolu) {
            return res.status(400).json({ basarili: false, hata: 'Klasör yolu gerekli' });
        }
        await dosyaServisi.klasorOlustur(dizinYolu);
        res.json({ basarili: true, mesaj: 'Klasör oluşturuldu' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosya veya klasör sil
router.delete('/sil', async (req: Request, res: Response) => {
    try {
        const dosyaYolu = req.query.yol as string;
        if (!dosyaYolu) {
            return res.status(400).json({ basarili: false, hata: 'Dosya yolu gerekli' });
        }
        await dosyaServisi.dosyaSil(dosyaYolu);
        res.json({ basarili: true, mesaj: 'Silindi' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Yeniden adlandır
router.post('/yenidenAdlandir', async (req: Request, res: Response) => {
    try {
        const { eskiYol, yeniYol } = req.body;
        if (!eskiYol || !yeniYol) {
            return res.status(400).json({ basarili: false, hata: 'Eski ve yeni yol gerekli' });
        }
        await dosyaServisi.yenidenAdlandir(eskiYol, yeniYol);
        res.json({ basarili: true, mesaj: 'Yeniden adlandırıldı' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Kopyala
router.post('/kopyala', async (req: Request, res: Response) => {
    try {
        const { kaynakYol, hedefYol } = req.body;
        if (!kaynakYol || !hedefYol) {
            return res.status(400).json({ basarili: false, hata: 'Kaynak ve hedef yol gerekli' });
        }
        await dosyaServisi.kopyala(kaynakYol, hedefYol);
        res.json({ basarili: true, mesaj: 'Kopyalandı' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosya ara
router.get('/ara', async (req: Request, res: Response) => {
    try {
        const aramaYolu = (req.query.yol as string) || '/';
        const sorgu = req.query.sorgu as string;
        if (!sorgu) {
            return res.status(400).json({ basarili: false, hata: 'Arama terimi gerekli' });
        }
        const sonuclar = await dosyaServisi.ara(aramaYolu, sorgu);
        res.json({ basarili: true, veri: sonuclar });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Dosya yükle
router.post('/yukle', yukleme.single('dosya'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ basarili: false, hata: 'Dosya gerekli' });
        }
        res.json({
            basarili: true,
            mesaj: 'Dosya yüklendi',
            veri: {
                dosyaAdi: req.file.filename,
                boyut: req.file.size
            }
        });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

export default router;
