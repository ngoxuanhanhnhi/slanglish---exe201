import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineSearch,
} from 'react-icons/hi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

const getAvatarUrl = (avatar?: string | null) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  return `${API_BASE}${avatar}`;
};

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '/dashboard', icon: HiOutlineHome },
    { name: 'Từ vựng & Ngữ pháp', href: '/vocabulary', icon: HiOutlineBookOpen },
    { name: 'Bài học', href: '/lessons', icon: HiOutlineAcademicCap },
    { name: 'Luyện tập', href: '/quiz', icon: HiOutlineClipboardList },
    { name: 'Hồ sơ', href: '/profile', icon: HiOutlineUser },
    { name: 'Cài đặt', href: '/settings', icon: HiOutlineCog },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <HiOutlineMenu className="w-6 h-6 text-gray-600" />
              </button>
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-primary-600 hidden sm:block">Slanglish</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <HiOutlineSearch className="w-5 h-5" />
              </button>

              {/* Notification Button */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Profile Info */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-100 ml-1">
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
                <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-primary-200">
                    {user?.avatar ? (
                      <img src={getAvatarUrl(user.avatar) || ''} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-700 font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 pt-16 border-r border-gray-200 bg-white">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${active
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-primary-600">Slanglish</span>
              </Link>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(false)}>
                <HiOutlineX className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.name} to={item.href} className={`flex items-center px-4 py-3 rounded-lg ${active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600'}`} onClick={() => setSidebarOpen(false)}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { handleLogout(); setSidebarOpen(false); }}
                className="flex items-center w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5 mr-3" />
                Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 overflow-y-auto bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
