import { Router, Request, Response } from 'express';
import { DockerServisi } from '../servisler/DockerServisi';

const router = Router();
const dockerServisi = new DockerServisi();

// ============================================
// KONTEYNER ENDPOINT'LERİ
// ============================================

// Tüm konteynerleri listele
router.get('/konteynerler', async (req: Request, res: Response) => {
    try {
        const hepsi = req.query.hepsi !== 'hayir';
        const konteynerler = await dockerServisi.konteynerleriListele(hepsi);
        res.json({ basarili: true, veri: konteynerler });
    } catch (hata: any) {
        res.status(500).json({
            basarili: false,
            hata: 'Docker bağlantısı kurulamadı. Docker çalışıyor mu?',
            detay: hata.message
        });
    }
});

// Konteyner detayı
router.get('/konteynerler/:id', async (req: Request, res: Response) => {
    try {
        const konteyner = await dockerServisi.konteynerGetir(req.params.id);
        res.json({ basarili: true, veri: konteyner });
    } catch (hata: any) {
        res.status(404).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner istatistikleri
router.get('/konteynerler/:id/istatistikler', async (req: Request, res: Response) => {
    try {
        const istatistikler = await dockerServisi.konteynerIstatistikleriGetir(req.params.id);
        res.json({ basarili: true, veri: istatistikler });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner logları
router.get('/konteynerler/:id/loglar', async (req: Request, res: Response) => {
    try {
        const satir = parseInt(req.query.satir as string) || 100;
        const loglar = await dockerServisi.konteynerLoglariGetir(req.params.id, satir);
        res.json({ basarili: true, veri: loglar });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner başlat
router.post('/konteynerler/:id/baslat', async (req: Request, res: Response) => {
    try {
        await dockerServisi.konteynerBaslat(req.params.id);
        res.json({ basarili: true, mesaj: 'Konteyner başlatıldı' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner durdur
router.post('/konteynerler/:id/durdur', async (req: Request, res: Response) => {
    try {
        await dockerServisi.konteynerDurdur(req.params.id);
        res.json({ basarili: true, mesaj: 'Konteyner durduruldu' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner yeniden başlat
router.post('/konteynerler/:id/yenidenbaslat', async (req: Request, res: Response) => {
    try {
        await dockerServisi.konteynerYenidenBaslat(req.params.id);
        res.json({ basarili: true, mesaj: 'Konteyner yeniden başlatıldı' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Konteyner sil
router.delete('/konteynerler/:id', async (req: Request, res: Response) => {
    try {
        const zorla = req.query.zorla === 'evet';
        await dockerServisi.konteynerSil(req.params.id, zorla);
        res.json({ basarili: true, mesaj: 'Konteyner silindi' });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// ============================================
// İMAJ ENDPOINT'LERİ
// ============================================

// İmajları listele
router.get('/imajlar', async (req: Request, res: Response) => {
    try {
        const imajlar = await dockerServisi.imajlariListele();
        res.json({ basarili: true, veri: imajlar });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// İmaj indir
router.post('/imajlar/indir', async (req: Request, res: Response) => {
    try {
        const { imaj } = req.body;
        if (!imaj) {
            return res.status(400).json({ basarili: false, hata: 'İmaj adı gerekli' });
        }
        await dockerServisi.imajIndir(imaj);
        res.json({ basarili: true, mesaj: `${imaj} indirildi` });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// ============================================
// SİSTEM ENDPOINT'LERİ
// ============================================

// Docker bilgisi
router.get('/bilgi', async (req: Request, res: Response) => {
    try {
        const bilgi = await dockerServisi.bilgiGetir();
        res.json({ basarili: true, veri: bilgi });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Docker sürümü
router.get('/surum', async (req: Request, res: Response) => {
    try {
        const surum = await dockerServisi.surumGetir();
        res.json({ basarili: true, veri: surum });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

export default router;
