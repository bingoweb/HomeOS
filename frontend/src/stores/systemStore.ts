import { create } from 'zustand';

// ============================================
// TİP TANIMLARI
// ============================================

interface SistemIstatistikleri {
    cpu: number;
    bellek: number;
    disk: number;
    agIndirme: number;
    agYukleme: number;
}

interface SistemDurumu {
    istatistikler: SistemIstatistikleri;
    bagliMi: boolean;
    istatistikleriGuncelle: (istatistikler: SistemIstatistikleri) => void;
    baglantiDurumuGuncelle: (bagli: boolean) => void;
}

// ============================================
// SİSTEM DEPOSU
// ============================================

export const useSistemDeposu = create<SistemDurumu>((set) => ({
    istatistikler: {
        cpu: 0,
        bellek: 0,
        disk: 0,
        agIndirme: 0,
        agYukleme: 0,
    },
    bagliMi: false,
    istatistikleriGuncelle: (istatistikler) => set({ istatistikler }),
    baglantiDurumuGuncelle: (bagliMi) => set({ bagliMi }),
}));

// Geriye uyumluluk için eski isim
export const useSystemStore = useSistemDeposu;
