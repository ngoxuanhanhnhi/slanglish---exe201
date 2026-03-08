import { HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineGlobe, HiOutlineUserGroup } from 'react-icons/hi';
import { useAppStore } from '../stores/appStore';

const WelcomePage = () => {
  const { setView } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setView('home')} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <HiOutlineBookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Slanglish</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setView('register')}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
              <HiOutlineLightningBolt className="w-4 h-4" />
              Nền tảng học tiếng Anh #1 Việt Nam
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Chinh phục tiếng Anh
              <span className="block text-primary-600 mt-2">dễ dàng & hiệu quả</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Luyện thi IELTS, TOEIC, TOEFL với hệ thống bài học thông minh,
              bài kiểm tra đa dạng và theo dõi tiến độ chi tiết.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setView('register')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300"
              >
                Bắt đầu học miễn phí
              </button>
              <button
                onClick={() => setView('login')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
              >
                Đã có tài khoản? Đăng nhập
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500 mt-1">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500 mt-1">Bài học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500 mt-1">Hài lòng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Tại sao chọn Slanglish?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Phương pháp học hiện đại, hiệu quả, phù hợp với mọi trình độ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                <HiOutlineAcademicCap className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bài học đa dạng</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hệ thống bài học từ cơ bản đến nâng cao, được thiết kế bởi giáo viên chuyên nghiệp.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors">
                <HiOutlineChartBar className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Theo dõi tiến độ</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dashboard thống kê chi tiết giúp bạn theo dõi quá trình học tập và cải thiện mỗi ngày.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-600 transition-colors">
                <HiOutlineLightningBolt className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz thông minh</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hệ thống bài kiểm tra tương tác giúp bạn ôn tập và đánh giá trình độ chính xác.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-5 group-hover:bg-orange-600 transition-colors">
                <HiOutlineBookOpen className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Từ vựng phong phú</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Kho từ vựng khổng lồ theo chủ đề với phát âm, ví dụ và bài tập thực hành.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-5 group-hover:bg-red-600 transition-colors">
                <HiOutlineGlobe className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Học mọi lúc mọi nơi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Giao diện responsive, trải nghiệm mượt mà trên mọi thiết bị từ điện thoại đến desktop.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors">
                <HiOutlineUserGroup className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cộng đồng học tập</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Kết nối với hàng ngàn học viên khác, chia sẻ kinh nghiệm và cùng tiến bộ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Sẵn sàng chinh phục tiếng Anh?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay và bắt đầu hành trình học tiếng Anh hiệu quả cùng Slanglish
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('register')}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-primary-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg"
            >
              Đăng ký miễn phí ngay
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <HiOutlineBookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Slanglish</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => setView('home')} className="hover:text-white transition-colors">Điều khoản</button>
              <button onClick={() => setView('home')} className="hover:text-white transition-colors">Bảo mật</button>
              <span>© 2024 Slanglish</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
