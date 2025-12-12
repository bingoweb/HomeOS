import { useEffect, useState } from 'react';
import {
    Container as ContainerIcon,
    Play,
    Square,
    RefreshCw,
    Trash2,
    Terminal,
    Search,
    X
} from 'lucide-react';
import axios from 'axios';

// ============================================
// TİP TANIMLARI
// ============================================

interface Konteyner {
    id: string;
    ad: string;
    imaj: string;
    durum: string;
    calismaDurumu: string;
    olusturulma: number;
    portlar: { dahiliPort: number; hariciPort?: number; tip: string }[];
}

// ============================================
// KONTEYNERLER SAYFASI
// ============================================

export default function Konteynerler() {
    const [konteynerler, setKonteynerler] = useState<Konteyner[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [arama, setArama] = useState('');
    const [seciliKonteyner, setSeciliKonteyner] = useState<string | null>(null);
    const [loglar, setLoglar] = useState<string>('');
    const [logGoster, setLogGoster] = useState(false);
    const [islemYukleniyor, setIslemYukleniyor] = useState<string | null>(null);

    const konteynerleriGetir = async () => {
        try {
            const yanit = await axios.get('/api/docker/konteynerler');
            if (yanit.data.basarili) {
                setKonteynerler(yanit.data.veri);
            }
        } catch (hata) {
            console.error('Konteyner getirme hatası:', hata);
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        konteynerleriGetir();
        const aralik = setInterval(konteynerleriGetir, 5000);
        return () => clearInterval(aralik);
    }, []);

    const islemYap = async (id: string, islem: 'baslat' | 'durdur' | 'yenidenbaslat' | 'sil') => {
        setIslemYukleniyor(id);
        try {
            if (islem === 'sil') {
                await axios.delete(`/api/docker/konteynerler/${id}?zorla=evet`);
            } else {
                await axios.post(`/api/docker/konteynerler/${id}/${islem}`);
            }
            await konteynerleriGetir();
        } catch (hata) {
            console.error(`Konteyner ${islem} hatası:`, hata);
        } finally {
            setIslemYukleniyor(null);
        }
    };

    const loglariGoster = async (id: string) => {
        setSeciliKonteyner(id);
        setLogGoster(true);
        try {
            const yanit = await axios.get(`/api/docker/konteynerler/${id}/loglar?satir=200`);
            if (yanit.data.basarili) {
                setLoglar(yanit.data.veri);
            }
        } catch (hata) {
            setLoglar('Loglar alınamadı');
        }
    };

    const filtrelenmisKonteynerler = konteynerler.filter(k =>
        k.ad.toLowerCase().includes(arama.toLowerCase()) ||
        k.imaj.toLowerCase().includes(arama.toLowerCase())
    );

    const durumRenginiGetir = (durum: string) => {
        switch (durum) {
            case 'running': return 'bg-green-500';
            case 'exited': return 'bg-red-500';
            case 'paused': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Konteynerler</h1>
                    <p className="text-gray-400 mt-1">Docker konteyner yönetimi</p>
                </div>
                <button
                    onClick={konteynerleriGetir}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Yenile
                </button>
            </div>

            {/* Arama */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={arama}
                    onChange={(e) => setArama(e.target.value)}
                    placeholder="Konteyner ara..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
            </div>

            {/* Konteyner Listesi */}
            {yukleniyor ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : filtrelenmisKonteynerler.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <ContainerIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Konteyner Bulunamadı</h3>
                    <p className="text-gray-400">Docker çalışıyor mu? Konteyner oluşturmak için Uygulama Mağazasını kullanın.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtrelenmisKonteynerler.map((konteyner) => (
                        <div key={konteyner.id} className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                {/* Durum göstergesi */}
                                <div className={`w-3 h-3 rounded-full ${durumRenginiGetir(konteyner.calismaDurumu)}`} />

                                {/* Konteyner bilgisi */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white truncate">{konteyner.ad}</h3>
                                        <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">{konteyner.id}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{konteyner.imaj}</p>
                                    <p className="text-xs text-gray-500 mt-1">{konteyner.durum}</p>
                                </div>

                                {/* Portlar */}
                                {konteyner.portlar.length > 0 && (
                                    <div className="hidden md:flex flex-wrap gap-2">
                                        {konteyner.portlar.filter(p => p.hariciPort).map((port, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                {port.hariciPort}:{port.dahiliPort}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* İşlemler */}
                                <div className="flex items-center gap-2">
                                    {konteyner.calismaDurumu === 'running' ? (
                                        <button
                                            onClick={() => islemYap(konteyner.id, 'durdur')}
                                            disabled={islemYukleniyor === konteyner.id}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                                            title="Durdur"
                                        >
                                            <Square className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => islemYap(konteyner.id, 'baslat')}
                                            disabled={islemYukleniyor === konteyner.id}
                                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
                                            title="Başlat"
                                        >
                                            <Play className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => islemYap(konteyner.id, 'yenidenbaslat')}
                                        disabled={islemYukleniyor === konteyner.id}
                                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-colors"
                                        title="Yeniden Başlat"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => loglariGoster(konteyner.id)}
                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                        title="Loglar"
                                    >
                                        <Terminal className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => islemYap(konteyner.id, 'sil')}
                                        disabled={islemYukleniyor === konteyner.id}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Log Modalı */}
            {logGoster && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-lg font-semibold text-white">Konteyner Logları</h3>
                            <button onClick={() => setLogGoster(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{loglar}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Geriye uyumluluk
export { Konteynerler as Containers };
