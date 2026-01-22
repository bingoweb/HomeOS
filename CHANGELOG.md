# Değişiklik Günlüğü

## [2.0.0] - 2026-01-22

### 🎉 Büyük Refactoring - Enterprise-Grade Architecture

#### Backend İyileştirmeleri

**Veritabanı & ORM**
- ✅ **Prisma ORM** entegrasyonu (SQLite dev, PostgreSQL production)
- ✅ **Kapsamlı veritabanı schema** - Kullanıcılar, oturumlar, audit log, ayarlar
- ✅ **Migration sistemi** - Prisma migrate ile veritabanı versiyonlama
- ✅ **Seed script** - Varsayılan admin kullanıcısı ve örnek veriler

**Mimari Pattern'ler**
- ✅ **Repository Pattern** - BaseRepository ve özelleştirilmiş repository'ler
- ✅ **Dependency Injection** - TSyringe ile IoC container
- ✅ **Service Layer** - İş mantığı servis katmanında ayrıldı
- ✅ **Custom Error Classes** - Tip bazlı hata yönetimi

**Güvenlik İyileştirmeleri**
- ✅ **HttpOnly Cookies** - Token'lar artık localStorage yerine güvenli cookie'lerde
- ✅ **Oturum Yönetimi** - Veritabanı tabanlı oturum takibi
- ✅ **Refresh Token** - 7 gün access token, 30 gün refresh token
- ✅ **Audit Logging** - Tüm kritik işlemler loglanıyor
- ✅ **Hesap Kilitleme** - Geliştirilmiş brute-force koruması

**Logging & Monitoring**
- ✅ **Winston Logger** - Structured logging (error.log, combined.log, audit.log)
- ✅ **Log Rotation** - Otomatik log dosyası yönetimi
- ✅ **Performance Logging** - İşlem süreleri izleniyor
- ✅ **Error Tracking** - Detaylı hata raporlama

**API Documentation**
- ✅ **Swagger/OpenAPI** - Tam API dokümantasyonu
- ✅ **Type Definitions** - Merkezi TypeScript tip tanımları
- ✅ **Request/Response Schemas** - Standart API yanıt formatları

**DevOps & Production**
- ✅ **Docker Compose** - Multi-container orchestration
- ✅ **Dockerfile** - Production-ready multi-stage build
- ✅ **Nginx Reverse Proxy** - SSL termination, load balancing hazır
- ✅ **Health Checks** - Container health monitoring
- ✅ **Environment Management** - Geliştirilmiş .env konfigürasyonu

#### Frontend İyileştirmeleri

**Mevcut Sayfalar**
- ✅ Ayarlar sayfası zaten mevcut (Hesap, Güvenlik, Sistem)
- ✅ Uygulama Mağazası zaten mevcut (8 popüler uygulama)
- ✅ Gösterge Paneli - Real-time sistem istatistikleri
- ✅ Docker Konteyner Yönetimi
- ✅ Dosya Yöneticisi

**Planlanan Geliştirmeler**
- 🔄 Cookie-based authentication entegrasyonu
- 🔄 Toast notification sistemi
- 🔄 Error boundaries
- 🔄 React Query entegrasyonu
- 🔄 Code splitting & lazy loading

#### Yeni Özellikler

1. **Multi-User Support** - Veritabanı tabanlı çoklu kullanıcı
2. **Role-Based Access Control (RBAC)** - Yönetici ve kullanıcı rolleri
3. **Session Management** - Aktif oturum izleme ve yönetimi
4. **Audit Trail** - Tüm sistem olayları kaydediliyor
5. **User Settings** - Kullanıcı başına tema, dil, bildirim ayarları
6. **App Store Templates** - Hazır Docker konteyner şablonları
7. **Scheduled Tasks** - Zamanlanmış görevler (yedekleme, temizlik)
8. **Notifications** - Kullanıcı bildirimleri sistemi

#### Breaking Changes

⚠️ **Veritabanı Gereksinimi**
- Artık in-memory storage yerine gerçek veritabanı kullanılıyor
- Development: SQLite (otomatik)
- Production: PostgreSQL (önerilen)

⚠️ **Environment Variables**
- Yeni zorunlu değişkenler: `DATABASE_URL`, `SESSION_SECRET`
- Güncellenmiş `.env.example` dosyasına bakın

⚠️ **Authentication Flow**
- Cookie-based authentication (backward compatible)
- Refresh token mekanizması

#### Migration Guide

**Mevcut Kullanıcılar İçin:**

1. Veritabanını initialize edin:
```bash
cd backend
pnpm prisma db push
pnpm db:seed
```

2. `.env` dosyasını güncelleyin:
```bash
cp .env.example .env
# JWT_SECRET ve SESSION_SECRET değerlerini değiştirin!
```

3. Yeni bağımlılıkları yükleyin:
```bash
pnpm install
```

4. Uygulamayı başlatın:
```bash
pnpm dev
```

#### Production Deployment

```bash
# Docker Compose ile deployment
docker-compose up -d

# Veya manuel deployment
cd backend
pnpm prisma migrate deploy
pnpm prisma db seed
pnpm build
pnpm start
```

#### Güvenlik Notları

- ⚠️ Varsayılan admin şifresi: `admin123` - **Mutlaka değiştirin!**
- ⚠️ Production'da SSL/TLS kullanın
- ⚠️ `JWT_SECRET` ve `SESSION_SECRET` değerlerini güçlü yapın
- ⚠️ PostgreSQL şifresini değiştirin

#### Performans İyileştirmeleri

- Veritabanı sorguları optimize edildi
- Connection pooling hazır
- Query result caching için Redis desteği hazır
- Nginx ile static asset caching

#### Bilinen Sorunlar

- Bazı eski endpoint'ler yeni repository pattern'e migrate edilmedi
- Frontend cookie-based auth entegrasyonu devam ediyor
- Test coverage henüz %100 değil

#### Sonraki Sürüm (v2.1.0)

- [ ] React Query entegrasyonu
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced Docker features (networks, volumes)
- [ ] Backup/restore functionality
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements

---

## [1.0.0] - 2026-01-15

### İlk Sürüm

- 🎉 HomeOS projesi başlatıldı
- ✅ Temel sistem bilgileri gösterimi
- ✅ Docker konteyner yönetimi
- ✅ Dosya yöneticisi
- ✅ JWT kimlik doğrulama
- ✅ Tam Türkçe arayüz
