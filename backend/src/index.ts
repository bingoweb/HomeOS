import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Rotalar
import dockerRotalar from './rotalar/docker';
import sistemRotalar from './rotalar/sistem';
import dosyaRotalar from './rotalar/dosyalar';
import kimlikRotalar from './rotalar/kimlik';

// Servisler
import { SistemServisi } from './servisler/SistemServisi';

// Ortam değişkenlerini yükle
dotenv.config();

const uygulama = express();
const PORT = process.env.PORT || 3001;

// ============================================
// GÜVENLİK MIDDLEWARE'LERİ
// ============================================

// Helmet - HTTP başlıkları güvenliği
uygulama.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS yapılandırması
uygulama.use(cors({
    origin: process.env.IZIN_VERILEN_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting - DDoS koruması
const istekLimiti = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Her IP için 15 dakikada maksimum 100 istek
    message: {
        basarili: false,
        hata: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
uygulama.use('/api/', istekLimiti);

// Giriş için daha sıkı limit
const girisLimiti = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 5, // Her IP için saatte maksimum 5 başarısız giriş denemesi
    message: {
        basarili: false,
        hata: 'Çok fazla başarısız giriş denemesi. Lütfen 1 saat sonra tekrar deneyin.',
    },
});
uygulama.use('/api/kimlik/giris', girisLimiti);

// JSON ve URL-encoded body parser
uygulama.use(express.json({ limit: '10mb' }));
uygulama.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// API ROTALARI
// ============================================

uygulama.use('/api/docker', dockerRotalar);
uygulama.use('/api/sistem', sistemRotalar);
uygulama.use('/api/dosyalar', dosyaRotalar);
uygulama.use('/api/kimlik', kimlikRotalar);

// Sağlık kontrolü
uygulama.get('/api/saglik', (req, res) => {
    res.json({
        durum: 'calisiyor',
        zamanDamgasi: new Date().toISOString(),
        surum: '1.0.0'
    });
});

// 404 hatası
uygulama.use((req, res) => {
    res.status(404).json({
        basarili: false,
        hata: 'İstenen kaynak bulunamadı'
    });
});

// Hata yakalama middleware
uygulama.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Hassas hata bilgilerini loglama (production'da gizle)
    if (process.env.NODE_ENV !== 'production') {
        console.error('Hata:', err);
    }

    res.status(err.status || 500).json({
        basarili: false,
        hata: process.env.NODE_ENV === 'production'
            ? 'Sunucu hatası oluştu'
            : err.message
    });
});

// HTTP sunucusu oluştur
const sunucu = createServer(uygulama);

// WebSocket sunucusu (gerçek zamanlı güncellemeler için)
const wss = new WebSocketServer({ server: sunucu, path: '/ws' });

const sistemServisi = new SistemServisi();

wss.on('connection', (ws) => {
    console.log('🔌 WebSocket istemcisi bağlandı');

    // Her 2 saniyede sistem istatistiklerini gönder
    const aralik = setInterval(async () => {
        try {
            const istatistikler = await sistemServisi.anlikIstatistikleriGetir();
            ws.send(JSON.stringify({ tip: 'sistem-istatistikleri', veri: istatistikler }));
        } catch (hata) {
            console.error('İstatistik gönderme hatası:', hata);
        }
    }, 2000);

    ws.on('close', () => {
        console.log('🔌 WebSocket istemcisi bağlantısı kesildi');
        clearInterval(aralik);
    });

    ws.on('error', (hata) => {
        console.error('WebSocket hatası:', hata);
        clearInterval(aralik);
    });
});

// Sunucuyu başlat
sunucu.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🏠 HomeOS Backend API                       ║
  ║   ─────────────────────────────────────────   ║
  ║   🚀 Sunucu ${PORT} portunda çalışıyor          ║
  ║   📡 WebSocket: /ws                           ║
  ║   🔗 API: /api                                ║
  ║   🛡️  Güvenlik: Helmet + Rate Limit aktif     ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

export default uygulama;
