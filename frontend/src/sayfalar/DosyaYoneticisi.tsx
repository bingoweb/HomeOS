import { useEffect, useState } from 'react';
import { FolderOpen, File, ChevronRight, Home, ArrowUp, RefreshCw, Search, Trash2, FolderPlus } from 'lucide-react';
import axios from 'axios';

interface DosyaBilgisi {
    ad: string;
    yol: string;
    tip: 'dosya' | 'klasor';
    boyut: number;
    degistirilme: string;
}

function baytFormatla(bayt: number): string {
    if (bayt === 0) return '0 B';
    const k = 1024;
    const birimler = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bayt) / Math.log(k));
    return parseFloat((bayt / Math.pow(k, i)).toFixed(1)) + ' ' + birimler[i];
}

export default function DosyaYoneticisi() {
    const [dosyalar, setDosyalar] = useState<DosyaBilgisi[]>([]);
    const [mevcutYol, setMevcutYol] = useState('/');
    const [yukleniyor, setYukleniyor] = useState(true);
    const [arama, setArama] = useState('');

    const dosyalariGetir = async (yol: string = '/') => {
        setYukleniyor(true);
        try {
            const yanit = await axios.get(`/api/dosyalar/listele?yol=${encodeURIComponent(yol)}`);
            if (yanit.data.basarili) {
                setDosyalar(yanit.data.veri);
                setMevcutYol(yol);
            }
        } catch (hata) {
            console.error('Dosya getirme hatası:', hata);
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => { dosyalariGetir(); }, []);

    const gezinmeyeGit = (dosya: DosyaBilgisi) => {
        if (dosya.tip === 'klasor') {
            const yeniYol = mevcutYol === '/' ? `/${dosya.ad}` : `${mevcutYol}/${dosya.ad}`;
            dosyalariGetir(yeniYol);
        }
    };

    const ustDizineGit = () => {
        const parcalar = mevcutYol.split('/').filter(Boolean);
        parcalar.pop();
        dosyalariGetir(parcalar.length === 0 ? '/' : '/' + parcalar.join('/'));
    };

    const dosyaSil = async (dosya: DosyaBilgisi) => {
        if (confirm(`"${dosya.ad}" silinecek. Emin misiniz?`)) {
            try {
                const tamYol = mevcutYol === '/' ? `/${dosya.ad}` : `${mevcutYol}/${dosya.ad}`;
                await axios.delete(`/api/dosyalar/sil?yol=${encodeURIComponent(tamYol)}`);
                dosyalariGetir(mevcutYol);
            } catch (hata) {
                console.error('Silme hatası:', hata);
            }
        }
    };

    const klasorOlustur = async () => {
        const ad = prompt('Yeni klasör adı:');
        if (ad) {
            try {
                const tamYol = mevcutYol === '/' ? `/${ad}` : `${mevcutYol}/${ad}`;
                await axios.post('/api/dosyalar/klasor-olustur', { yol: tamYol });
                dosyalariGetir(mevcutYol);
            } catch (hata) {
                console.error('Klasör oluşturma hatası:', hata);
            }
        }
    };

    const filtrelenmis = dosyalar.filter(d => d.ad.toLowerCase().includes(arama.toLowerCase()));
    const yolParcalari = mevcutYol.split('/').filter(Boolean);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dosya Yöneticisi</h1>
                    <p className="text-gray-400 mt-1">Dosya ve klasörlerinizi yönetin</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={klasorOlustur} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors">
                        <FolderPlus className="w-4 h-4" />Yeni Klasör
                    </button>
                    <button onClick={() => dosyalariGetir(mevcutYol)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors">
                        <RefreshCw className="w-4 h-4" />Yenile
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex items-center gap-2 overflow-x-auto">
                <button onClick={() => dosyalariGetir('/')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Home className="w-4 h-4 text-gray-400" />
                </button>
                {mevcutYol !== '/' && (
                    <button onClick={ustDizineGit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowUp className="w-4 h-4 text-gray-400" />
                    </button>
                )}
                <ChevronRight className="w-4 h-4 text-gray-600" />
                {yolParcalari.map((parca, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <button onClick={() => dosyalariGetir('/' + yolParcalari.slice(0, i + 1).join('/'))} className="text-gray-300 hover:text-white transition-colors">{parca}</button>
                        {i < yolParcalari.length - 1 && <ChevronRight className="w-4 h-4 text-gray-600" />}
                    </div>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Dosya ara..." className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50" />
            </div>

            {yukleniyor ? (
                <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>
            ) : filtrelenmis.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Klasör Boş</h3>
                    <p className="text-gray-400">Bu klasörde dosya veya alt klasör bulunmuyor.</p>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 text-gray-400 font-medium">Ad</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium hidden md:table-cell">Boyut</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium hidden lg:table-cell">Değiştirilme</th>
                                <th className="text-right py-4 px-6 text-gray-400 font-medium">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrelenmis.map((dosya, index) => (
                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => gezinmeyeGit(dosya)}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {dosya.tip === 'klasor' ? <FolderOpen className="w-5 h-5 text-yellow-400" /> : <File className="w-5 h-5 text-gray-400" />}
                                            <span className="text-white">{dosya.ad}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 hidden md:table-cell">{dosya.tip === 'dosya' ? baytFormatla(dosya.boyut) : '--'}</td>
                                    <td className="py-4 px-6 text-gray-400 hidden lg:table-cell">{new Date(dosya.degistirilme).toLocaleString('tr-TR')}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); dosyaSil(dosya); }} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors" title="Sil">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
