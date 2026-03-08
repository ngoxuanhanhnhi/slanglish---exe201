import React from 'react';
import {
  HiOutlineCog,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineGlobe,
  HiOutlineUser
} from 'react-icons/hi';

const SettingsPage = () => {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Cài đặt</h1>
        <p className='text-gray-500 mt-2'>Quản lý tài khoản và tùy chỉnh ứng dụng của bạn.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Sidebar Settings Navigation */}
        <div className='md:col-span-1 space-y-2'>
          <button className='w-full flex items-center px-4 py-3 bg-white border border-primary-200 text-primary-700 rounded-xl shadow-sm font-medium'>
            <HiOutlineUser className='w-5 h-5 mr-3' />
            Thông tin cá nhân
          </button>
          <button className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors'>
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
                <div className='w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer'>
                  <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full' />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900'>Tự động phát âm thanh</p>
                  <p className='text-sm text-gray-500'>Tự động phát âm thanh khi học từ vựng</p>
                </div>
                <div className='w-12 h-6 bg-primary-500 rounded-full relative cursor-pointer'>
                  <div className='absolute right-1 top-1 w-4 h-4 bg-white rounded-full' />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Ngôn ngữ hiển thị</h2>
            </div>
            <div className='p-6'>
              <select className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none'>
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;