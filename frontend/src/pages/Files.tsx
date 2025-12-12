import { useEffect, useState } from 'react';
import {
    FolderOpen,
    File,
    ChevronRight,
    Home,
    ArrowUp,
    RefreshCw,
    Search,
    Download,
    Trash2,
    FolderPlus,
    Upload
} from 'lucide-react';
import axios from 'axios';

interface FileInfo {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    modified: string;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Files() {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [currentPath, setCurrentPath] = useState('/');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchFiles = async (path: string = '/') => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/files/list?path=${encodeURIComponent(path)}`);
            if (response.data.success) {
                setFiles(response.data.data);
                setCurrentPath(path);
            }
        } catch (error) {
            console.error('File fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleNavigate = (file: FileInfo) => {
        if (file.type === 'directory') {
            const newPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
            fetchFiles(newPath);
        }
    };

    const handleGoUp = () => {
        const parts = currentPath.split('/').filter(Boolean);
        parts.pop();
        const newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
        fetchFiles(newPath);
    };

    const handleDelete = async (file: FileInfo) => {
        if (confirm(`"${file.name}" silinecek. Emin misiniz?`)) {
            try {
                const fullPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
                await axios.delete(`/api/files/delete?path=${encodeURIComponent(fullPath)}`);
                fetchFiles(currentPath);
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const handleCreateFolder = async () => {
        const name = prompt('Yeni klasör adı:');
        if (name) {
            try {
                const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
                await axios.post('/api/files/mkdir', { path: fullPath });
                fetchFiles(currentPath);
            } catch (error) {
                console.error('Create folder error:', error);
            }
        }
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const pathParts = currentPath.split('/').filter(Boolean);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dosya Yöneticisi</h1>
                    <p className="text-gray-400 mt-1">Dosya ve klasörlerinizi yönetin</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCreateFolder}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Yeni Klasör
                    </button>
                    <button
                        onClick={() => fetchFiles(currentPath)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="glass-card rounded-xl p-4 flex items-center gap-2 overflow-x-auto">
                <button
                    onClick={() => fetchFiles('/')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Home className="w-4 h-4 text-gray-400" />
                </button>
                {currentPath !== '/' && (
                    <button
                        onClick={handleGoUp}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowUp className="w-4 h-4 text-gray-400" />
                    </button>
                )}
                <ChevronRight className="w-4 h-4 text-gray-600" />
                {pathParts.map((part, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <button
                            onClick={() => fetchFiles('/' + pathParts.slice(0, i + 1).join('/'))}
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            {part}
                        </button>
                        {i < pathParts.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Dosya ara..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
            </div>

            {/* File List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Klasör Boş</h3>
                    <p className="text-gray-400">Bu klasörde dosya veya alt klasör bulunmuyor.</p>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 text-gray-400 font-medium">Ad</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium hidden md:table-cell">Boyut</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium hidden lg:table-cell">Değiştirilme</th>
                                <th className="text-right py-4 px-6 text-gray-400 font-medium">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.map((file, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => handleNavigate(file)}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {file.type === 'directory' ? (
                                                <FolderOpen className="w-5 h-5 text-yellow-400" />
                                            ) : (
                                                <File className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-white">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 hidden md:table-cell">
                                        {file.type === 'file' ? formatBytes(file.size) : '--'}
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 hidden lg:table-cell">
                                        {new Date(file.modified).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                                className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
