import { useEffect, useState } from 'react';
import {
    Cpu,
    HardDrive,
    MemoryStick,
    Network,
    Container,
    Server,
    Activity,
    Clock
} from 'lucide-react';
import axios from 'axios';
import { useSystemStore } from '../stores/systemStore';
import SystemGauge from '../components/SystemGauge';

interface SystemInfo {
    cpu: { usage: number; cores: number; model: string; speed: number };
    memory: { total: number; used: number; usagePercent: number };
    disk: { total: number; used: number; usagePercent: number };
    network: { interfaces: any[]; rx: number; tx: number };
    os: { platform: string; distro: string; hostname: string; uptime: number };
}

interface ContainerSummary {
    total: number;
    running: number;
    stopped: number;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}g ${hours}s ${minutes}d`;
    if (hours > 0) return `${hours}s ${minutes}d`;
    return `${minutes}d`;
}

export default function Dashboard() {
    const { stats, setStats, setConnected } = useSystemStore();
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [containers, setContainers] = useState<ContainerSummary>({ total: 0, running: 0, stopped: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial system info
        const fetchSystemInfo = async () => {
            try {
                const response = await axios.get('/api/system/info');
                if (response.data.success) {
                    setSystemInfo(response.data.data);
                }
            } catch (error) {
                console.error('System info error:', error);
            }
        };

        // Fetch container summary
        const fetchContainers = async () => {
            try {
                const response = await axios.get('/api/docker/containers');
                if (response.data.success) {
                    const all = response.data.data;
                    setContainers({
                        total: all.length,
                        running: all.filter((c: any) => c.state === 'running').length,
                        stopped: all.filter((c: any) => c.state !== 'running').length
                    });
                }
            } catch (error) {
                console.error('Container fetch error:', error);
            }
        };

        fetchSystemInfo();
        fetchContainers();
        setLoading(false);

        // WebSocket connection for real-time stats
        const ws = new WebSocket(`ws://${window.location.host}/ws`);

        ws.onopen = () => {
            setConnected(true);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'system-stats') {
                setStats(message.data);
            }
        };

        ws.onclose = () => {
            setConnected(false);
        };

        ws.onerror = () => {
            setConnected(false);
        };

        // Polling for container updates
        const containerInterval = setInterval(fetchContainers, 10000);

        return () => {
            ws.close();
            clearInterval(containerInterval);
        };
    }, [setStats, setConnected]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Sistem durumu ve genel bakış</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{new Date().toLocaleString('tr-TR')}</span>
                </div>
            </div>

            {/* System Info Card */}
            {systemInfo && (
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <Server className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{systemInfo.os.hostname}</h2>
                            <p className="text-gray-400">{systemInfo.os.distro} • {systemInfo.cpu.model}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-gray-400">Çalışma Süresi</p>
                            <p className="text-lg font-semibold text-white">{formatUptime(systemInfo.os.uptime)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CPU */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="font-semibold text-white">CPU</span>
                        </div>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <SystemGauge value={stats.cpu} color="#3b82f6" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {systemInfo?.cpu.cores} Cores @ {systemInfo?.cpu.speed} GHz
                    </p>
                </div>

                {/* Memory */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <MemoryStick className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="font-semibold text-white">Bellek</span>
                        </div>
                    </div>
                    <SystemGauge value={stats.memory} color="#22c55e" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {formatBytes(systemInfo?.memory.used || 0)} / {formatBytes(systemInfo?.memory.total || 0)}
                    </p>
                </div>

                {/* Disk */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <HardDrive className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="font-semibold text-white">Disk</span>
                        </div>
                    </div>
                    <SystemGauge value={stats.disk} color="#a855f7" />
                    <p className="text-center text-gray-400 text-sm mt-2">
                        {formatBytes(systemInfo?.disk.used || 0)} / {formatBytes(systemInfo?.disk.total || 0)}
                    </p>
                </div>

                {/* Network */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <Network className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="font-semibold text-white">Ağ</span>
                        </div>
                    </div>
                    <div className="text-center py-4">
                        <div className="flex justify-center gap-8">
                            <div>
                                <p className="text-2xl font-bold text-green-400">↓ {formatBytes(stats.networkRx)}/s</p>
                                <p className="text-xs text-gray-400">İndirme</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-400">↑ {formatBytes(stats.networkTx)}/s</p>
                                <p className="text-xs text-gray-400">Yükleme</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Containers Summary */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Container className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Containerlar</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <p className="text-3xl font-bold text-white">{containers.total}</p>
                        <p className="text-gray-400 text-sm">Toplam</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <p className="text-3xl font-bold text-green-400">{containers.running}</p>
                        <p className="text-gray-400 text-sm">Çalışıyor</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <p className="text-3xl font-bold text-red-400">{containers.stopped}</p>
                        <p className="text-gray-400 text-sm">Durduruldu</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
