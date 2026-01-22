import { useState } from 'react';
import { User, Shield, Power, Save, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';

export default function Ayarlar() {
    const kullanici = useKimlikDeposu((durum) => durum.kullanici);
    const [aktifSekme, setAktifSekme] = useState('hesap');
    const [mevcutSifre, setMevcutSifre] = useState('');
    const [yeniSifre, setYeniSifre] = useState('');
    const [sifreTekrar, setSifreTekrar] = useState('');
    const [sifreleriGoster, setSifreleriGoster] = useState(false);
    const [sifreMesaji, setSifreMesaji] = useState<{ tip: 'basari' | 'hata'; metin: string } | null>(null);

    const sifreDegistir = async (e: React.FormEvent) => {
        e.preventDefault();
        setSifreMesaji(null);
        if (yeniSifre !== sifreTekrar) { setSifreMesaji({ tip: 'hata', metin: 'Yeni şifreler eşleşmiyor' }); return; }
        if (yeniSifre.length < 8) { setSifreMesaji({ tip: 'hata', metin: 'Şifre en az 8 karakter olmalı' }); return; }
        try {
            const yanit = await axios.post('/api/kimlik/sifre-degistir', { kullaniciAdi: kullanici?.kullaniciAdi, mevcutSifre, yeniSifre });
            if (yanit.data.basarili) {
                setSifreMesaji({ tip: 'basari', metin: 'Şifre başarıyla değiştirildi' });
                setMevcutSifre(''); setYeniSifre(''); setSifreTekrar('');
            }
        } catch (hata: any) {
            setSifreMesaji({ tip: 'hata', metin: hata.response?.data?.hata || 'Şifre değiştirilemedi' });
        }
    };

    const sistemIslemi = async (islem: 'yenidenbaslat' | 'kapat') => {
        const mesaj = islem === 'yenidenbaslat' ? 'Sistem yeniden başlatılacak. Emin misiniz?' : 'Sistem kapatılacak. Emin misiniz?';
        if (confirm(mesaj)) {
            try { await axios.post(`/api/sistem/${islem}`); alert(`${islem === 'yenidenbaslat' ? 'Yeniden başlatma' : 'Kapatma'} komutu gönderildi`); }
            catch (hata) { console.error('Sistem işlem hatası:', hata); }
        }
    };

    const sekmeler = [
        { id: 'hesap', etiket: 'Hesap', ikon: User },
        { id: 'guvenlik', etiket: 'Güvenlik', ikon: Shield },
        { id: 'sistem', etiket: 'Sistem', ikon: Power },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-3xl font-bold text-white">Ayarlar</h1><p className="text-gray-400 mt-1">Sistem ve hesap ayarlarını yönetin</p></div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64 glass-card rounded-2xl p-4 space-y-2">
                    {sekmeler.map((sekme) => (
                        <button key={sekme.id} onClick={() => setAktifSekme(sekme.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${aktifSekme === sekme.id ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <sekme.ikon className="w-5 h-5" /><span className="font-medium">{sekme.etiket}</span>
                        </button>
                    ))}
                </div>
                <div className="flex-1 glass-card rounded-2xl p-6">
                    {aktifSekme === 'hesap' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><User className="w-5 h-5" />Hesap Bilgileri</h2>
                            <div className="grid gap-4">
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Adı</label><input type="text" value={kullanici?.kullaniciAdi || 'admin'} disabled className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400" /></div>
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Rol</label><input type="text" value={kullanici?.rol || 'yonetici'} disabled className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400" /></div>
                            </div>
                        </div>
                    )}
                    {aktifSekme === 'guvenlik' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5" />Şifre Değiştir</h2>
                            {sifreMesaji && <div className={`px-4 py-3 rounded-xl text-sm ${sifreMesaji.tip === 'basari' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{sifreMesaji.metin}</div>}
                            <form onSubmit={sifreDegistir} className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Şifre</label><input type={sifreleriGoster ? 'text' : 'password'} value={mevcutSifre} onChange={(e) => setMevcutSifre(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50" required /></div>
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre</label><input type={sifreleriGoster ? 'text' : 'password'} value={yeniSifre} onChange={(e) => setYeniSifre(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50" required /></div>
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre (Tekrar)</label><input type={sifreleriGoster ? 'text' : 'password'} value={sifreTekrar} onChange={(e) => setSifreTekrar(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50" required /></div>
                                <div className="flex items-center gap-2"><button type="button" onClick={() => setSifreleriGoster(!sifreleriGoster)} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">{sifreleriGoster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{sifreleriGoster ? 'Gizle' : 'Göster'}</button></div>
                                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"><Save className="w-4 h-4" />Şifreyi Değiştir</button>
                            </form>
                        </div>
                    )}
                    {aktifSekme === 'sistem' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Power className="w-5 h-5" />Sistem İşlemleri</h2>
                            <div className="grid gap-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <h3 className="text-lg font-medium text-yellow-400 mb-2">Yeniden Başlat</h3>
                                    <p className="text-gray-400 text-sm mb-4">Sistemi yeniden başlatır.</p>
                                    <button onClick={() => sistemIslemi('yenidenbaslat')} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-colors">Yeniden Başlat</button>
                                </div>
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <h3 className="text-lg font-medium text-red-400 mb-2">Sistemi Kapat</h3>
                                    <p className="text-gray-400 text-sm mb-4">Sistemi kapatır.</p>
                                    <button onClick={() => sistemIslemi('kapat')} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors">Sistemi Kapat</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
