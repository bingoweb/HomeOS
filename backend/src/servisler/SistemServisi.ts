import si from 'systeminformation';

// ============================================
// TİP TANIMLARI
// ============================================

export interface SistemIstatistikleri {
    cpu: {
        kullanim: number;
        cekirdekSayisi: number;
        model: string;
        hiz: number;
        sicaklik?: number;
    };
    bellek: {
        toplam: number;
        kullanilan: number;
        bos: number;
        kullanimYuzdesi: number;
    };
    disk: {
        toplam: number;
        kullanilan: number;
        bos: number;
        kullanimYuzdesi: number;
    };
    ag: {
        arayuzler: AgArayuzu[];
        indirme: number;
        yukleme: number;
    };
    isletimSistemi: {
        platform: string;
        dagitim: string;
        surum: string;
        sunucuAdi: string;
        calismaSuresi: number;
    };
}

export interface AgArayuzu {
    ad: string;
    ip4: string;
    mac: string;
    durum: string;
}

// ============================================
// SİSTEM SERVİSİ
// ============================================

export class SistemServisi {

    /**
     * Tam sistem bilgilerini getirir
     * Güvenlik: Hassas bilgileri filtreler
     */
    async sistemBilgisiGetir(): Promise<SistemIstatistikleri> {
        const [cpu, cpuYuk, bellek, disk, agArayuzleri, agIstatistikleri, os, zaman] = await Promise.all([
            si.cpu(),
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkInterfaces(),
            si.networkStats(),
            si.osInfo(),
            si.time()
        ]);

        const anaDisk = disk[0] || { size: 0, used: 0, available: 0 };
        const arayuzler = Array.isArray(agArayuzleri) ? agArayuzleri : [];
        const istatistikler = Array.isArray(agIstatistikleri) ? agIstatistikleri : [];

        return {
            cpu: {
                kullanim: cpuYuk.currentLoad || 0,
                cekirdekSayisi: cpu.cores,
                model: cpu.manufacturer + ' ' + cpu.brand,
                hiz: cpu.speed,
            },
            bellek: {
                toplam: bellek.total,
                kullanilan: bellek.used,
                bos: bellek.free,
                kullanimYuzdesi: (bellek.used / bellek.total) * 100
            },
            disk: {
                toplam: anaDisk.size,
                kullanilan: anaDisk.used,
                bos: anaDisk.available,
                kullanimYuzdesi: anaDisk.use || 0
            },
            ag: {
                arayuzler: arayuzler
                    .filter((arayuz: any) => arayuz.ip4 && arayuz.ip4 !== '127.0.0.1')
                    .map((arayuz: any) => ({
                        ad: arayuz.iface,
                        ip4: arayuz.ip4,
                        // MAC adresi kısmen maskeleniyor (güvenlik)
                        mac: this.macAdresiniMaskele(arayuz.mac),
                        durum: arayuz.operstate
                    })),
                indirme: istatistikler.reduce((toplam: number, s: any) => toplam + (s.rx_sec || 0), 0),
                yukleme: istatistikler.reduce((toplam: number, s: any) => toplam + (s.tx_sec || 0), 0)
            },
            isletimSistemi: {
                platform: os.platform,
                dagitim: os.distro,
                surum: os.release,
                sunucuAdi: os.hostname,
                calismaSuresi: zaman.uptime
            }
        };
    }

    /**
     * Hafif anlık istatistikler (WebSocket için)
     */
    async anlikIstatistikleriGetir(): Promise<{
        cpu: number;
        bellek: number;
        disk: number;
        agIndirme: number;
        agYukleme: number;
    }> {
        const [cpuYuk, bellek, disk, agIstatistikleri] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats()
        ]);

        const anaDisk = disk[0] || { use: 0 };
        const istatistikler = Array.isArray(agIstatistikleri) ? agIstatistikleri : [];

        return {
            cpu: cpuYuk.currentLoad || 0,
            bellek: (bellek.used / bellek.total) * 100,
            disk: anaDisk.use || 0,
            agIndirme: istatistikler.reduce((toplam: number, s: any) => toplam + (s.rx_sec || 0), 0),
            agYukleme: istatistikler.reduce((toplam: number, s: any) => toplam + (s.tx_sec || 0), 0)
        };
    }

    /**
     * Çalışan işlemlerin listesini getirir
     */
    async surecleriGetir(): Promise<any[]> {
        const surecler = await si.processes();
        return surecler.list
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 20)
            .map(s => ({
                pid: s.pid,
                ad: s.name,
                cpu: s.cpu,
                bellek: s.mem,
                durum: s.state
            }));
    }

    /**
     * MAC adresini güvenlik için kısmen maskeler
     * Örnek: AA:BB:CC:DD:EE:FF -> AA:BB:**:**:**:FF
     */
    private macAdresiniMaskele(mac: string): string {
        if (!mac || mac.length < 17) return mac;
        const parcalar = mac.split(':');
        if (parcalar.length !== 6) return mac;
        return `${parcalar[0]}:${parcalar[1]}:**:**:**:${parcalar[5]}`;
    }
}
