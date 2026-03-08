import { Button } from '../components/ui';
import { useAuth } from '../features/auth/AuthContext';
import { useAppStore } from '../stores/appStore';
import {
  HiOutlineAcademicCap,
  HiOutlinePlay,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineBookOpen,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';

// Mock data for demonstration
const mockLessons = [
  {
    id: '1',
    title: 'Nhập môn tiếng Anh',
    description: 'Học những kiến thức cơ bản về ngôn ngữ Anh bao gồm bảng chữ cái, lời chào cơ bản và các cụm từ thông dụng.',
    difficulty: 'beginner',
    duration: '15 phút',
    completed: true,
    order: 1,
    students: 1250,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Ngữ pháp cơ bản',
    description: 'Hiểu cấu trúc câu, các loại từ và các thì cơ bản trong tiếng Anh.',
    difficulty: 'beginner',
    duration: '20 phút',
    completed: true,
    order: 2,
    students: 1180,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Hội thoại hàng ngày',
    description: 'Luyện tập các đoạn hội thoại phổ biến được sử dụng trong cuộc sống hàng ngày.',
    difficulty: 'beginner',
    duration: '25 phút',
    completed: false,
    order: 3,
    students: 980,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Ngữ pháp nâng cao',
    description: 'Các thì nâng cao, câu điều kiện và cấu trúc câu phức tạp.',
    difficulty: 'intermediate',
    duration: '30 phút',
    completed: false,
    locked: true,
    order: 4,
    students: 756,
    rating: 4.8,
  },
  {
    id: '5',
    title: 'Tiếng Anh thương mại',
    description: 'Giao tiếp chuyên nghiệp, viết email và văn phong trang trọng.',
    difficulty: 'intermediate',
    duration: '35 phút',
    completed: false,
    locked: true,
    order: 5,
    students: 620,
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Viết nâng cao',
    description: 'Viết bài luận, văn bản tranh luận và viết học thuật.',
    difficulty: 'advanced',
    duration: '40 phút',
    completed: false,
    locked: true,
    order: 6,
    students: 450,
    rating: 4.9,
  },
];

const LessonsPage = () => {
  const { isAdmin } = useAuth();
  const { lessonsDifficulty, setLessonsDifficulty: setSelectedDifficulty } = useAppStore();

  const difficulties = [
    { key: 'all', label: 'Tất cả' },
    { key: 'beginner', label: 'Cơ bản' },
    { key: 'intermediate', label: 'Trung bình' },
    { key: 'advanced', label: 'Nâng cao' },
  ];

  const filteredLessons = mockLessons.filter(
    (lesson) =>
      lessonsDifficulty === 'all' || lesson.difficulty === lessonsDifficulty
  );

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Cơ bản' };
      case 'intermediate':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trung bình' };
      case 'advanced':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Nâng cao' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: difficulty };
    }
  };

  const completedCount = mockLessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / mockLessons.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài học</h1>
          <p className="text-gray-500">Học tiếng Anh từng bước một</p>
        </div>
        {isAdmin && (
          <Button className="bg-primary-600 hover:bg-primary-700">
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Thêm bài học
          </Button>
        )}
      </div>

      {/* Progress Overview - Study4 Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <HiOutlineAcademicCap className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
              <p className="text-gray-500">
                Hoàn thành {completedCount}/{mockLessons.length} bài học
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1 md:w-48">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Tiến độ</span>
                <span className="font-semibold text-primary-600">{progressPercent}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <HiOutlinePlay className="w-5 h-5 mr-2" />
              Tiếp tục học
            </Button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {difficulties.map((diff) => (
          <button
            key={diff.key}
            onClick={() => setSelectedDifficulty(diff.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${lessonsDifficulty === diff.key
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            {diff.label}
          </button>
        ))}
      </div>

      {/* Lessons Grid - Study4 Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const diffConfig = getDifficultyConfig(lesson.difficulty);
          return (
            <div
              key={lesson.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group ${lesson.locked ? 'opacity-70' : 'hover:border-primary-200'
                }`}
            >
              {/* Card Header with Status */}
              <div className={`h-2 ${lesson.completed ? 'bg-green-500' : lesson.locked ? 'bg-gray-300' : 'bg-primary-500'}`} />

              <div className="p-5">
                {/* Status Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${lesson.completed
                      ? 'bg-green-100'
                      : lesson.locked
                        ? 'bg-gray-100'
                        : 'bg-primary-100'
                      }`}
                  >
                    {lesson.completed ? (
                      <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                    ) : lesson.locked ? (
                      <HiOutlineLockClosed className="w-6 h-6 text-gray-400" />
                    ) : (
                      <HiOutlineBookOpen className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${diffConfig.bg} ${diffConfig.text}`}>
                    {diffConfig.label}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  Bài {lesson.order}: {lesson.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{lesson.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-4 h-4" />
                    {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineUsers className="w-4 h-4" />
                    {lesson.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineStar className="w-4 h-4 text-yellow-500" />
                    {lesson.rating}
                  </span>
                </div>

                {/* Action Button */}
                {lesson.completed ? (
                  <Button variant="secondary" size="sm" className="w-full">
                    Ôn tập
                  </Button>
                ) : lesson.locked ? (
                  <Button variant="secondary" size="sm" className="w-full opacity-50 cursor-not-allowed">
                    <HiOutlineLockClosed className="w-4 h-4 mr-2" />
                    Chưa mở khóa
                  </Button>
                ) : (
                  <Button size="sm" className="w-full bg-primary-600 hover:bg-primary-700">
                    <HiOutlinePlay className="w-4 h-4 mr-2" />
                    Bắt đầu học
                  </Button>
                )}

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Sửa bài học"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Xóa bài học"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsPage;
