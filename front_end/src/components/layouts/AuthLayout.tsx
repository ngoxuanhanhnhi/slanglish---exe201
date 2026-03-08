import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <HiOutlineBookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Slanglish</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tests" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Đề thi
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Khóa học
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-600 mb-4">
              <HiOutlineBookOpen className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <Link to="/terms" className="hover:text-gray-700 hover:underline">
              Điều khoản sử dụng
            </Link>
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-gray-700 hover:underline">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2024 Slanglish. Nền tảng học tiếng Anh trực tuyến.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
