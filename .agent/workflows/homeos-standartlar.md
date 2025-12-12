---
description: HomeOS proje geliştirme standartları ve kuralları
---

# HomeOS Proje Workflow

Bu workflow, HomeOS projesi için geliştirme standartlarını ve kurallarını tanımlar. **Her geliştirme aşamasında bu kurallara uyulmalıdır.**

## 🎯 Temel Kurallar

### 1. Versiyon Kontrolü (Git)
Her önemli değişiklikten sonra otomatik commit yapılmalı:

// turbo-all

```bash
# Projeye git init (ilk kez)
cd c:\Users\tayla\OneDrive\Masaüstü\linux
git init

# Değişiklikleri ekle
git add .

# Commit yap (açıklayıcı Türkçe mesaj)
git commit -m "feat: [özellik açıklaması]"

# GitHub'a gönder
git push
```

**Commit Mesajı Formatı:**
- `feat:` - Yeni özellik
- `fix:` - Hata düzeltme
- `docs:` - Dokümantasyon
- `refactor:` - Kod düzenleme
- `security:` - Güvenlik güncellemesi

### 2. Paket Yöneticisi: pnpm
npm yerine **pnpm** kullanılmalı:

```bash
# pnpm kurulumu (global)
npm install -g pnpm

# Bağımlılık yükleme
pnpm install

# Paket ekleme
pnpm add <paket-adı>

# Geliştirme paketi ekleme
pnpm add -D <paket-adı>
```

### 3. Dil: Türkçe (ZORUNLU)

**Tüm proje Türkçe olmalıdır:**

#### Dosya ve Klasör İsimleri:

| İngilizce | Türkçe |
|-----------|--------|
| `routes/` | `rotalar/` |
| `services/` | `servisler/` |
| `pages/` | `sayfalar/` |
| `components/` | `bilesenler/` |
| `stores/` | `depolar/` |
| `helpers/` | `yardimcilar/` |
| `types/` | `tipler/` |
| `auth.ts` | `kimlik.ts` |
| `system.ts` | `sistem.ts` |
| `files.ts` | `dosyalar.ts` |
| `docker.ts` | `docker.ts` (özel isim) |
| `Login.tsx` | `Giris.tsx` |
| `Dashboard.tsx` | `GostergePaneli.tsx` |
| `Settings.tsx` | `Ayarlar.tsx` |
| `Containers.tsx` | `Konteynerler.tsx` |
| `Files.tsx` | `DosyaYoneticisi.tsx` |
| `AppStore.tsx` | `UygulamaMagazasi.tsx` |
| `Sidebar.tsx` | `YanMenu.tsx` |
| `authStore.ts` | `kimlikDeposu.ts` |
| `systemStore.ts` | `sistemDeposu.ts` |

#### Değişken ve Fonksiyon İsimleri:

| İngilizce | Türkçe |
|-----------|--------|
| `user` | `kullanici` |
| `password` | `sifre` |
| `username` | `kullaniciAdi` |
| `token` | `token` (özel) |
| `login` | `girisYap` |
| `logout` | `cikisYap` |
| `isAuthenticated` | `girisYapildiMi` |
| `loading` | `yukleniyor` |
| `error` | `hata` |
| `success` | `basarili` |
| `data` | `veri` |
| `message` | `mesaj` |
| `navigate` | `yonlendir` |
| `fetch` | `getir` |

#### API Yanıt Formatı:
```json
{
  "basarili": true,
  "veri": { ... },
  "hata": null
}
```

### 4. Güvenlik Kontrol Listesi
Her kod yazımında şunlar kontrol edilmeli:

**Backend:**
- [ ] SQL Injection koruması (parametreli sorgular)
- [ ] XSS koruması (input sanitization)
- [ ] CSRF koruması
- [ ] Rate limiting (100 istek/15dk)
- [ ] JWT token süre kontrolü (7 gün)
- [ ] Şifre hashleme (bcrypt, minimum 12 round)
- [ ] Hassas veri loglama engeli
- [ ] Path traversal koruması
- [ ] Helmet.js kullanımı
- [ ] CORS yapılandırması
- [ ] Giriş deneme limiti (5 deneme → 15dk kilit)

**Frontend:**
- [ ] XSS koruması (DOMPurify)
- [ ] Input validation
- [ ] Token güvenli saklama (persist)
- [ ] HTTPS zorunluluğu (production)

### 5. Klasör Yapısı Standardı

```
homeos/
├── .agent/
│   └── workflows/
│       └── homeos-standartlar.md   # Bu dosya
├── .git/                           # Git deposu
├── .gitignore
├── README.md
│
├── backend/                        # Node.js + TypeScript API
│   ├── src/
│   │   ├── index.ts               # Ana sunucu
│   │   ├── rotalar/               # API endpoint'leri
│   │   │   ├── docker.ts
│   │   │   ├── sistem.ts
│   │   │   ├── dosyalar.ts
│   │   │   └── kimlik.ts
│   │   └── servisler/             # İş mantığı
│   │       ├── DockerServisi.ts
│   │       ├── SistemServisi.ts
│   │       └── DosyaServisi.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # React + Vite Dashboard
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── sayfalar/              # Sayfa componentleri
│   │   │   ├── index.ts
│   │   │   ├── Giris.tsx
│   │   │   ├── GostergePaneli.tsx
│   │   │   ├── Konteynerler.tsx
│   │   │   ├── DosyaYoneticisi.tsx
│   │   │   ├── Ayarlar.tsx
│   │   │   └── UygulamaMagazasi.tsx
│   │   ├── bilesenler/            # UI componentleri
│   │   │   ├── index.ts
│   │   │   ├── YanMenu.tsx
│   │   │   └── SistemGostergesi.tsx
│   │   └── depolar/               # State yönetimi
│   │       ├── index.ts
│   │       ├── kimlikDeposu.ts
│   │       └── sistemDeposu.ts
│   ├── public/
│   │   └── favicon.svg
│   └── package.json
│
├── build/                          # ISO oluşturma (gelecek)
└── docs/                           # Dokümantasyon (gelecek)
```

## 🔄 Geliştirme Döngüsü

1. **Her görev başında:** Bu workflow dosyasını kontrol et
2. **Kodlama sırasında:** Türkçe isimlendirme ve güvenlik kurallarına uy
3. **Tamamlandığında:** Test et, commit yap, push et

## ⚠️ ZORUNLU KURALLAR

1. **Türkçe:** Dosya isimleri, değişkenler, yorumlar, UI metinleri HEP Türkçe
2. **pnpm:** npm kullanılmaz
3. **Git:** Her değişiklik commit edilir
4. **Güvenlik:** Kontrol listesi her zaman takip edilir
5. **Klasör Yapısı:** Yukarıdaki yapıya uyulur, dağınık çalışılmaz
