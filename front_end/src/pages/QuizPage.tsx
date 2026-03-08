import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlineChevronLeft,
  HiOutlineX,
  HiOutlineFolder,
} from 'react-icons/hi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  getQuizCategories,
  createQuizCategory,
  updateQuizCategory,
  deleteQuizCategory,
  getQuizzesByCategory,
  uploadQuizExcel,
  deleteQuiz,
  QuizCategory,
  QuizListItem,
} from '../services/quiz.service';

const QuizPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // ── State ───────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<QuizCategory | null>(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catSaving, setCatSaving] = useState(false);

  // Upload modal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', time_limit: '', max_attempts: '' });
  const [uploading, setUploading] = useState(false);

  // Delete confirm
  const [deletingCat, setDeletingCat] = useState<QuizCategory | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<QuizListItem | null>(null);

  // ── Load categories ─────────────────────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    try {
      const data = await getQuizCategories();
      setCategories(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  // ── Load quizzes for selected category ──────────────────────────────────────
  const openCategory = async (cat: QuizCategory) => {
    setSelectedCategory(cat);
    setQuizzesLoading(true);
    try {
      const data = await getQuizzesByCategory(cat.id);
      setQuizzes(data);
    } catch {
      // ignore
    } finally {
      setQuizzesLoading(false);
    }
  };

  const goBack = () => {
    setSelectedCategory(null);
    setQuizzes([]);
  };

  // ── Category CRUD ───────────────────────────────────────────────────────────
  const openCatModal = (cat?: QuizCategory) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, description: cat.description || '' });
    } else {
      setEditingCat(null);
      setCatForm({ name: '', description: '' });
    }
    setCatModalOpen(true);
  };

  const handleSaveCat = async () => {
    if (!catForm.name.trim()) return;
    setCatSaving(true);
    try {
      if (editingCat) {
        await updateQuizCategory(editingCat.id, catForm);
        toast.success('Đã cập nhật danh mục!');
      } else {
        await createQuizCategory(catForm);
        toast.success('Đã tạo danh mục mới!');
      }
      setCatModalOpen(false);
      await loadCategories();
    } catch {
      toast.error('Lỗi khi lưu danh mục.');
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCat = async () => {
    if (!deletingCat) return;
    try {
      await deleteQuizCategory(deletingCat.id);
      toast.success('Đã xóa danh mục!');
      setDeletingCat(null);
      if (selectedCategory?.id === deletingCat.id) goBack();
      await loadCategories();
    } catch {
      toast.error('Lỗi khi xóa danh mục.');
    }
  };

  // ── Upload Excel ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCategory) return;
    e.target.value = '';
    // Pre-fill title from filename (strip extension)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setUploadForm({ title: nameWithoutExt, time_limit: '', max_attempts: '' });
    setPendingFile(file);
    setUploadModalOpen(true);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile || !selectedCategory) return;
    setUploading(true);
    setUploadModalOpen(false);
    try {
      await uploadQuizExcel(selectedCategory.id, pendingFile, {
        title: uploadForm.title.trim() || undefined,
        time_limit: uploadForm.time_limit ? parseInt(uploadForm.time_limit, 10) : undefined,
        max_attempts: uploadForm.max_attempts ? parseInt(uploadForm.max_attempts, 10) : undefined,
      });
      toast.success('Đã tải quiz lên thành công!');
      const data = await getQuizzesByCategory(selectedCategory.id);
      setQuizzes(data);
      await loadCategories();
    } catch {
      toast.error('Lỗi khi tải quiz lên.');
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  // ── Delete quiz ─────────────────────────────────────────────────────────────
  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    try {
      await deleteQuiz(deletingQuiz.id);
      toast.success('Đã xóa quiz!');
      setDeletingQuiz(null);
      setQuizzes((prev) => prev.filter((q) => q.id !== deletingQuiz.id));
      await loadCategories();
    } catch {
      toast.error('Lỗi khi xóa quiz.');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Quiz list view (inside a category) ──────────────────────────────────────
  if (selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory.icon && <span className="mr-2">{selectedCategory.icon}</span>}
              {selectedCategory.name}
            </h1>
            {selectedCategory.description && (
              <p className="text-gray-500 text-sm mt-0.5">{selectedCategory.description}</p>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm disabled:opacity-50">
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiOutlineUpload className="w-4 h-4" />
                )}
                Upload Excel
              </button>
            </div>
          )}
        </div>

        {/* Quizzes */}
        {quizzesLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary-200 transition-all group flex flex-col">
                <div className="p-5 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {quiz.title}
                  </h3>
                  {quiz.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{quiz.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <HiOutlineDocumentText className="w-4 h-4" />
                      {quiz._count.questions} câu
                    </span>
                    {quiz.time_limit && (
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-4 h-4" />
                        {quiz.time_limit} phút
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5 space-y-2">
                  <button
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
                    <HiOutlinePlay className="w-4 h-4" />
                    Bắt đầu làm
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setDeletingQuiz(quiz)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <HiOutlineClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài quiz nào</h3>
            {isAdmin ? (
              <p className="text-gray-500 text-sm">Bấm "Upload Excel" để thêm bài quiz từ file Excel</p>
            ) : (
              <p className="text-gray-500 text-sm">Bài quiz sẽ được bổ sung sớm</p>
            )}
          </div>
        )}

        {/* Delete quiz confirm */}
        {deletingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc muốn xóa quiz <strong>{deletingQuiz.title}</strong>? Tất cả câu hỏi và kết quả liên quan sẽ bị xóa.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingQuiz(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                  Hủy
                </button>
                <button onClick={handleDeleteQuiz} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload modal */}
        {uploadModalOpen && pendingFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Thêm quiz mới</h3>
                <button onClick={() => { setUploadModalOpen(false); setPendingFile(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <HiOutlineX className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên quiz</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                    placeholder="Tên bài quiz..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian làm bài (phút)</label>
                  <input
                    type="number"
                    min="1"
                    value={uploadForm.time_limit}
                    onChange={(e) => setUploadForm((f) => ({ ...f, time_limit: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                    placeholder="VD: 30 (bỏ trống nếu không giới hạn)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lần làm</label>
                  <input
                    type="number"
                    min="1"
                    value={uploadForm.max_attempts}
                    onChange={(e) => setUploadForm((f) => ({ ...f, max_attempts: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                    placeholder="VD: 1 (bỏ trống nếu không giới hạn)"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  File: <span className="font-medium text-gray-600">{pendingFile.name}</span>
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setUploadModalOpen(false); setPendingFile(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                  Hủy
                </button>
                <button
                  onClick={handleConfirmUpload}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Categories view ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          <p className="text-gray-500">Chọn danh mục để bắt đầu luyện tập</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => openCatModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
            <HiOutlinePlus className="w-4 h-4" />
            Tạo danh mục
          </button>
        )}
      </div>

      {/* Category grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => openCategory(cat)}
              className="bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group relative">
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); openCatModal(cat); }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Sửa">
                    <HiOutlinePencil className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingCat(cat); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Xóa">
                    <HiOutlineTrash className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  {cat.icon ? (
                    <span className="text-xl">{cat.icon}</span>
                  ) : (
                    <HiOutlineFolder className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{cat.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {cat._count.quizzes} bài quiz
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <HiOutlineClipboardList className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục quiz</h3>
          {isAdmin ? (
            <p className="text-gray-500 text-sm">Bấm "Tạo danh mục" để bắt đầu thêm quiz</p>
          ) : (
            <p className="text-gray-500 text-sm">Danh mục sẽ được bổ sung sớm</p>
          )}
        </div>
      )}

      {/* Category modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCat ? 'Sửa danh mục' : 'Tạo danh mục mới'}
              </h3>
              <button onClick={() => setCatModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                  placeholder="VD: Từ vựng, Ngữ pháp..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={catForm.description}
                  onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm resize-none"
                  rows={2}
                  placeholder="Mô tả ngắn..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCatModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                Hủy
              </button>
              <button
                onClick={handleSaveCat}
                disabled={catSaving || !catForm.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm disabled:opacity-50">
                {catSaving ? 'Đang lưu...' : editingCat ? 'Cập nhật' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete category confirm */}
      {deletingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc muốn xóa danh mục <strong>{deletingCat.name}</strong>? Tất cả bài quiz bên trong sẽ bị xóa.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingCat(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                Hủy
              </button>
              <button onClick={handleDeleteCat} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
