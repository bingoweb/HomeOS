import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TİP TANIMLARI
// ============================================

interface Kullanici {
    kullaniciAdi: string;
    rol: string;
}

interface KimlikDurumu {
    token: string | null;
    kullanici: Kullanici | null;
    girisYapildiMi: boolean;
    girisYap: (token: string, kullanici: Kullanici) => void;
    cikisYap: () => void;
}

// ============================================
// KİMLİK DEPOSU
// ============================================

export const useKimlikDeposu = create<KimlikDurumu>()(
    persist(
        (set) => ({
            token: null,
            kullanici: null,
            girisYapildiMi: false,
            girisYap: (token, kullanici) => set({ token, kullanici, girisYapildiMi: true }),
            cikisYap: () => set({ token: null, kullanici: null, girisYapildiMi: false }),
        }),
        {
            name: 'homeos-kimlik', // localStorage anahtarı
        }
    )
);

// Geriye uyumluluk için eski isim
export const useAuthStore = useKimlikDeposu;
