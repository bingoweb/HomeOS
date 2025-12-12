import { useState } from 'react';
import {
    Store,
    Search,
    Download,
    Star,
    ExternalLink,
    Loader2
} from 'lucide-react';
import axios from 'axios';

interface App {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    stars: number;
    ports: string[];
}

const apps: App[] = [
    {
        id: 'nginx',
        name: 'Nginx',
        description: 'Yüksek performanslı web sunucusu ve reverse proxy',
        image: 'nginx:alpine',
        category: 'Web',
        stars: 5,
        ports: ['80:80', '443:443']
    },
    {
        id: 'portainer',
        name: 'Portainer',
        description: 'Docker ve Kubernetes için görsel yönetim arayüzü',
        image: 'portainer/portainer-ce:latest',
        category: 'Yönetim',
        stars: 5,
        ports: ['9000:9000']
    },
    {
        id: 'filebrowser',
        name: 'File Browser',
        description: 'Web tabanlı dosya yöneticisi',
        image: 'filebrowser/filebrowser:latest',
        category: 'Dosya',
        stars: 4,
        ports: ['8080:80']
    },
    {
        id: 'nextcloud',
        name: 'Nextcloud',
        description: 'Kendi bulut depolama ve işbirliği platformunuz',
        image: 'nextcloud:latest',
        category: 'Bulut',
        stars: 5,
        ports: ['8081:80']
    },
    {
        id: 'heimdall',
        name: 'Heimdall',
        description: 'Uygulama dashboard\'u ve başlatıcı',
        image: 'linuxserver/heimdall:latest',
        category: 'Yönetim',
        stars: 4,
        ports: ['8082:80']
    },
    {
        id: 'plex',
        name: 'Plex',
        description: 'Medya sunucusu - Film, dizi ve müzik akışı',
        image: 'plexinc/pms-docker:latest',
        category: 'Medya',
        stars: 5,
        ports: ['32400:32400']
    },
    {
        id: 'pihole',
        name: 'Pi-hole',
        description: 'Ağ düzeyinde reklam engelleme',
        image: 'pihole/pihole:latest',
        category: 'Ağ',
        stars: 5,
        ports: ['53:53', '8083:80']
    },
    {
        id: 'homeassistant',
        name: 'Home Assistant',
        description: 'Açık kaynaklı akıllı ev otomasyonu',
        image: 'homeassistant/home-assistant:stable',
        category: 'IoT',
        stars: 5,
        ports: ['8123:8123']
    }
];

const categories = ['Tümü', 'Web', 'Yönetim', 'Dosya', 'Bulut', 'Medya', 'Ağ', 'IoT'];

export default function AppStore() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [installing, setInstalling] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
            app.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Tümü' || app.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleInstall = async (app: App) => {
        setInstalling(app.id);
        setMessage(null);

        try {
            // First pull the image
            await axios.post('/api/docker/images/pull', { image: app.image });

            // Then you would create the container - for now just show success
            setMessage({ type: 'success', text: `${app.name} başarıyla indirildi! Container oluşturmak için Docker CLI kullanın.` });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Kurulum başarısız' });
        } finally {
            setInstalling(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">App Store</h1>
                <p className="text-gray-400 mt-1">Popüler uygulamaları tek tıkla kurun</p>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Uygulama ara..."
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl transition-colors ${selectedCategory === category
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredApps.map((app) => (
                    <div key={app.id} className="glass-card rounded-2xl p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                                <Store className="w-6 h-6 text-primary-400" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-gray-400">{app.stars}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-1">{app.name}</h3>
                        <p className="text-sm text-gray-400 mb-4 flex-1">{app.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {app.ports.map((port, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">
                                    {port}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleInstall(app)}
                            disabled={installing === app.id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {installing === app.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Kuruluyor...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Kur
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {filteredApps.length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <Store className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Uygulama Bulunamadı</h3>
                    <p className="text-gray-400">Arama kriterlerinize uygun uygulama yok.</p>
                </div>
            )}
        </div>
    );
}
