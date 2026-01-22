import { useState } from 'react';
import { Store, Search, Download, Star, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Uygulama {
    id: string;
    ad: string;
    aciklama: string;
    imaj: string;
    kategori: string;
    puan: number;
    portlar: string[];
}

const uygulamalar: Uygulama[] = [
    { id: 'nginx', ad: 'Nginx', aciklama: 'Yüksek performanslı web sunucusu ve reverse proxy', imaj: 'nginx:alpine', kategori: 'Web', puan: 5, portlar: ['80:80', '443:443'] },
    { id: 'portainer', ad: 'Portainer', aciklama: 'Docker ve Kubernetes için görsel yönetim arayüzü', imaj: 'portainer/portainer-ce:latest', kategori: 'Yönetim', puan: 5, portlar: ['9000:9000'] },
    { id: 'filebrowser', ad: 'Dosya Gezgini', aciklama: 'Web tabanlı dosya yöneticisi', imaj: 'filebrowser/filebrowser:latest', kategori: 'Dosya', puan: 4, portlar: ['8080:80'] },
    { id: 'nextcloud', ad: 'Nextcloud', aciklama: 'Kendi bulut depolama ve işbirliği platformunuz', imaj: 'nextcloud:latest', kategori: 'Bulut', puan: 5, portlar: ['8081:80'] },
    { id: 'heimdall', ad: 'Heimdall', aciklama: 'Uygulama kontrol paneli ve başlatıcı', imaj: 'linuxserver/heimdall:latest', kategori: 'Yönetim', puan: 4, portlar: ['8082:80'] },
    { id: 'plex', ad: 'Plex', aciklama: 'Medya sunucusu - Film, dizi ve müzik akışı', imaj: 'plexinc/pms-docker:latest', kategori: 'Medya', puan: 5, portlar: ['32400:32400'] },
    { id: 'pihole', ad: 'Pi-hole', aciklama: 'Ağ düzeyinde reklam engelleme', imaj: 'pihole/pihole:latest', kategori: 'Ağ', puan: 5, portlar: ['53:53', '8083:80'] },
    { id: 'homeassistant', ad: 'Home Assistant', aciklama: 'Açık kaynaklı akıllı ev otomasyonu', imaj: 'homeassistant/home-assistant:stable', kategori: 'Akıllı Ev', puan: 5, portlar: ['8123:8123'] }
];

const kategoriler = ['Tümü', 'Web', 'Yönetim', 'Dosya', 'Bulut', 'Medya', 'Ağ', 'Akıllı Ev'];

export default function UygulamaMagazasi() {
    const [arama, setArama] = useState('');
    const [seciliKategori, setSeciliKategori] = useState('Tümü');
    const [kuruluyor, setKuruluyor] = useState<string | null>(null);
    const [mesaj, setMesaj] = useState<{ tip: 'basari' | 'hata'; metin: string } | null>(null);

    const filtrelenmisUygulamalar = uygulamalar.filter(uygulama => {
        const aramaEslesiyor = uygulama.ad.toLowerCase().includes(arama.toLowerCase()) || uygulama.aciklama.toLowerCase().includes(arama.toLowerCase());
        const kategoriEslesiyor = seciliKategori === 'Tümü' || uygulama.kategori === seciliKategori;
        return aramaEslesiyor && kategoriEslesiyor;
    });

    const uygulamaKur = async (uygulama: Uygulama) => {
        setKuruluyor(uygulama.id);
        setMesaj(null);
        try {
            await axios.post('/api/docker/imajlar/indir', { imaj: uygulama.imaj });
            setMesaj({ tip: 'basari', metin: `${uygulama.ad} başarıyla indirildi!` });
        } catch (hata: any) {
            setMesaj({ tip: 'hata', metin: hata.response?.data?.hata || 'Kurulum başarısız oldu' });
        } finally {
            setKuruluyor(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-3xl font-bold text-white">Uygulama Mağazası</h1><p className="text-gray-400 mt-1">Popüler uygulamaları tek tıkla kurun</p></div>

            {mesaj && <div className={`px-4 py-3 rounded-xl text-sm ${mesaj.tip === 'basari' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{mesaj.metin}</div>}

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Uygulama ara..." className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {kategoriler.map((kategori) => (
                        <button key={kategori} onClick={() => setSeciliKategori(kategori)} className={`px-4 py-2 rounded-xl transition-colors ${seciliKategori === kategori ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>{kategori}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtrelenmisUygulamalar.map((uygulama) => (
                    <div key={uygulama.id} className="glass-card rounded-2xl p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-zinc-500 fill-zinc-500" /><span className="text-sm text-zinc-500">{uygulama.puan}</span></div>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">{uygulama.ad}</h3>
                        <p className="text-sm text-zinc-500 mb-4 flex-1">{uygulama.aciklama}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                            {uygulama.portlar.map((port, i) => (<span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-zinc-500">{port}</span>))}
                        </div>
                        <button onClick={() => uygulamaKur(uygulama)} disabled={kuruluyor === uygulama.id} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {kuruluyor === uygulama.id ? (<><Loader2 className="w-4 h-4 animate-spin" />Kuruluyor...</>) : (<><Download className="w-4 h-4" />Kur</>)}
                        </button>
                    </div>
                ))}
            </div>

            {filtrelenmisUygulamalar.length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <Store className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Uygulama Bulunamadı</h3>
                    <p className="text-gray-400">Arama kriterlerinize uygun uygulama yok.</p>
                </div>
            )}
        </div>
    );
}
