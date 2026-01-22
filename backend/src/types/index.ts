/**
 * TypeScript Type Definitions
 * Centralized type definitions for the application
 */

import { Request } from 'express';

// Kullanıcı tipleri
export interface IKullanici {
    id: string;
    kullaniciAdi: string;
    email?: string;
    ad?: string;
    soyad?: string;
    rol: string;
    aktif: boolean;
    olusturulmaTarihi: Date;
    sonGirisTarihi?: Date;
}

export interface IKullaniciOlustur {
    kullaniciAdi: string;
    sifre: string;
    email?: string;
    ad?: string;
    soyad?: string;
    rol?: string;
}

export interface IKullaniciGuncelle {
    email?: string;
    ad?: string;
    soyad?: string;
    aktif?: boolean;
}

export interface ISifreDegistir {
    eskiSifre: string;
    yeniSifre: string;
}

// Oturum tipleri
export interface IOturum {
    id: string;
    kullaniciId: string;
    token: string;
    refreshToken?: string;
    ipAdresi?: string;
    userAgent?: string;
    aktif: boolean;
    sonlanmaTarihi: Date;
}

export interface IOturumOlustur {
    kullaniciId: string;
    token: string;
    refreshToken?: string;
    ipAdresi?: string;
    userAgent?: string;
    sonlanmaTarihi: Date;
}

// Kimlik doğrulama tipleri
export interface IGirisYap {
    kullaniciAdi: string;
    sifre: string;
}

export interface IGirisYapCevap {
    kullanici: IKullanici;
    token: string;
    refreshToken?: string;
}

export interface IJWTPayload {
    id: string;
    kullaniciAdi: string;
    rol: string;
}

// Request with authenticated user
export interface AuthenticatedRequest extends Request {
    kullanici?: IJWTPayload;
}

// Audit log tipleri
export interface IDenetimLogu {
    kullaniciId?: string;
    aksiyon: string;
    kaynak: string;
    detay?: string;
    ipAdresi?: string;
    userAgent?: string;
    basarili: boolean;
}

// Kullanıcı ayarları
export interface IKullaniciAyarlari {
    tema: 'aydinlik' | 'koyu' | 'sistem';
    dil: string;
    bildirimler: boolean;
    emailBildirimleri: boolean;
    guvenlikUyarilari: boolean;
}

// Docker tipleri
export interface IDockerYapılandırma {
    ad: string;
    aciklama?: string;
    imajAdi: string;
    portEsleme?: { host: number; container: number }[];
    ortamDegiskenleri?: Record<string, string>;
    hacimler?: string[];
    agAyarlari?: any;
    yenidenBaslatma?: string;
}

// Uygulama şablonu
export interface IUygulamaSablonu {
    ad: string;
    aciklama: string;
    kategori: string;
    imaj: string;
    logo?: string;
    portlar?: { host: number; container: number }[];
    hacimler?: string[];
    ortamDegiskenleri?: Record<string, string>;
    dokumanUrl?: string;
    etiketler?: string[];
    populer?: boolean;
}

// Bildirim tipleri
export interface IBildirim {
    kullaniciId?: string;
    baslik: string;
    mesaj: string;
    tip: 'bilgi' | 'uyari' | 'hata' | 'basari';
    aksiyon?: {
        url: string;
        text: string;
    };
}

// Zamanlanmış görev
export interface IZamanlanmisGorev {
    ad: string;
    tip: string;
    cron: string;
    komut: any;
    aktif?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
    basarili: boolean;
    veri?: T;
    mesaj?: string;
}

export interface ApiErrorResponse {
    basarili: false;
    hata: {
        mesaj: string;
        kod?: string;
        detaylar?: any;
    };
}

// Pagination
export interface IPaginationParams {
    sayfa?: number;
    limit?: number;
    siralama?: string;
    yon?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
    veriler: T[];
    toplamSayfa: number;
    mevcutSayfa: number;
    toplamKayit: number;
    limit: number;
}
