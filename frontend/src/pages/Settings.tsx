import { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Shield,
    Wifi,
    HardDrive,
    Power,
    Save,
    Eye,
    EyeOff
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export default function Settings() {
    const user = useAuthStore((state) => state.user);
    const [activeTab, setActiveTab] = useState('account');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' });
            return;
        }

        try {
            const response = await axios.post('/api/auth/change-password', {
                username: user?.username,
                currentPassword,
                newPassword
            });
            if (response.data.success) {
                setPasswordMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.error || 'Şifre değiştirilemedi' });
        }
    };

    const handleSystemAction = async (action: 'reboot' | 'shutdown') => {
        const message = action === 'reboot' ? 'Sistem yeniden başlatılacak. Emin misiniz?' : 'Sistem kapatılacak. Emin misiniz?';
        if (confirm(message)) {
            try {
                await axios.post(`/api/system/${action}`);
                alert(`${action === 'reboot' ? 'Yeniden başlatma' : 'Kapatma'} komutu gönderildi`);
            } catch (error) {
                console.error('System action error:', error);
            }
        }
    };

    const tabs = [
        { id: 'account', label: 'Hesap', icon: User },
        { id: 'security', label: 'Güvenlik', icon: Shield },
        { id: 'system', label: 'Sistem', icon: Power },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
                <p className="text-gray-400 mt-1">Sistem ve hesap ayarlarını yönetin</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 glass-card rounded-2xl p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 glass-card rounded-2xl p-6">
                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Hesap Bilgileri
                            </h2>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        value={user?.username || 'admin'}
                                        disabled
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
                                    <input
                                        type="text"
                                        value={user?.role || 'admin'}
                                        disabled
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Şifre Değiştir
                            </h2>

                            {passwordMessage && (
                                <div className={`px-4 py-3 rounded-xl text-sm ${passwordMessage.type === 'success'
                                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                    }`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Şifre</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 pr-12"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre (Tekrar)</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                                    >
                                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {showPasswords ? 'Gizle' : 'Göster'}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Şifreyi Değiştir
                                </button>
                            </form>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Power className="w-5 h-5" />
                                Sistem İşlemleri
                            </h2>
                            <div className="grid gap-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <h3 className="text-lg font-medium text-yellow-400 mb-2">Yeniden Başlat</h3>
                                    <p className="text-gray-400 text-sm mb-4">Sistemi yeniden başlatır. Tüm servisler geçici olarak kullanılamaz olacaktır.</p>
                                    <button
                                        onClick={() => handleSystemAction('reboot')}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-colors"
                                    >
                                        Yeniden Başlat
                                    </button>
                                </div>
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <h3 className="text-lg font-medium text-red-400 mb-2">Sistemi Kapat</h3>
                                    <p className="text-gray-400 text-sm mb-4">Sistemi kapatır. Tekrar açmak için fiziksel erişim gerekecektir.</p>
                                    <button
                                        onClick={() => handleSystemAction('shutdown')}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
                                    >
                                        Sistemi Kapat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
