import { useEffect, useState } from 'react';
import {
    Cpu,
    HardDrive,
    MemoryStick,
    Network,
    Container,
    Server,
    Activity,
    Clock
} from 'lucide-react';
import axios from 'axios';
import { useSistemDeposu } from '../stores/systemStore';
import SistemGostergesi from '../components/SystemGauge';

// ============================================
// TİP TANIMLARI
// ============================================

interface SistemBilgisi {
    cpu: { kullanim: number; cekirdekSayisi: number; model: string; hiz: number };
    bellek: { toplam: number; kullanilan: number; kullanimYuzdesi: number };
    disk: { toplam: number; kullanilan: number; kullanimYuzdesi: number };
    ag: { arayuzler: any[]; indirme: number; yukleme: number };
    isletimSistemi: { platform: string; dagitim: string; sunucuAdi: string; calismaSuresi: number };
}

interface KonteynerOzeti {
    toplam: number;
    calisan: number;
    durmus: number;
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

function baytFormatla(bayt: number): string {
    if (bayt === 0) return '0 B';
    const k = 1024;
    const birimler = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bayt) / Math.log(k));
    return parseFloat((bayt / Math.pow(k, i)).toFixed(1)) + ' ' + birimler[i];
}

function calismaSuresiFormatla(saniye: number): string {
    const gun = Math.floor(saniye / 86400);
    const saat = Math.floor((saniye % 86400) / 3600);
    const dakika = Math.floor((saniye % 3600) / 60);

    if (gun > 0) return `${gun}g ${saat}s ${dakika}d`;
    if (saat > 0) return `${saat}s ${dakika}d`;
    return `${dakika}d`;
}

// ============================================
// GÖSTERGE PANELİ
// ============================================

export default function GostergePaneli() {
    const { istatistikler, istatistikleriGuncelle, baglantiDurumuGuncelle } = useSistemDeposu();
    const [sistemBilgisi, setSistemBilgisi] = useState<SistemBilgisi | null>(null);
    const [konteynerler, setKonteynerler] = useState<KonteynerOzeti>({ toplam: 0, calisan: 0, durmus: 0 });
    const [yukleniyor, setYukleniyor] = useState(true);

    useEffect(() => {
        // Sistem bilgilerini getir
        const sistemBilgisiGetir = async () => {
            try {
                const yanit = await axios.get('/api/sistem/bilgi');
                if (yanit.data.basarili) {
                    setSistemBilgisi(yanit.data.veri);
                }
            } catch (hata) {
                console.error('Sistem bilgisi hatası:', hata);
            }
        };

        // Konteyner özetini getir
        const konteynerGetir = async () => {
            try {
                const yanit = await axios.get('/api/docker/konteynerler');
                if (yanit.data.basarili) {
                    const tumKonteynerler = yanit.data.veri;
                    setKonteynerler({
                        toplam: tumKonteynerler.length,
                        calisan: tumKonteynerler.filter((k: any) => k.calismaDurumu === 'running').length,
                        durmus: tumKonteynerler.filter((k: any) => k.calismaDurumu !== 'running').length
                    });
                }
            } catch (hata) {
                console.error('Konteyner getirme hatası:', hata);
            }
        };

        sistemBilgisiGetir();
        konteynerGetir();
        setYukleniyor(false);

        // WebSocket bağlantısı - gerçek zamanlı istatistikler
        const ws = new WebSocket(`ws://${window.location.host}/ws`);

        ws.onopen = () => {
            baglantiDurumuGuncelle(true);
        };

        ws.onmessage = (olay) => {
            const mesaj = JSON.parse(olay.data);
            if (mesaj.tip === 'sistem-istatistikleri') {
                istatistikleriGuncelle(mesaj.veri);
            }
        };

        ws.onclose = () => {
            baglantiDurumuGuncelle(false);
        };

        ws.onerror = () => {
            baglantiDurumuGuncelle(false);
        };

        // Konteyner güncellemesi için polling
        const konteynerAraligi = setInterval(konteynerGetir, 10000);

        return () => {
            ws.close();
            clearInterval(konteynerAraligi);
        };
    }, [istatistikleriGuncelle, baglantiDurumuGuncelle]);

    if (yukleniyor) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gösterge Paneli</h1>
                    <p className="text-gray-400 mt-1">Sistem durumu ve genel bakış</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{new Date().toLocaleString('tr-TR')}</span>
                </div>
            </div>

            {/* Sistem Bilgisi Kartı */}
            {sistemBilgisi && (
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <Server className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{sistemBilgisi.isletimSistemi.sunucuAdi}</h2>
                            <p className="text-gray-400">{sistemBilgisi.isletimSistemi.dagitim} • {sistemBilgisi.cpu.model}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-gray-400">Çalışma Süresi</p>
                            <p className="text-lg font-semibold text-white">{calismaSuresiFormatla(sistemBilgisi.isletimSistemi.calismaSuresi)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CPU */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="font-semibold text-white">İşlemci</span>
                        </div>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <SistemGostergesi deger={istatistikler.cpu} renk="#3b82f6" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {sistemBilgisi?.cpu.cekirdekSayisi} Çekirdek @ {sistemBilgisi?.cpu.hiz} GHz
                    </p>
                </div>

                {/* Bellek */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <MemoryStick className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="font-semibold text-white">Bellek</span>
                        </div>
                    </div>
                    <SistemGostergesi deger={istatistikler.bellek} renk="#22c55e" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {baytFormatla(sistemBilgisi?.bellek.kullanilan || 0)} / {baytFormatla(sistemBilgisi?.bellek.toplam || 0)}
                    </p>
                </div>

                {/* Disk */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <HardDrive className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="font-semibold text-white">Disk</span>
                        </div>
                    </div>
                    <SistemGostergesi deger={istatistikler.disk} renk="#a855f7" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {baytFormatla(sistemBilgisi?.disk.kullanilan || 0)} / {baytFormatla(sistemBilgisi?.disk.toplam || 0)}
                    </p>
                </div>

                {/* Ağ */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <Network className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="font-semibold text-white">Ağ</span>
                        </div>
                    </div>
                    <div className="text-center py-4">
                        <div className="flex justify-center gap-8">
                            <div>
                                <p className="text-2xl font-bold text-green-400">↓ {baytFormatla(istatistikler.agIndirme)}/s</p>
                                <p className="text-xs text-gray-400">İndirme</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-400">↑ {baytFormatla(istatistikler.agYukleme)}/s</p>
                                <p className="text-xs text-gray-400">Yükleme</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Konteyner Özeti */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Container className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Konteynerler</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <p className="text-3xl font-bold text-white">{konteynerler.toplam}</p>
                        <p className="text-gray-400 text-sm">Toplam</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <p className="text-3xl font-bold text-green-400">{konteynerler.calisan}</p>
                        <p className="text-gray-400 text-sm">Çalışıyor</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <p className="text-3xl font-bold text-red-400">{konteynerler.durmus}</p>
                        <p className="text-gray-400 text-sm">Durduruldu</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Geriye uyumluluk
export { GostergePaneli as Dashboard };
