import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Hammer, MonitorPlay, LogOut, ExternalLink, Share2, UserCircle, Settings, Bell, Menu, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { path: '/admin/projects', icon: <FolderOpen className="w-4 h-4" />, label: 'Projects' },
        { path: '/admin/skills', icon: <Hammer className="w-4 h-4" />, label: 'Skills' },
        { path: '/admin/experience', icon: <MonitorPlay className="w-4 h-4" />, label: 'Experience' },
        { path: '/admin/reviews', icon: <MessageSquare className="w-4 h-4" />, label: 'Reviews' },
        { path: '/admin/socials', icon: <Share2 className="w-4 h-4" />, label: 'Socials' },
        { path: '/admin/profile', icon: <UserCircle className="w-4 h-4" />, label: 'Identity' },
        { path: '/admin/messages', icon: <Bell className="w-4 h-4" />, label: 'Messages' },
        { path: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-[#111] text-retro-white font-body overflow-hidden">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-[#333] flex items-center justify-between px-4 z-50">
                <h1 className="font-display text-lg text-retro-orange tracking-widest uppercase">
                    COMMAND CENTER
                </h1>
                <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-[#333] flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-16 md:pt-0
            `}>
                <div className="hidden md:block p-6 border-b border-[#333]">
                    <h1 className="font-display text-xl text-retro-orange tracking-widest uppercase">
                        COMMAND<br />CENTER
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 mt-2">v2.0.0 • ADMIN MODULE</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all
                                    ${isActive
                                        ? 'bg-retro-dark text-retro-yellow border border-retro-yellow/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#333] space-y-2">
                    <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-retro-blue transition-colors font-mono text-xs uppercase">
                        <ExternalLink className="w-4 h-4" />
                        View Site
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-mono text-xs uppercase">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#1a1a1a] pt-16 md:pt-0">
                <div className="p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;
