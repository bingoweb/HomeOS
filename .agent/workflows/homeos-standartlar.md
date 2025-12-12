---
description: HomeOS proje geliştirme standartları ve kuralları
---

# HomeOS Proje Workflow

Bu workflow, HomeOS projesi için geliştirme standartlarını ve kurallarını tanımlar.

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

### 3. Dil: Türkçe
- Tüm değişken isimleri Türkçe olabilir (camelCase)
- Yorumlar Türkçe yazılmalı
- Kullanıcı arayüzü metinleri Türkçe
- README ve dokümantasyon Türkçe
- Hata mesajları Türkçe
- API yanıtları Türkçe

### 4. Güvenlik Kontrol Listesi
Her kod yazımında şunlar kontrol edilmeli:

**Backend:**
- [ ] SQL Injection koruması (parametreli sorgular)
- [ ] XSS koruması (input sanitization)
- [ ] CSRF koruması
- [ ] Rate limiting
- [ ] JWT token süre kontrolü
- [ ] Şifre hashleme (bcrypt, minimum 10 round)
- [ ] Hassas veri loglama engeli
- [ ] Path traversal koruması (dosya işlemlerinde)
- [ ] Helmet.js kullanımı
- [ ] CORS yapılandırması

**Frontend:**
- [ ] XSS koruması (dangerouslySetInnerHTML kaçınma)
- [ ] Input validation
- [ ] Token güvenli saklama
- [ ] HTTPS zorunluluğu

### 5. Klasör Yapısı Standardı

```
homeos/
├── .agent/
│   └── workflows/          # Proje workflow dosyaları
├── backend/                # Node.js + TypeScript API
│   ├── src/
│   │   ├── yapilandirma/   # Yapılandırma dosyaları
│   │   ├── rotalar/        # API endpoint'leri
│   │   ├── servisler/      # İş mantığı
│   │   ├── yardimcilar/    # Yardımcı fonksiyonlar
│   │   ├── tipler/         # TypeScript tipleri
│   │   └── index.ts        # Ana giriş noktası
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite Dashboard
│   ├── src/
│   │   ├── sayfalar/       # Sayfa componentleri
│   │   ├── bilesenler/     # UI componentleri
│   │   ├── depolar/        # State yönetimi
│   │   ├── hooklar/        # Custom React hooks
│   │   ├── servisler/      # API çağrıları
│   │   ├── tipler/         # TypeScript tipleri
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── build/                  # ISO oluşturma
├── docs/                   # Dokümantasyon
├── .gitignore
└── README.md
```

## 🔄 Geliştirme Döngüsü

1. **Başlamadan önce:** En son değişiklikleri çek
2. **Kod yazarken:** Güvenlik kontrol listesini takip et
3. **Test:** Her değişikliği test et
4. **Commit:** Açıklayıcı Türkçe mesajla commit yap
5. **Push:** GitHub'a gönder

## 📦 Sürüm Yönetimi

Semantic Versioning kullanılır: `MAJOR.MINOR.PATCH`

- **MAJOR:** Geriye dönük uyumsuz değişiklikler
- **MINOR:** Geriye dönük uyumlu yeni özellikler
- **PATCH:** Geriye dönük uyumlu hata düzeltmeleri

## 🚀 Deployment Komutları

```bash
# Backend build
cd backend && pnpm build

# Frontend build
cd frontend && pnpm build

# Her ikisini başlat (development)
# Terminal 1:
cd backend && pnpm dev

# Terminal 2:
cd frontend && pnpm dev
```
