import {
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineGlobe,
  HiOutlineUser
} from 'react-icons/hi';
import { useAppStore } from '../stores/appStore';

const SettingsPage = () => {
  const {
    view, setView,
    settingsDarkMode, setSettingsDarkMode,
    settingsAutoPlay, setSettingsAutoPlay,
    settingsLanguage, setSettingsLanguage
  } = useAppStore();

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Cài đặt</h1>
        <p className='text-gray-500 mt-2'>Quản lý tài khoản và tùy chỉnh ứng dụng của bạn.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Sidebar Settings Navigation */}
        <div className='md:col-span-1 space-y-2'>
          <button
            onClick={() => setView('profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${view === 'profile'
                ? 'bg-white border border-primary-200 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-white hover:text-gray-900'
              }`}
          >
            <HiOutlineUser className='w-5 h-5 mr-3' />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setView('profile')} // In current app, security is inside ProfilePage
            className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors'
          >
            <HiOutlineLockClosed className='w-5 h-5 mr-3' />
            Bảo mật
          </button>
          <button className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors'>
            <HiOutlineBell className='w-5 h-5 mr-3' />
            Thông báo
          </button>
          <button className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors'>
            <HiOutlineGlobe className='w-5 h-5 mr-3' />
            Ngôn ngữ
          </button>
        </div>

        {/* Settings Content */}
        <div className='md:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Cài đặt chung</h2>
            </div>
            <div className='p-6 space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900'>Chế độ tối</p>
                  <p className='text-sm text-gray-500'>Sử dụng giao diện tối để bảo vệ mắt</p>
                </div>
                <div
                  onClick={() => setSettingsDarkMode(!settingsDarkMode)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${settingsDarkMode ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${settingsDarkMode ? 'right-1' : 'left-1'
                    }`} />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900'>Tự động phát âm thanh</p>
                  <p className='text-sm text-gray-500'>Tự động phát âm thanh khi học từ vựng</p>
                </div>
                <div
                  onClick={() => setSettingsAutoPlay(!settingsAutoPlay)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${settingsAutoPlay ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${settingsAutoPlay ? 'right-1' : 'left-1'
                    }`} />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Ngôn ngữ hiển thị</h2>
            </div>
            <div className='p-6'>
              <select
                value={settingsLanguage}
                onChange={(e) => setSettingsLanguage(e.target.value)}
                className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none'
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;