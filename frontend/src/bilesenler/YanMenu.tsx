import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Container,
    FolderOpen,
    Settings,
    Store,
    LogOut,
    Server,
    Wifi,
    WifiOff,
    Menu,
    X
} from 'lucide-react';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';
import { useSistemDeposu } from '../depolar/sistemDeposu';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

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
    const location = useLocation();
    const cikisYap = useKimlikDeposu((durum) => durum.cikisYap);
    const bagliMi = useSistemDeposu((durum) => durum.bagliMi);
    const [mobilMenuAcik, setMobilMenuAcik] = useState(false);

    // Route değiştiğinde mobil menüyü kapat
    useEffect(() => {
        setMobilMenuAcik(false);
    }, [location.pathname]);

    // Mobil menü açıkken scroll'u engelle
    useEffect(() => {
        if (mobilMenuAcik) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobilMenuAcik]);

    const cikisIslemi = () => {
        cikisYap();
        yonlendir('/giris');
    };

    const NavContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5">
                        <Server className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white tracking-tight">HomeOS</h1>
                        <p className="text-xs text-zinc-500 font-medium">Ev Sunucu Yönetimi</p>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setMobilMenuAcik(false)}
                    className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Bağlantı Durumu */}
            <div className="px-6 py-4">
                <div className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm border font-medium transition-colors",
                    bagliMi
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                    {bagliMi ? (
                        <>
                            <Wifi className="w-4 h-4" />
                            <span>Sistem Çevrimiçi</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4" />
                            <span>Bağlantı Kesildi</span>
                        </>
                    )}
                </div>
            </div>

            {/* Navigasyon */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigasyonOgeleri.map((oge) => (
                    <NavLink
                        key={oge.yol}
                        to={oge.yol}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-zinc-800 text-white font-medium"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <oge.ikon className={clsx(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                )} />
                                <span className="text-sm">{oge.etiket}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Çıkış */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={cikisIslemi}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40 bg-dark-900 border-r border-white/10">
               <NavContent />
            </aside>

            {/* Mobile Hamburger Button - Only visible when not logged in? No, should be visible in layout. */}
            {/* Actually, the layout handles where this component is placed. But we need a trigger button in the main layout usually.
                Since YanMenu is used inside KorumalıLayout, we might need to portal the hamburger button or expect the layout to handle it.
                However, looking at App.tsx, YanMenu is placed alongside main.

                Let's make YanMenu render the hamburger button itself for mobile, absolutely positioned or fixed.
            */}

            <button
                onClick={() => setMobilMenuAcik(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-dark-800 border border-white/10 text-white shadow-lg"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Sidebar Overlay */}
            {createPortal(
                <div
                    className={clsx(
                        "fixed inset-0 z-50 md:hidden transition-all duration-300",
                        mobilMenuAcik ? "visible" : "invisible pointer-events-none"
                    )}
                >
                    {/* Backdrop */}
                    <div
                        className={clsx(
                            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                            mobilMenuAcik ? "opacity-100" : "opacity-0"
                        )}
                        onClick={() => setMobilMenuAcik(false)}
                    />

                    {/* Sidebar Panel */}
                    <aside
                        className={clsx(
                            "absolute left-0 top-0 h-full w-72 bg-dark-900 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-out",
                            mobilMenuAcik ? "translate-x-0" : "-translate-x-full"
                        )}
                    >
                        <NavContent />
                    </aside>
                </div>,
                document.body
            )}
        </>
    );
}
