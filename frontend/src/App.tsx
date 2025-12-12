import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useKimlikDeposu } from './stores/authStore';
import YanMenu from './components/Sidebar';
import GostergePaneli from './pages/Dashboard';
import Konteynerler from './pages/Containers';
import Dosyalar from './pages/Files';
import Ayarlar from './pages/Settings';
import UygulamaMagazasi from './pages/AppStore';
import Giris from './pages/Login';

// ============================================
// KORUMALI LAYOUT
// ============================================

function KorumalıLayout() {
    const girisYapildiMi = useKimlikDeposu((durum) => durum.girisYapildiMi);

    if (!girisYapildiMi) {
        return <Navigate to="/giris" replace />;
    }

    return (
        <div className="flex min-h-screen">
            <YanMenu />
            <main className="flex-1 ml-64 p-6">
                <Routes>
                    <Route path="/" element={<GostergePaneli />} />
                    <Route path="/konteynerler" element={<Konteynerler />} />
                    <Route path="/dosyalar" element={<Dosyalar />} />
                    <Route path="/uygulama-magazasi" element={<UygulamaMagazasi />} />
                    <Route path="/ayarlar" element={<Ayarlar />} />
                </Routes>
            </main>
        </div>
    );
}

// ============================================
// ANA UYGULAMA
// ============================================

function Uygulama() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/giris" element={<Giris />} />
                <Route path="/*" element={<KorumalıLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Uygulama;
