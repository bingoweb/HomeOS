import { chromium, Page } from 'playwright';

async function verifyDesign() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Route API requests to mocks to avoid backend errors
  await page.route('**/api/sistem/bilgi', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        basarili: true,
        veri: {
          cpu: { kullanim: 25, cekirdekSayisi: 8, model: 'Intel i7', hiz: 3.6 },
          bellek: { toplam: 16000000000, kullanilan: 8000000000, kullanimYuzdesi: 50 },
          disk: { toplam: 512000000000, kullanilan: 128000000000, kullanimYuzdesi: 25 },
          ag: { arayuzler: [], indirme: 1024, yukleme: 512 },
          isletimSistemi: { platform: 'linux', dagitim: 'Ubuntu', sunucuAdi: 'HomeServer', calismaSuresi: 3600 }
        }
      })
    });
  });

  await page.route('**/api/docker/konteynerler', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        basarili: true,
        veri: [
          { id: '1', calismaDurumu: 'running' },
          { id: '2', calismaDurumu: 'running' },
          { id: '3', calismaDurumu: 'exited' }
        ]
      })
    });
  });

  // Mock login to bypass auth check if needed, or simply test login page visuals
  // For now, let's verify login page first as it had heavy purple/blue usage
  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/giris');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'frontend/verification/login_page.png' });
  console.log('Login page screenshot taken.');

  // Now simulate login by setting token (if local storage is used) or just navigating if protected route handles it
  // Assuming Zustand persists to localStorage or we can mock the store.
  // Easier: Use the login form since we mocked the API endpoint? We didn't mock login API yet.

  await page.route('**/api/kimlik/giris', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        basarili: true,
        veri: {
          token: 'mock-token',
          kullanici: { ad: 'admin', rol: 'admin' }
        }
      })
    });
  });

  console.log('Attempting login...');
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

  // Wait a bit for animations
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'frontend/verification/dashboard_page.png' });
  console.log('Dashboard page screenshot taken.');

  await browser.close();
}

verifyDesign().catch(console.error);
