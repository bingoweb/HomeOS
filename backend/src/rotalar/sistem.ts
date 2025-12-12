import { Router, Request, Response } from 'express';
import { SistemServisi } from '../servisler/SistemServisi';

const router = Router();
const sistemServisi = new SistemServisi();

// Tam sistem bilgisi
router.get('/bilgi', async (req: Request, res: Response) => {
    try {
        const bilgi = await sistemServisi.sistemBilgisiGetir();
        res.json({ basarili: true, veri: bilgi });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Anlık istatistikler (hafif)
router.get('/istatistikler', async (req: Request, res: Response) => {
    try {
        const istatistikler = await sistemServisi.anlikIstatistikleriGetir();
        res.json({ basarili: true, veri: istatistikler });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// İşlem listesi
router.get('/surecler', async (req: Request, res: Response) => {
    try {
        const surecler = await sistemServisi.surecleriGetir();
        res.json({ basarili: true, veri: surecler });
    } catch (hata: any) {
        res.status(500).json({ basarili: false, hata: hata.message });
    }
});

// Sistem yeniden başlat
router.post('/yenidenbaslat', async (req: Request, res: Response) => {
    // Production'da gerçek sistem komutu çalıştırılır
    res.json({
        basarili: true,
        mesaj: 'Sistem yeniden başlatma komutu gönderildi',
        uyari: 'Bu işlem production ortamında sistemi yeniden başlatacaktır'
    });
});

// Sistemi kapat
router.post('/kapat', async (req: Request, res: Response) => {
    // Production'da gerçek sistem komutu çalıştırılır
    res.json({
        basarili: true,
        mesaj: 'Sistem kapatma komutu gönderildi',
        uyari: 'Bu işlem production ortamında sistemi kapatacaktır'
    });
});

export default router;
