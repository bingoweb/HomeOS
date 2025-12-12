import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';

// ============================================
// GİRİŞ SAYFASI
// ============================================

export default function Giris() {
    const yonlendir = useNavigate();
    const girisYap = useKimlikDeposu((durum) => durum.girisYap);

    // Form durumu
    const [kullaniciAdi, setKullaniciAdi] = useState('');
    const [sifre, setSifre] = useState('');
    const [sifreGoster, setSifreGoster] = useState(false);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState('');

    const formGonder = async (e: React.FormEvent) => {
        e.preventDefault();
        setYukleniyor(true);
        setHata('');

        try {
            const yanit = await axios.post('/api/kimlik/giris', {
                kullaniciAdi,
                sifre
            });

            if (yanit.data.basarili) {
                girisYap(yanit.data.veri.token, yanit.data.veri.kullanici);
                yonlendir('/');
            }
        } catch (hataYaniti: any) {
            setHata(hataYaniti.response?.data?.hata || 'Giriş başarısız oldu');
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Arka plan dekorasyonu */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-fade-in relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-xl shadow-primary-500/30">
                        <Server className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">HomeOS</h1>
                    <p className="text-gray-400 text-sm mt-1">Ev Sunucu Yönetim Paneli</p>
                </div>

                {/* Form */}
                <form onSubmit={formGonder} className="space-y-6">
                    {hata && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {hata}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            value={kullaniciAdi}
                            onChange={(e) => setKullaniciAdi(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            placeholder="admin"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Şifre
                        </label>
                        <div className="relative">
                            <input
                                type={sifreGoster ? 'text' : 'password'}
                                value={sifre}
                                onChange={(e) => setSifre(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all pr-12"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setSifreGoster(!sifreGoster)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                aria-label={sifreGoster ? 'Şifreyi gizle' : 'Şifreyi göster'}
                            >
                                {sifreGoster ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={yukleniyor}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {yukleniyor ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Giriş yapılıyor...
                            </>
                        ) : (
                            'Giriş Yap'
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Varsayılan: admin / admin
                </p>
            </div>
        </div>
    );
}
