import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Containers from './pages/Containers';
import Files from './pages/Files';
import Settings from './pages/Settings';
import AppStore from './pages/AppStore';
import Login from './pages/Login';

function ProtectedLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-6">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/containers" element={<Containers />} />
                    <Route path="/files" element={<Files />} />
                    <Route path="/app-store" element={<AppStore />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
