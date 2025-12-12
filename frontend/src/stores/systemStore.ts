import { create } from 'zustand';

interface SystemStats {
    cpu: number;
    memory: number;
    disk: number;
    networkRx: number;
    networkTx: number;
}

interface SystemState {
    stats: SystemStats;
    isConnected: boolean;
    setStats: (stats: SystemStats) => void;
    setConnected: (connected: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    stats: {
        cpu: 0,
        memory: 0,
        disk: 0,
        networkRx: 0,
        networkTx: 0,
    },
    isConnected: false,
    setStats: (stats) => set({ stats }),
    setConnected: (isConnected) => set({ isConnected }),
}));
