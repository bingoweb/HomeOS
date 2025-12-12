import { useEffect, useState } from 'react';
import {
    Container as ContainerIcon,
    Play,
    Square,
    RefreshCw,
    Trash2,
    Terminal,
    MoreVertical,
    Search,
    X
} from 'lucide-react';
import axios from 'axios';

interface Container {
    id: string;
    name: string;
    image: string;
    status: string;
    state: string;
    created: number;
    ports: { privatePort: number; publicPort?: number; type: string }[];
}

export default function Containers() {
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
    const [logs, setLogs] = useState<string>('');
    const [showLogs, setShowLogs] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchContainers = async () => {
        try {
            const response = await axios.get('/api/docker/containers');
            if (response.data.success) {
                setContainers(response.data.data);
            }
        } catch (error) {
            console.error('Container fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContainers();
        const interval = setInterval(fetchContainers, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id: string, action: 'start' | 'stop' | 'restart' | 'remove') => {
        setActionLoading(id);
        try {
            if (action === 'remove') {
                await axios.delete(`/api/docker/containers/${id}?force=true`);
            } else {
                await axios.post(`/api/docker/containers/${id}/${action}`);
            }
            await fetchContainers();
        } catch (error) {
            console.error(`Container ${action} error:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleShowLogs = async (id: string) => {
        setSelectedContainer(id);
        setShowLogs(true);
        try {
            const response = await axios.get(`/api/docker/containers/${id}/logs?tail=200`);
            if (response.data.success) {
                setLogs(response.data.data);
            }
        } catch (error) {
            setLogs('Log alınamadı');
        }
    };

    const filteredContainers = containers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.image.toLowerCase().includes(search.toLowerCase())
    );

    const getStateColor = (state: string) => {
        switch (state) {
            case 'running': return 'bg-green-500';
            case 'exited': return 'bg-red-500';
            case 'paused': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Containerlar</h1>
                    <p className="text-gray-400 mt-1">Docker container yönetimi</p>
                </div>
                <button
                    onClick={fetchContainers}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Yenile
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Container ara..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
            </div>

            {/* Container List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : filteredContainers.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <ContainerIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Container Bulunamadı</h3>
                    <p className="text-gray-400">Docker çalışıyor mu? Container oluşturmak için App Store'u kullanın.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredContainers.map((container) => (
                        <div key={container.id} className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                {/* Status indicator */}
                                <div className={`w-3 h-3 rounded-full ${getStateColor(container.state)}`} />

                                {/* Container info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white truncate">{container.name}</h3>
                                        <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">{container.id}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{container.image}</p>
                                    <p className="text-xs text-gray-500 mt-1">{container.status}</p>
                                </div>

                                {/* Ports */}
                                {container.ports.length > 0 && (
                                    <div className="hidden md:flex flex-wrap gap-2">
                                        {container.ports.filter(p => p.publicPort).map((port, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                {port.publicPort}:{port.privatePort}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {container.state === 'running' ? (
                                        <button
                                            onClick={() => handleAction(container.id, 'stop')}
                                            disabled={actionLoading === container.id}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                                            title="Durdur"
                                        >
                                            <Square className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(container.id, 'start')}
                                            disabled={actionLoading === container.id}
                                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
                                            title="Başlat"
                                        >
                                            <Play className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction(container.id, 'restart')}
                                        disabled={actionLoading === container.id}
                                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-colors"
                                        title="Yeniden Başlat"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleShowLogs(container.id)}
                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                        title="Loglar"
                                    >
                                        <Terminal className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(container.id, 'remove')}
                                        disabled={actionLoading === container.id}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Logs Modal */}
            {showLogs && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-lg font-semibold text-white">Container Logları</h3>
                            <button onClick={() => setShowLogs(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{logs}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
