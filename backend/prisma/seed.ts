/**
 * Database Seed Script
 * Initializes database with default data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

    // Varsayılan admin kullanıcısı
    const adminSifre = await bcrypt.hash('admin123', 12);

    const admin = await prisma.kullanici.upsert({
        where: { kullaniciAdi: 'admin' },
        update: {},
        create: {
            kullaniciAdi: 'admin',
            sifre: adminSifre,
            email: 'admin@homeos.local',
            ad: 'Sistem',
            soyad: 'Yöneticisi',
            rol: 'yonetici',
            aktif: true
        }
    });

    console.log('✅ Admin kullanıcısı oluşturuldu:', admin.kullaniciAdi);

    // Admin ayarları
    await prisma.kullaniciAyarlari.upsert({
        where: { kullaniciId: admin.id },
        update: {},
        create: {
            kullaniciId: admin.id,
            tema: 'koyu',
            dil: 'tr',
            bildirimler: true,
            emailBildirimleri: false,
            guvenlikUyarilari: true
        }
    });

    console.log('✅ Admin ayarları oluşturuldu');

    // Sistem ayarları
    const sistemAyarlarList = [
        { anahtar: 'site_adi', deger: 'HomeOS', tip: 'string', aciklama: 'Site adı' },
        { anahtar: 'bakim_modu', deger: 'false', tip: 'boolean', aciklama: 'Bakım modu' },
        { anahtar: 'kayit_acik', deger: 'false', tip: 'boolean', aciklama: 'Yeni kullanıcı kaydı açık mı?' },
        { anahtar: 'max_oturum_suresi', deger: '168', tip: 'number', aciklama: 'Maksimum oturum süresi (saat)' },
        { anahtar: 'log_saklama_suresi', deger: '90', tip: 'number', aciklama: 'Log saklama süresi (gün)' }
    ];

    for (const ayar of sistemAyarlarList) {
        await prisma.sistemAyarlari.upsert({
            where: { anahtar: ayar.anahtar },
            update: {},
            create: ayar
        });
    }

    console.log('✅ Sistem ayarları oluşturuldu');

    // Örnek uygulama şablonları
    const uygulamaSablonlari = [
        {
            ad: 'Nextcloud',
            aciklama: 'Kendi bulut depolama çözümünüz',
            kategori: 'depolama',
            imaj: 'nextcloud:latest',
            portlar: JSON.stringify([{ host: 8080, container: 80 }]),
            hacimler: JSON.stringify(['/var/www/html']),
            etiketler: JSON.stringify(['bulut', 'depolama', 'dosya']),
            populer: true
        },
        {
            ad: 'Portainer',
            aciklama: 'Docker yönetim arayüzü',
            kategori: 'gelistirme',
            imaj: 'portainer/portainer-ce:latest',
            portlar: JSON.stringify([{ host: 9000, container: 9000 }]),
            hacimler: JSON.stringify(['/var/run/docker.sock:/var/run/docker.sock']),
            etiketler: JSON.stringify(['docker', 'yonetim']),
            populer: true
        },
        {
            ad: 'Pi-hole',
            aciklama: 'Ağ çapında reklam engelleyici',
            kategori: 'guvenlik',
            imaj: 'pihole/pihole:latest',
            portlar: JSON.stringify([{ host: 53, container: 53 }, { host: 8053, container: 80 }]),
            ortamDegiskenleri: JSON.stringify({ TZ: 'Europe/Istanbul' }),
            etiketler: JSON.stringify(['dns', 'reklam-engelleme', 'guvenlik']),
            populer: true
        },
        {
            ad: 'Jellyfin',
            aciklama: 'Medya sunucusu',
            kategori: 'medya',
            imaj: 'jellyfin/jellyfin:latest',
            portlar: JSON.stringify([{ host: 8096, container: 8096 }]),
            hacimler: JSON.stringify(['/config', '/media']),
            etiketler: JSON.stringify(['medya', 'video', 'muzik']),
            populer: true
        },
        {
            ad: 'Prometheus',
            aciklama: 'Metrik toplama ve izleme',
            kategori: 'izleme',
            imaj: 'prom/prometheus:latest',
            portlar: JSON.stringify([{ host: 9090, container: 9090 }]),
            hacimler: JSON.stringify(['/etc/prometheus', '/prometheus']),
            etiketler: JSON.stringify(['monitoring', 'metrik']),
            populer: false
        },
        {
            ad: 'Grafana',
            aciklama: 'Metrik görselleştirme',
            kategori: 'izleme',
            imaj: 'grafana/grafana:latest',
            portlar: JSON.stringify([{ host: 3000, container: 3000 }]),
            hacimler: JSON.stringify(['/var/lib/grafana']),
            etiketler: JSON.stringify(['monitoring', 'dashboard']),
            populer: false
        }
    ];

    for (const sablon of uygulamaSablonlari) {
        await prisma.uygulamaSablonu.upsert({
            where: { id: sablon.ad.toLowerCase().replace(/[^a-z0-9]/g, '-') },
            update: {},
            create: {
                ...sablon,
                id: sablon.ad.toLowerCase().replace(/[^a-z0-9]/g, '-')
            }
        });
    }

    console.log('✅ Uygulama şablonları oluşturuldu');

    console.log('🎉 Seed işlemi tamamlandı!');
}

main()
    .catch((e) => {
        console.error('❌ Seed hatası:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
