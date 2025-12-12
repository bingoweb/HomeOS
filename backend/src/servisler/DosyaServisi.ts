import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// ============================================
// TİP TANIMLARI
// ============================================

export interface DosyaBilgisi {
    ad: string;
    yol: string;
    tip: 'dosya' | 'klasor';
    boyut: number;
    degistirilme: Date;
    izinler: string;
}

// ============================================
// DOSYA SERVİSİ
// ============================================

export class DosyaServisi {
    private temelYol: string;

    // Erişimi yasaklanmış dizinler (güvenlik)
    private yasakliYollar: string[] = [
        '/etc/shadow',
        '/etc/passwd',
        '/root',
        '/.ssh',
        '/var/log/auth',
    ];

    constructor(temelYol?: string) {
        this.temelYol = temelYol || os.homedir();
    }

    /**
     * Yolu normalize eder ve güvenlik kontrolü yapar
     * Path traversal saldırılarını önler
     */
    private yoluNormalize(girilenYol: string): string {
        // Tehlikeli karakterleri temizle
        const temizYol = girilenYol
            .replace(/\.\./g, '') // Path traversal önleme
            .replace(/\/\//g, '/') // Çift slash temizle
            .replace(/[\x00-\x1f]/g, ''); // Kontrol karakterlerini temizle

        const cozulmusYol = path.resolve(this.temelYol, temizYol);

        // Temel dizin dışına çıkmaya izin verme
        if (!cozulmusYol.startsWith(this.temelYol)) {
            throw new Error('Erişim reddedildi: Bu konuma erişim izniniz yok');
        }

        // Yasaklı yolları kontrol et
        for (const yasakli of this.yasakliYollar) {
            if (cozulmusYol.includes(yasakli)) {
                throw new Error('Erişim reddedildi: Bu konum güvenlik nedeniyle yasaklanmış');
            }
        }

        return cozulmusYol;
    }

    /**
     * Dizin içeriğini listeler
     */
    async dizinListele(dizinYolu: string = '/'): Promise<DosyaBilgisi[]> {
        const tamYol = this.yoluNormalize(dizinYolu);
        const girişler = await fs.readdir(tamYol, { withFileTypes: true });

        const dosyalar: DosyaBilgisi[] = [];

        for (const giris of girişler) {
            // Gizli dosyaları göster ama tehlikeli olanları gizle
            if (giris.name.startsWith('.ssh') || giris.name.includes('secret')) {
                continue;
            }

            try {
                const girisYolu = path.join(tamYol, giris.name);
                const istatistikler = await fs.stat(girisYolu);

                dosyalar.push({
                    ad: giris.name,
                    yol: path.relative(this.temelYol, girisYolu),
                    tip: giris.isDirectory() ? 'klasor' : 'dosya',
                    boyut: istatistikler.size,
                    degistirilme: istatistikler.mtime,
                    izinler: istatistikler.mode.toString(8).slice(-3)
                });
            } catch (hata) {
                // Erişilemeyen dosyaları atla
                console.warn(`${giris.name} dosyasına erişilemiyor`);
            }
        }

        // Klasörleri önce, sonra alfabetik sırala
        return dosyalar.sort((a, b) => {
            if (a.tip !== b.tip) {
                return a.tip === 'klasor' ? -1 : 1;
            }
            return a.ad.localeCompare(b.ad, 'tr');
        });
    }

    /**
     * Dosya içeriğini okur
     * Güvenlik: Sadece metin dosyaları ve boyut limiti
     */
    async dosyaOku(dosyaYolu: string): Promise<string> {
        const tamYol = this.yoluNormalize(dosyaYolu);

        // Dosya boyutunu kontrol et (max 5MB)
        const istatistikler = await fs.stat(tamYol);
        if (istatistikler.size > 5 * 1024 * 1024) {
            throw new Error('Dosya çok büyük (maksimum 5MB)');
        }

        // Binary dosyaları engelle
        const uzanti = path.extname(tamYol).toLowerCase();
        const yasakliUzantilar = ['.exe', '.dll', '.bin', '.so', '.dmg', '.iso'];
        if (yasakliUzantilar.includes(uzanti)) {
            throw new Error('Bu dosya türü okunamaz');
        }

        return fs.readFile(tamYol, 'utf-8');
    }

    /**
     * Dosyaya yazar
     */
    async dosyaYaz(dosyaYolu: string, icerik: string): Promise<void> {
        const tamYol = this.yoluNormalize(dosyaYolu);

        // İçerik boyutunu sınırla (max 10MB)
        if (icerik.length > 10 * 1024 * 1024) {
            throw new Error('İçerik çok büyük (maksimum 10MB)');
        }

        await fs.writeFile(tamYol, icerik, 'utf-8');
    }

    /**
     * Yeni klasör oluşturur
     */
    async klasorOlustur(dizinYolu: string): Promise<void> {
        const tamYol = this.yoluNormalize(dizinYolu);
        await fs.mkdir(tamYol, { recursive: true });
    }

    /**
     * Dosya veya klasör siler
     */
    async dosyaSil(dosyaYolu: string): Promise<void> {
        const tamYol = this.yoluNormalize(dosyaYolu);
        const istatistikler = await fs.stat(tamYol);

        if (istatistikler.isDirectory()) {
            await fs.rm(tamYol, { recursive: true });
        } else {
            await fs.unlink(tamYol);
        }
    }

    /**
     * Dosya veya klasör adını değiştirir
     */
    async yenidenAdlandir(eskiYol: string, yeniYol: string): Promise<void> {
        const tamEskiYol = this.yoluNormalize(eskiYol);
        const tamYeniYol = this.yoluNormalize(yeniYol);
        await fs.rename(tamEskiYol, tamYeniYol);
    }

    /**
     * Dosya veya klasör kopyalar
     */
    async kopyala(kaynakYol: string, hedefYol: string): Promise<void> {
        const tamKaynakYol = this.yoluNormalize(kaynakYol);
        const tamHedefYol = this.yoluNormalize(hedefYol);
        await fs.cp(tamKaynakYol, tamHedefYol, { recursive: true });
    }

    /**
     * Dosya bilgisini getirir
     */
    async dosyaBilgisiGetir(dosyaYolu: string): Promise<DosyaBilgisi> {
        const tamYol = this.yoluNormalize(dosyaYolu);
        const istatistikler = await fs.stat(tamYol);

        return {
            ad: path.basename(tamYol),
            yol: path.relative(this.temelYol, tamYol),
            tip: istatistikler.isDirectory() ? 'klasor' : 'dosya',
            boyut: istatistikler.size,
            degistirilme: istatistikler.mtime,
            izinler: istatistikler.mode.toString(8).slice(-3)
        };
    }

    /**
     * Dosya arar
     */
    async ara(aramaYolu: string, sorgu: string): Promise<DosyaBilgisi[]> {
        // Sorguyu temizle (güvenlik)
        const temizSorgu = sorgu.replace(/[<>:"\/\\|?*]/g, '').toLowerCase();
        if (temizSorgu.length < 2) {
            throw new Error('Arama terimi en az 2 karakter olmalı');
        }

        const sonuclar: DosyaBilgisi[] = [];
        const tamYol = this.yoluNormalize(aramaYolu);

        const recursifAra = async (dizin: string, derinlik: number = 0) => {
            // Maksimum derinlik (güvenlik - sonsuz döngü önleme)
            if (derinlik > 5) return;

            const girisler = await fs.readdir(dizin, { withFileTypes: true });

            for (const giris of girisler) {
                // Gizli ve tehlikeli dosyaları atla
                if (giris.name.startsWith('.') || giris.name.includes('secret')) continue;

                const girisYolu = path.join(dizin, giris.name);

                if (giris.name.toLowerCase().includes(temizSorgu)) {
                    const istatistikler = await fs.stat(girisYolu);
                    sonuclar.push({
                        ad: giris.name,
                        yol: path.relative(this.temelYol, girisYolu),
                        tip: giris.isDirectory() ? 'klasor' : 'dosya',
                        boyut: istatistikler.size,
                        degistirilme: istatistikler.mtime,
                        izinler: istatistikler.mode.toString(8).slice(-3)
                    });
                }

                // Maksimum sonuç sayısı
                if (sonuclar.length >= 100) return;

                if (giris.isDirectory()) {
                    try {
                        await recursifAra(girisYolu, derinlik + 1);
                    } catch {
                        // Erişilemeyen dizinleri atla
                    }
                }
            }
        };

        await recursifAra(tamYol);
        return sonuclar.slice(0, 100);
    }
}
