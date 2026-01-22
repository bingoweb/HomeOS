# HomeOS Frontend UI/UX Yenileme Yol Haritası (v2.0.0)

**Toplam Hedef:** 35 Görev
**Tahmini Süre:** 45-59 Gün

## Faz 1: Kritik Altyapı (🔴 CRITICAL, 7-9 Gün)

- [x] **Todo-001: Design System Foundation** (Kritik)
  - `tailwind.config.js` güncellemesi, Font family (Inter), Spacing grid, Z-index scale, Custom shadows, Global CSS cleanup.
- [x] **Todo-002: Toast/Notification Sistemi** (Kritik)
  - `react-hot-toast` entegrasyonu, Custom wrapper, Success/Error/Warning/Info varyantları.
- [x] **Todo-003: Axios Global Configuration** (Kritik)
  - `src/araclar/api.ts` oluştur, Interceptorlar, Timeout, Retry logic.
- [x] **Todo-004: Modal Component System** (Kritik)
  - Base Modal, Alert, Confirm, Focus trap, Keyboard support.
- [x] **Todo-005: Mobile Responsive Sidebar** (Kritik)
  - Hamburger menu, Overlay, Slide animation, Persistent state.

## Faz 2: Component Library (🟡 HIGH, 5-6 Gün)

- [ ] **Todo-006: Button Component** (High) - `Dugme.tsx`
- [ ] **Todo-007: Input Component** (High) - `Girdi.tsx`
- [ ] **Todo-008: Card Component** (High) - `Kart.tsx`
- [ ] **Todo-009: Loading Component** (High) - `Yukleniyor.tsx`
- [ ] **Todo-010: Badge Component** (High) - `Rozet.tsx`
- [ ] **Todo-011: EmptyState Component** (High) - `BosDurum.tsx`
- [ ] **Todo-012: ErrorBoundary Component** (High) - `HataSiniri.tsx`

## Faz 3: Sayfa Refactoring (🟢 MEDIUM, 12-16 Gün)

- [ ] **Todo-013: WebSocket Custom Hook** (Medium)
- [ ] **Todo-014: Giris.tsx Refactor** (Easy)
- [ ] **Todo-015: GostergePaneli.tsx Refactor** (Medium)
- [ ] **Todo-016: Konteynerler.tsx Refactor** (Hard)
- [ ] **Todo-017: DosyaYoneticisi.tsx Refactor** (Hard)
- [ ] **Todo-018: UygulamaMagazasi.tsx Refactor** (Medium)
- [ ] **Todo-019: Ayarlar.tsx Refactor** (Medium)

## Faz 4: Advanced Components (🟣 LOW, 10-13 Gün)

- [ ] **Todo-020: Dropdown/Menu Component** (Low)
- [ ] **Todo-021: Recharts Kaldırma** (Medium)
- [ ] **Todo-022: Table Component** (Low) - `Tablo.tsx`
- [ ] **Todo-023: Tabs Component** (Low) - `Sekmeler.tsx`
- [ ] **Todo-024: Form Component System** (Low)
- [ ] **Todo-025: Select/Combobox Component** (Low)

## Faz 5: Optimizasyon & Polish (🔵 LOWEST, 11-15 Gün)

- [ ] **Todo-026: Code Splitting**
- [ ] **Todo-027: React.memo & useMemo**
- [ ] **Todo-028: Theme Toggle System**
- [ ] **Todo-029: Global Error Handler**
- [ ] **Todo-030: Accessibility Improvements**
- [ ] **Todo-031: Responsive Grid Optimization**
- [ ] **Todo-032: Loading State Standardization**
- [ ] **Todo-033: Image Optimization**
- [ ] **Todo-034: PWA Support**
- [ ] **Todo-035: Testing Infrastructure**
