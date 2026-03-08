import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { userService } from '../services/user.service';
import { DashboardStats } from '../types';
import { LoadingSpinner } from '../components/ui';
import { useAppStore, VIEW_STATES } from '../stores/appStore';
import {
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlinePlay,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';

const DashboardPage = () => {
  const { user } = useAuth();
  const { setView, resetSelections } = useAppStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navigateTo = (view: any) => {
    resetSelections();
    // In a real app with routing, we'd also use useNavigate()
    // but here we are following the user's pattern of managing view via state
    setView(view);
  };

  const quickActions = [
    {
      title: 'Học từ vựng',
      description: 'Mở rộng vốn từ của bạn',
      icon: HiOutlineBookOpen,
      view: VIEW_STATES.VOCABULARY,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
    },
    {
      title: 'Ngữ pháp',
      description: 'Nắm vững ngữ pháp',
      icon: HiOutlineAcademicCap,
      view: VIEW_STATES.GRAMMAR,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
    },
    {
      title: 'Luyện đề',
      description: 'Kiểm tra kiến thức',
      icon: HiOutlineClipboardList,
      view: 'quiz', // Assuming quiz is also a view state
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Clean Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Tiếp tục hành trình học tiếng Anh của bạn nào!
            </p>
          </div>
          <button
            onClick={() => navigateTo(VIEW_STATES.VOCABULARY)}
            className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <HiOutlinePlay className="w-5 h-5 mr-2" />
            Học ngay
          </button>
        </div>
      </div>

      {/* Stats Grid - Study4 Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <HiOutlineAcademicCap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {stats?.lessonsCompleted || 0}
          </p>
          <p className="text-sm text-gray-500">Bài học hoàn thành</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <HiOutlineClipboardList className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {stats?.quizzesTaken || 0}
          </p>
          <p className="text-sm text-gray-500">Bài kiểm tra</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <HiOutlineTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {stats?.averageScore || 0}%
          </p>
          <p className="text-sm text-gray-500">Điểm trung bình</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <HiOutlineChartBar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            5
          </p>
          <p className="text-sm text-gray-500">Ngày học liên tiếp</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bắt đầu học</h2>
          <button
            onClick={() => navigateTo(VIEW_STATES.VOCABULARY)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className="w-full text-left"
                onClick={() => navigateTo(action.view)}
              >
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz Results */}
      {stats?.recentQuizzes && stats.recentQuizzes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kết quả quiz gần đây</h2>
            <button
              onClick={() => navigateTo('quiz')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {stats.recentQuizzes.map((qr) => {
                const pct = Math.round((qr.score / qr.total_questions) * 100);
                const isGood = pct >= 70;
                return (
                  <div key={qr.id} className="px-5 py-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isGood ? 'bg-green-100' : 'bg-orange-100'}`}>
                      <HiOutlineCheckCircle className={`w-5 h-5 ${isGood ? 'text-green-600' : 'text-orange-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{qr.quiz?.title || 'Quiz'}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500">{qr.score}/{qr.total_questions} câu đúng</span>
                        {qr.time_spent && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <HiOutlineClock className="w-3 h-3" />
                            {Math.floor(qr.time_spent / 60)}:{(qr.time_spent % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-lg font-bold ${isGood ? 'text-green-600' : 'text-orange-600'}`}>{pct}%</span>
                      <p className="text-xs text-gray-400">{new Date(qr.completed_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vocabulary Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <HiOutlineBookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Từ vựng</h3>
              <p className="text-xs text-gray-500">{stats?.vocabCount || 0} từ trong hệ thống</p>
            </div>
          </div>
          <div className="space-y-3">
            {(stats?.vocabCategories || []).map((vc) => {
              const labelMap: Record<string, string> = { slang: 'Slang', a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2' };
              const colorMap: Record<string, string> = { slang: 'bg-purple-500', a1: 'bg-green-500', a2: 'bg-emerald-500', b1: 'bg-blue-500', b2: 'bg-indigo-500', c1: 'bg-orange-500', c2: 'bg-red-500' };
              const total = stats?.vocabCount || 1;
              const pct = Math.round((vc.count / total) * 100);
              return (
                <div key={vc.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{labelMap[vc.category] || vc.category.toUpperCase()}</span>
                    <span className="text-gray-400">{vc.count} từ</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${colorMap[vc.category] || 'bg-gray-500'} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!stats?.vocabCategories || stats.vocabCategories.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-2">Chưa có dữ liệu từ vựng</p>
            )}
          </div>
        </div>

        {/* Grammar Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <HiOutlineAcademicCap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ngữ pháp</h3>
              <p className="text-xs text-gray-500">{(stats?.grammarLevels || []).reduce((s, l) => s + l.topicCount, 0)} chủ đề</p>
            </div>
          </div>
          <div className="space-y-3">
            {(stats?.grammarLevels || []).map((gl) => {
              const colorMap: Record<string, string> = { 'A1': 'bg-green-500', 'A2': 'bg-emerald-500', 'B1': 'bg-blue-500', 'B2': 'bg-indigo-500', 'C1': 'bg-orange-500', 'C2': 'bg-red-500' };
              return (
                <div key={gl.id} className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${colorMap[gl.name] || 'bg-gray-500'}`}>
                    {gl.name}
                  </span>
                  <div className="flex-1 text-sm text-gray-600">{gl.topicCount} chủ đề</div>
                </div>
              );
            })}
            {(!stats?.grammarLevels || stats.grammarLevels.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-2">Chưa có dữ liệu ngữ pháp</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <HiOutlineLightningBolt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Mẹo học hôm nay</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Luyện nói tiếng Anh ít nhất 15 phút mỗi ngày. Điều này giúp cải thiện phát âm và tự tin hơn trong giao tiếp thực tế.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
