import Docker from 'dockerode';

// ============================================
// TİP TANIMLARI
// ============================================

export interface KonteynerBilgisi {
    id: string;
    ad: string;
    imaj: string;
    durum: string;
    calismaDurumu: string;
    olusturulma: number;
    portlar: PortEslemesi[];
}

export interface PortEslemesi {
    dahiliPort: number;
    hariciPort?: number;
    tip: string;
}

export interface KonteynerIstatistikleri {
    cpuYuzdesi: number;
    bellekKullanimi: number;
    bellekLimiti: number;
    bellekYuzdesi: number;
    agIndirme: number;
    agYukleme: number;
}

// ============================================
// DOCKER SERVİSİ
// ============================================

export class DockerServisi {
    private docker: Docker;

    constructor() {
        // Docker soketini otomatik algıla
        this.docker = new Docker();
    }

    /**
     * Tüm konteynerleri listeler
     * @param hepsi - Durdurulmuş konteynerler dahil mi?
     */
    async konteynerleriListele(hepsi: boolean = true): Promise<KonteynerBilgisi[]> {
        try {
            const konteynerler = await this.docker.listContainers({ all: hepsi });
            return konteynerler.map(konteyner => ({
                id: konteyner.Id.substring(0, 12),
                ad: this.konteynerAdiniTemizle(konteyner.Names[0]),
                imaj: konteyner.Image,
                durum: konteyner.Status,
                calismaDurumu: konteyner.State,
                olusturulma: konteyner.Created,
                portlar: konteyner.Ports.map(port => ({
                    dahiliPort: port.PrivatePort,
                    hariciPort: port.PublicPort,
                    tip: port.Type
                }))
            }));
        } catch (hata) {
            console.error('Konteyner listeleme hatası:', hata);
            throw hata;
        }
    }

