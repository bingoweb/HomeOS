import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Container,
    FolderOpen,
    Settings,
    Store,
    LogOut,
    Server,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';
import { useSistemDeposu } from '../depolar/sistemDeposu';

// ============================================
// NAVİGASYON ÖĞELERİ
// ============================================

const navigasyonOgeleri = [
    { yol: '/', ikon: LayoutDashboard, etiket: 'Gösterge Paneli' },
    { yol: '/konteynerler', ikon: Container, etiket: 'Konteynerler' },
    { yol: '/dosyalar', ikon: FolderOpen, etiket: 'Dosyalar' },
    { yol: '/uygulama-magazasi', ikon: Store, etiket: 'Uygulama Mağazası' },
    { yol: '/ayarlar', ikon: Settings, etiket: 'Ayarlar' },
];

// ============================================
// YAN MENÜ BİLEŞENİ
// ============================================

export default function YanMenu() {
    const yonlendir = useNavigate();
    const cikisYap = useKimlikDeposu((durum) => durum.cikisYap);
    const bagliMi = useSistemDeposu((durum) => durum.bagliMi);

    const cikisIslemi = () => {
        cikisYap();
        yonlendir('/giris');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 glass-card flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                        <Server className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">HomeOS</h1>
                        <p className="text-xs text-gray-400">Ev Sunucu Yönetimi</p>
                    </div>
                </div>
            </div>

            {/* Bağlantı Durumu */}
            <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm">
                    {bagliMi ? (
                        <>
                            <Wifi className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Bağlı</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">Bağlantı Yok</span>
                        </>
                    )}
                </div>
            </div>

            {/* Navigasyon */}
            <nav className="flex-1 p-4 space-y-2">
                {navigasyonOgeleri.map((oge) => (
                    <NavLink
                        key={oge.yol}
                        to={oge.yol}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <oge.ikon className="w-5 h-5" />
                        <span className="font-medium">{oge.etiket}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Çıkış */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={cikisIslemi}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}
