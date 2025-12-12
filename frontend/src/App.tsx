import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useKimlikDeposu } from './depolar/kimlikDeposu';
import { YanMenu } from './bilesenler';
import {
    Giris,
    GostergePaneli,
    Konteynerler,
    DosyaYoneticisi,
    Ayarlar,
    UygulamaMagazasi
} from './sayfalar';

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
                    <Route path="/dosyalar" element={<DosyaYoneticisi />} />
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