    /**
     * Belirli bir konteynerin detaylarını getirir
     * @param id - Konteyner ID
     */
    async konteynerGetir(id: string): Promise<Docker.ContainerInspectInfo> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        return konteyner.inspect();
    }

    /**
     * Konteyneri başlatır
     */
    async konteynerBaslat(id: string): Promise<void> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        await konteyner.start();
    }

    /**
     * Konteyneri durdurur
     */
    async konteynerDurdur(id: string): Promise<void> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        await konteyner.stop();
    }

    /**
     * Konteyneri yeniden başlatır
     */
    async konteynerYenidenBaslat(id: string): Promise<void> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        await konteyner.restart();
    }

    /**
     * Konteyneri siler
     * @param zorla - Çalışıyor olsa bile sil
     */
    async konteynerSil(id: string, zorla: boolean = false): Promise<void> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        await konteyner.remove({ force: zorla });
    }

    /**
     * Konteyner loglarını getirir
     * @param satir - Son kaç satır
     */
    async konteynerLoglariGetir(id: string, satir: number = 100): Promise<string> {
        this.idDogrula(id);
        // Log satır sayısını sınırla (güvenlik)
        const guvenliSatir = Math.min(Math.max(1, satir), 1000);

        const konteyner = this.docker.getContainer(id);
        const loglar = await konteyner.logs({
            stdout: true,
            stderr: true,
            tail: guvenliSatir,
            timestamps: true
        });

        // Hassas bilgileri filtrele
        return this.loglardanHassasBilgileriTemizle(loglar.toString());
    }

    /**
     * Konteyner istatistiklerini getirir
     */
    async konteynerIstatistikleriGetir(id: string): Promise<KonteynerIstatistikleri> {
        this.idDogrula(id);
        const konteyner = this.docker.getContainer(id);
        const istatistikler = await konteyner.stats({ stream: false });

        // CPU yüzdesini hesapla
        const cpuDelta = istatistikler.cpu_stats.cpu_usage.total_usage -
            istatistikler.precpu_stats.cpu_usage.total_usage;
        const sistemDelta = istatistikler.cpu_stats.system_cpu_usage -
            istatistikler.precpu_stats.system_cpu_usage;
        const cpuYuzdesi = (cpuDelta / sistemDelta) * istatistikler.cpu_stats.online_cpus * 100;

        // Bellek istatistikleri
        const bellekKullanimi = istatistikler.memory_stats.usage || 0;
        const bellekLimiti = istatistikler.memory_stats.limit || 1;
        const bellekYuzdesi = (bellekKullanimi / bellekLimiti) * 100;

        // Ağ istatistikleri
        let agIndirme = 0;
        let agYukleme = 0;
        if (istatistikler.networks) {
            Object.values(istatistikler.networks).forEach((ag: any) => {
                agIndirme += ag.rx_bytes || 0;
                agYukleme += ag.tx_bytes || 0;
            });
        }

        return {
            cpuYuzdesi: isNaN(cpuYuzdesi) ? 0 : cpuYuzdesi,
            bellekKullanimi,
            bellekLimiti,
            bellekYuzdesi: isNaN(bellekYuzdesi) ? 0 : bellekYuzdesi,
            agIndirme,
            agYukleme
        };
    }

    /**
     * Docker imajlarını listeler
     */
    async imajlariListele(): Promise<any[]> {
        const imajlar = await this.docker.listImages();
        return imajlar.map(imaj => ({
            id: imaj.Id.substring(7, 19),
            etiketler: imaj.RepoTags || ['<yok>'],
            boyut: imaj.Size,
            olusturulma: imaj.Created
        }));
    }

    /**
     * Docker imajı indirir
     */
    async imajIndir(imajAdi: string): Promise<void> {
        // İmaj adını doğrula (güvenlik - command injection önleme)
        if (!/^[a-zA-Z0-9_\-\.\/\:]+$/.test(imajAdi)) {
            throw new Error('Geçersiz imaj adı formatı');
        }

        return new Promise((cozumle, reddet) => {
            this.docker.pull(imajAdi, (hata: any, akis: any) => {
                if (hata) {
                    reddet(hata);
                    return;
                }
                this.docker.modem.followProgress(akis, (hata: any) => {
                    if (hata) reddet(hata);
                    else cozumle();
                });
            });
        });
    }

    /**
     * Docker sistem bilgilerini getirir
     */
    async bilgiGetir(): Promise<any> {
        const bilgi = await this.docker.info();
        // Hassas bilgileri filtrele
        return {
            konteynerSayisi: bilgi.Containers,
            calisanKonteyner: bilgi.ContainersRunning,
            imajSayisi: bilgi.Images,
            surum: bilgi.ServerVersion,
            isletimSistemi: bilgi.OperatingSystem,
            mimarisi: bilgi.Architecture,
            bellek: bilgi.MemTotal,
            cpuSayisi: bilgi.NCPU
        };
    }

    /**
     * Docker sürüm bilgisini getirir
     */
    async surumGetir(): Promise<any> {
        return this.docker.version();
    }

    // ============================================
    // YARDIMCI METODLAR
    // ============================================

    /**
     * Konteyner ID'sini doğrular (güvenlik)
     */
    private idDogrula(id: string): void {
        // Docker ID formatı: hexadecimal, en az 12 karakter
        if (!/^[a-f0-9]{12,64}$/i.test(id)) {
            throw new Error('Geçersiz konteyner ID formatı');
        }
    }

    /**
     * Konteyner adını temizler
     */
    private konteynerAdiniTemizle(ad: string | undefined): string {
        if (!ad) return 'bilinmeyen';
        return ad.replace(/^\//, '');
    }

    /**
     * Loglardan hassas bilgileri temizler
     * Örneğin: şifreler, API anahtarları, tokenlar
     */
    private loglardanHassasBilgileriTemizle(loglar: string): string {
        // Şifre benzeri kalıpları gizle
        return loglar
            .replace(/password[=:]\s*\S+/gi, 'password=[GİZLİ]')
            .replace(/api[_-]?key[=:]\s*\S+/gi, 'api_key=[GİZLİ]')
            .replace(/token[=:]\s*\S+/gi, 'token=[GİZLİ]')
            .replace(/secret[=:]\s*\S+/gi, 'secret=[GİZLİ]');
    }
}
