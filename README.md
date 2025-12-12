# HomeOS - USB'den Başlatılabilir Linux Sistemi

Modern, kullanıcı dostu ev sunucu yönetim sistemi. CasaOS benzeri, USB'den doğrudan başlatılabilir.

![HomeOS](https://img.shields.io/badge/HomeOS-v1.0.0-blue)
![Lisans](https://img.shields.io/badge/lisans-MIT-green)
![Dil](https://img.shields.io/badge/dil-Türkçe-red)

## 🚀 Özellikler

- **📊 Gerçek Zamanlı Gösterge Paneli** - CPU, RAM, Disk ve Ağ istatistikleri
- **🐳 Docker Yönetimi** - Konteyner başlatma, durdurma, logları görüntüleme
- **📁 Dosya Yöneticisi** - Web tabanlı güvenli dosya gezgini
- **🏪 Uygulama Mağazası** - Popüler uygulamaları tek tıkla kurma
- **🔐 Güvenli Erişim** - JWT tabanlı kimlik doğrulama, hesap kilitleme
- **🌙 Modern Arayüz** - Glassmorphism tasarım, tam Türkçe arayüz
- **🛡️ Güvenlik Odaklı** - Rate limiting, XSS koruması, path traversal önleme

## 📋 Gereksinimler

- Node.js 18+
- pnpm paket yöneticisi
- Docker (konteyner yönetimi için)

## 🛠️ Kurulum

### 1. pnpm Kurulumu (yoksa)

```bash
npm install -g pnpm
```

### 2. Bağımlılıkları Yükleyin

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 3. Ortam Değişkenlerini Ayarlayın

```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin ve JWT_SECRET değerini değiştirin!
```

### 4. Geliştirme Sunucularını Başlatın

```bash
# Backend (Terminal 1)
cd backend
pnpm dev

# Frontend (Terminal 2)
cd frontend
pnpm dev
```

### 5. Tarayıcıda Açın

- Arayüz: http://localhost:5173
- API: http://localhost:3001

**Varsayılan Giriş Bilgileri:**
- Kullanıcı: `admin`
- Şifre: `admin123`

> ⚠️ **Güvenlik Uyarısı:** Production ortamında şifreyi hemen değiştirin!

## 📁 Proje Yapısı

```
homeos/
├── .agent/
│   └── workflows/           # Proje standartları
│       └── homeos-standartlar.md
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.ts        # Ana sunucu
│   │   ├── rotalar/        # API endpoint'leri
│   │   │   ├── docker.ts   # Docker işlemleri
│   │   │   ├── sistem.ts   # Sistem bilgileri
│   │   │   ├── dosyalar.ts # Dosya yönetimi
│   │   │   └── kimlik.ts   # Kimlik doğrulama
│   │   └── servisler/      # İş mantığı
│   │       ├── DockerServisi.ts
│   │       ├── SistemServisi.ts
│   │       └── DosyaServisi.ts
│   └── package.json
│
├── frontend/               # React + Vite Arayüz
│   ├── src/
│   │   ├── sayfalar/      # Sayfa bileşenleri
│   │   ├── bilesenler/    # UI bileşenleri
│   │   └── depolar/       # Zustand state
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoint'leri

### Sistem
| Endpoint | Açıklama |
|---------|----------|
| `GET /api/sistem/bilgi` | Tam sistem bilgisi |
| `GET /api/sistem/istatistikler` | Anlık istatistikler |
| `GET /api/sistem/surecler` | Çalışan işlemler |

### Docker
| Endpoint | Açıklama |
|---------|----------|
| `GET /api/docker/konteynerler` | Tüm konteynerler |
| `POST /api/docker/konteynerler/:id/baslat` | Konteyner başlat |
| `POST /api/docker/konteynerler/:id/durdur` | Konteyner durdur |
| `GET /api/docker/konteynerler/:id/loglar` | Konteyner logları |

### Dosyalar
| Endpoint | Açıklama |
|---------|----------|
| `GET /api/dosyalar/listele` | Dizin içeriği |
| `POST /api/dosyalar/klasor-olustur` | Yeni klasör |
| `DELETE /api/dosyalar/sil` | Dosya/klasör sil |
| `POST /api/dosyalar/yukle` | Dosya yükle |

### Kimlik Doğrulama
| Endpoint | Açıklama |
|---------|----------|
| `POST /api/kimlik/giris` | Giriş yap |
| `GET /api/kimlik/dogrula` | Token doğrula |
| `POST /api/kimlik/sifre-degistir` | Şifre değiştir |

## 🛡️ Güvenlik Özellikleri

- **Helmet.js** - HTTP başlıkları güvenliği
- **Rate Limiting** - DDoS koruması (100 istek/15dk)
- **Giriş Kilitleme** - 5 başarısız denemede hesap kilitleme
- **bcrypt 12 Round** - Güçlü şifre hashleme
- **Path Traversal Koruması** - Dizin dışı erişimi engelleme
- **Dosya Türü Filtreleme** - .exe, .bat gibi tehlikeli dosyaları engelleme
- **Hassas Veri Maskeleme** - Log ve yanıtlarda şifre gizleme
- **Input Validation** - express-validator ile giriş doğrulama

## 🔄 Git İş Akışı

```bash
# Değişiklikleri ekle
git add .

# Türkçe açıklama ile commit
git commit -m "feat: yeni özellik açıklaması"

# Uzak depoya gönder
git push origin main
```

**Commit Formatı:**
- `feat:` - Yeni özellik
- `fix:` - Hata düzeltme
- `docs:` - Dokümantasyon
- `security:` - Güvenlik güncellemesi
- `refactor:` - Kod düzenleme

## 📝 Lisans

MIT Lisansı - Özgürce kullanın ve geliştirin!

## 🤝 Katkıda Bulunun

1. Projeyi fork yapın
2. Yeni özellik dalı oluşturun (`git checkout -b ozellik/yeni-ozellik`)
3. Değişikliklerinizi commit yapın (`git commit -m 'feat: yeni özellik'`)
4. Dalınıza push yapın (`git push origin ozellik/yeni-ozellik`)
5. Pull Request açın
