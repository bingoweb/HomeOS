# HomeOS v2.0 - Enterprise-Grade Ev Sunucu Yönetim Sistemi

Modern, güvenli, ölçeklenebilir ev sunucu yönetim platformu. USB'den başlatılabilir, production-ready.

![HomeOS](https://img.shields.io/badge/HomeOS-v2.0.0-blue)
![Lisans](https://img.shields.io/badge/lisans-MIT-green)
![Dil](https://img.shields.io/badge/dil-Türkçe-red)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Production Ready](https://img.shields.io/badge/production-ready-green)

## 🎉 v2.0 Yenilikler

- ✅ **Prisma ORM** - PostgreSQL/SQLite veritabanı desteği
- ✅ **Repository Pattern** - Clean architecture
- ✅ **Dependency Injection** - TSyringe IoC container
- ✅ **Winston Logging** - Professional logging system
- ✅ **HttpOnly Cookies** - Secure authentication
- ✅ **Swagger API Docs** - OpenAPI 3.0 documentation
- ✅ **Docker Compose** - Production deployment ready
- ✅ **Audit Logging** - Complete action tracking
- ✅ **Multi-User Support** - Database-backed user management

Detaylı değişiklikler için [CHANGELOG.md](./CHANGELOG.md) dosyasına bakın.

## 🚀 Özellikler

### Core Features
- 📊 **Real-time Dashboard** - CPU, RAM, Disk, Network (WebSocket)
- 🐳 **Docker Management** - Full container lifecycle
- 📁 **File Manager** - Secure web-based file browser
- 🏪 **App Store** - 8+ ready-to-use application templates
- ⚙️ **Settings Panel** - User, security, system configuration
- 🌙 **Modern UI** - Glassmorphism design, fully Turkish

### Backend Architecture
- 🗄️ **Prisma ORM** - Type-safe database access
- 📦 **Repository Pattern** - Separation of concerns
- 💉 **Dependency Injection** - Testable, maintainable code
- 📝 **Structured Logging** - Winston with rotation
- 🔄 **Refresh Tokens** - Extended sessions (30 days)
- 📚 **API Documentation** - Swagger UI included
- 🎯 **Custom Error Handling** - Typed error responses

### Security Features
- 🔐 **JWT + Cookies** - HttpOnly, Secure, SameSite
- 🛡️ **RBAC** - Role-based access control
- 📊 **Audit Trail** - All critical actions logged
- ⏱️ **Rate Limiting** - DDoS protection
- 🔒 **Account Lockout** - Brute-force prevention
- 🔑 **bcrypt 12** - Strong password hashing
- 🚫 **Input Validation** - XSS & injection prevention

## 📋 Requirements

### Development
- Node.js 18+
- pnpm package manager
- Docker (optional, for container management)

### Production
- Docker & Docker Compose
- PostgreSQL 15+ (or SQLite for small deployments)
- SSL/TLS certificate (recommended)

## 🛠️ Quick Start (Development)

```bash
# 1. Clone repository
git clone <repository-url>
cd HomeOS

# 2. Install dependencies
cd backend && pnpm install
cd ../frontend && pnpm install

# 3. Setup database
cd ../backend
cp .env.example .env
# Edit .env and change JWT_SECRET, SESSION_SECRET!

pnpm prisma db push
pnpm db:seed

# 4. Start development servers
# Terminal 1 - Backend
pnpm dev

# Terminal 2 - Frontend
cd ../frontend
pnpm dev

# 5. Open browser
# Frontend: http://localhost:5173
# API: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
```

**Default Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change this password immediately after first login!**

## 🐳 Production Deployment

### Using Docker Compose (Recommended)

```bash
# 1. Clone and configure
git clone <repository-url>
cd HomeOS

# 2. Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env:
# - Change JWT_SECRET to a random 32+ char string
# - Change SESSION_SECRET to a random 32+ char string
# - Change POSTGRES_PASSWORD in docker-compose.yml

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Access
# http://your-server-ip (or configure DNS + SSL)
```

**Included Services:**
- `postgres` - PostgreSQL 15 database
- `redis` - Cache & session store
- `backend` - Node.js API server
- `frontend` - React SPA (nginx)
- `nginx` - Reverse proxy with SSL support

### Manual Deployment

```bash
# Backend
cd backend
pnpm install --prod
pnpm prisma migrate deploy
pnpm db:seed
pnpm build
NODE_ENV=production pnpm start

# Frontend
cd frontend
pnpm install
pnpm build
# Serve dist/ folder with nginx/apache
```

## 📁 Project Structure

```
homeos/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DI, Swagger)
│   │   ├── middleware/      # Auth, error handling
│   │   ├── repositories/    # Data access layer
│   │   ├── rotalar/         # API routes
│   │   ├── servisler/       # Business logic
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Helpers, logger, errors
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   ├── Dockerfile           # Production image
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── sayfalar/        # Pages
│   │   ├── bilesenler/      # Components
│   │   ├── depolar/         # Zustand stores
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── nginx/
│   └── nginx.conf           # Reverse proxy config
│
├── docker-compose.yml       # Multi-container orchestration
├── CHANGELOG.md             # Version history
└── README.md                # This file
```

## 🔌 API Documentation

### Live API Docs
Access Swagger UI at: `http://localhost:3001/api-docs`

### Key Endpoints

**Authentication**
```
POST   /api/kimlik/giris             Login
POST   /api/kimlik/cikis             Logout
POST   /api/kimlik/sifre-degistir    Change password
POST   /api/kimlik/yenile            Refresh token
GET    /api/kimlik/dogrula           Validate token
```

**System**
```
GET    /api/sistem/bilgi             Full system info
GET    /api/sistem/istatistikler     Real-time stats
GET    /api/sistem/surecler          Running processes
```

**Docker**
```
GET    /api/docker/konteynerler      List containers
POST   /api/docker/konteynerler/:id/baslat      Start
POST   /api/docker/konteynerler/:id/durdur      Stop
DELETE /api/docker/konteynerler/:id             Remove
GET    /api/docker/konteynerler/:id/loglar      Logs
```

**Files**
```
GET    /api/dosyalar/listele         List directory
POST   /api/dosyalar/klasor-olustur  Create folder
DELETE /api/dosyalar/sil             Delete file/folder
POST   /api/dosyalar/yukle           Upload file
```

## 🛡️ Security

### Production Checklist

- [ ] Change `JWT_SECRET` to strong random value (32+ chars)
- [ ] Change `SESSION_SECRET` to strong random value (32+ chars)
- [ ] Change default admin password
- [ ] Change PostgreSQL password
- [ ] Setup SSL/TLS (Let's Encrypt recommended)
- [ ] Configure firewall (only 80, 443 open)
- [ ] Set `NODE_ENV=production`
- [ ] Enable `COOKIE_SECURE=true`
- [ ] Setup log rotation
- [ ] Configure backup strategy
- [ ] Review rate limiting settings

### Security Features

**Authentication & Authorization**
- JWT with access (7d) & refresh (30d) tokens
- HttpOnly, Secure, SameSite cookies
- Role-based access control (yonetici, kullanici)
- Database-backed session management
- Account lockout: 5 failures → 15min lock

**Network Security**
- Helmet.js security headers
- CORS with origin validation
- Rate limiting: 100 req/15min (general), 5 req/1h (login)
- CSRF protection ready

**Data Security**
- bcrypt password hashing (12 rounds)
- Input validation (express-validator)
- XSS protection (sanitize-html, DOMPurify)
- Path traversal prevention
- SQL injection prevention (Prisma ORM)

**Monitoring**
- Audit logging for all critical actions
- Winston structured logging
- Performance tracking
- Error tracking with stack traces

## 🔧 Configuration

### Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Server
PORT=3001
NODE_ENV=production

# Security (CHANGE THESE!)
JWT_SECRET=your-super-secret-key-32-chars-minimum
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
SESSION_SECRET=another-secret-key-32-chars-minimum
BCRYPT_ROUNDS=12

# Database
# Development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (PostgreSQL)
# DATABASE_URL="postgresql://homeos:password@localhost:5432/homeos?schema=public"

# CORS
IZIN_VERILEN_ORIGIN=https://yourdomain.com

# Cookies
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# File Upload
MAX_FILE_SIZE=104857600
MAX_FILES=10
```

## 📊 Database

### Migrations

```bash
# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migrations (production)
pnpm prisma migrate deploy

# Reset database (dev only!)
pnpm prisma migrate reset

# Open Prisma Studio
pnpm prisma studio
```

### Seed Data

```bash
# Seed database
pnpm db:seed
```

Default seed includes:
- Admin user (admin/admin123)
- Default settings
- 6 application templates (Nextcloud, Portainer, etc.)

## 🧪 Testing

```bash
# Run tests (coming soon)
pnpm test

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

## 🚀 Performance

### Optimization Tips

1. **Production Build**: Always use `pnpm build` for production
2. **Database Indexing**: Schema includes optimized indexes
3. **Caching**: Redis ready for session & API caching
4. **Static Assets**: Nginx serves frontend with caching
5. **Connection Pooling**: Prisma handles DB connection pool
6. **Code Splitting**: Frontend uses dynamic imports (coming)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Commit Convention:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `security:` - Security update
- `perf:` - Performance improvement

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by CasaOS
- Built with React, Express, Prisma, and TypeScript
- Icons by Lucide React

## 📧 Support

- Issues: GitHub Issues
- Documentation: [GitHub Wiki](#)
- Community: [Discord](#) (coming soon)

---

**Version:** 2.0.0
**Last Updated:** 2026-01-22
**Minimum Node.js:** 18.0.0
