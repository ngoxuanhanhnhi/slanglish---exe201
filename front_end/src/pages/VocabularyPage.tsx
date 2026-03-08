import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useAuth } from '../features/auth/AuthContext';
import {
  HiOutlineBookOpen,
  HiOutlineSearch,
  HiOutlineVolumeUp,
  HiOutlinePlus,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineCheck,
  HiOutlineCog,
  HiOutlineFolder,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineDownload,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { exportVocabulary } from '../services/vocabulary.service';
import {
  getVocabularyByCategory,
  getCategoryCounts,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getMyProgress,
  toggleComplete,
  getTopicsByCategory,
  createTopic,
  updateTopic,
  deleteTopic,
  getVocabularyByTopic,
  VocabItem,
  VocabFormData,
  TopicItem,
  GrammarLevel,
  GrammarTopic,
  getGrammarLevels,
  getTopicsByLevel,
  createGrammarLevel,
  updateGrammarLevel,
  deleteGrammarLevel,
  createGrammarTopic,
  updateGrammarTopic,
  deleteGrammarTopic,
  uploadGrammarTopicFile,
  deleteGrammarTopicFile,
} from '../services/vocabulary.service';

// ─── Constants ────────────────────────────────────────────────────────────────
const WORDS_PER_PAGE = 10;
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
const TOPIC_CATEGORIES = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

// ─── Types ────────────────────────────────────────────────────────────────────
type View = 'home' | 'vocabulary' | 'grammar' | 'grammar-topic-list' | 'vocab-list' | 'topic-list' | 'topic-vocab-list';

// ─── Grammar level color palette ──────────────────────────────────────────────
const GRAMMAR_LEVEL_COLORS = [
  { gradient: 'from-green-400 to-emerald-500', lightBg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '📝' },
  { gradient: 'from-orange-400 to-amber-500', lightBg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: '🔥' },
  { gradient: 'from-blue-400 to-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '🎯' },
  { gradient: 'from-purple-400 to-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '⚡' },
  { gradient: 'from-rose-400 to-pink-600', lightBg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', icon: '💪' },
];

interface Category {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  icon: string;
  gradient: string;
  lightBg: string;
  border: string;
  badge: string;
}

// ─── Category definitions ─────────────────────────────────────────────────────
const BASE_CATEGORIES: Omit<Category, 'wordCount'>[] = [
  {
    id: 'slang',
    name: 'Từ vựng Slang',
    description: 'Tiếng lóng hiện đại, thường dùng trong giao tiếp hằng ngày của người bản xứ',
    icon: '🗣️',
    gradient: 'from-orange-400 to-amber-500',
    lightBg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'a1',
    name: 'Từ vựng theo chủ đề level A1',
    description: 'Từ vựng căn bản nhất dành cho người mới bắt đầu học tiếng Anh',
    icon: '🌱',
    gradient: 'from-green-400 to-emerald-500',
    lightBg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
  },
  {
    id: 'a2',
    name: 'Từ vựng theo chủ đề level A2',
    description: 'Mở rộng vốn từ cho các tình huống giao tiếp đời thường quen thuộc',
    icon: '🌿',
    gradient: 'from-teal-400 to-cyan-500',
    lightBg: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'b1',
    name: 'Từ vựng theo chủ đề level B1',
    description: 'Từ vựng trung cấp cho các chủ đề xã hội, công việc và giáo dục',
    icon: '📘',
    gradient: 'from-blue-400 to-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'b2',
    name: 'Từ vựng theo chủ đề level B2',
    description: 'Từ vựng nâng cao cho tranh luận, ý kiến và các chủ đề phức tạp',
    icon: '💡',
    gradient: 'from-indigo-400 to-violet-500',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'c1',
    name: 'Từ vựng theo chủ đề level C1',
    description: 'Từ vựng học thuật và chuyên sâu cho người dùng thành thạo',
    icon: '🎯',
    gradient: 'from-purple-400 to-purple-600',
    lightBg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'c2',
    name: 'Từ vựng theo chủ đề level C2',
    description: 'Từ vựng tinh tế, phức tạp dành cho trình độ thông thạo như người bản ngữ',
    icon: '🏆',
    gradient: 'from-rose-400 to-pink-600',
    lightBg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
  },
];

const EMPTY_FORM: VocabFormData = {
  word: '',
  definition_en: '',
  definition_vi: '',
  example: '',
  pronunciation: '',
  category: 'slang',
  difficulty: 'beginner',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Cơ bản' };
    case 'intermediate': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trung bình' };
    case 'advanced': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Nâng cao' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: difficulty };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Word Modal (Add / Edit vocabulary) ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface WordModalProps {
  open: boolean;
  editWord: VocabItem | null;
  defaultCategory: string;
  defaultTopicId?: string;
  onClose: () => void;
  onSaved: (word: VocabItem) => void;
}

const WordModal = ({ open, editWord, defaultCategory, defaultTopicId, onClose, onSaved }: WordModalProps) => {
  const [form, setForm] = useState<VocabFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (editWord) {
        setForm({
          word: editWord.word,
          definition_en: editWord.definition_en,
          definition_vi: editWord.definition_vi,
          example: editWord.example ?? '',
          pronunciation: editWord.pronunciation ?? '',
          category: editWord.category,
          difficulty: editWord.difficulty,
          topic_id: editWord.topic_id ?? undefined,
        });
      } else {
        setForm({ ...EMPTY_FORM, category: defaultCategory, topic_id: defaultTopicId });
      }
      setError('');
    }
  }, [open, editWord, defaultCategory, defaultTopicId]);

  const set = (field: keyof VocabFormData, value: string) =>
    setForm((prev: VocabFormData) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.definition_en.trim() || !form.definition_vi.trim()) {
      setError('Vui lòng điền đầy đủ: Từ vựng, nghĩa tiếng Anh và nghĩa tiếng Việt.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const saved = editWord
        ? await updateVocabulary(editWord.id, form)
        : await createVocabulary(form);
      toast.success(editWord ? 'Đã cập nhật từ vựng!' : 'Đã thêm từ vựng mới!');
      onSaved(saved);
      onClose();
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      toast.error('Có lỗi xảy ra khi lưu từ vựng.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editWord ? 'Sửa từ vựng' : 'Thêm từ vựng mới'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Từ vựng <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Ví dụ: Slay" value={form.word}
              onChange={(e) => set('word', e.target.value)} className="border-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phiên âm <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <Input placeholder="Ví dụ: /sleɪ/" value={form.pronunciation}
              onChange={(e) => set('pronunciation', e.target.value)} className="border-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">EN</span>
                Nghĩa tiếng Anh <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea placeholder="To do something extremely well..." value={form.definition_en}
              onChange={(e) => set('definition_en', e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-mono">VI</span>
                Nghĩa tiếng Việt <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea placeholder="Làm gì đó cực kỳ xuất sắc..." value={form.definition_vi}
              onChange={(e) => set('definition_vi', e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-xs font-mono">Ex</span>
                Ví dụ <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
              </span>
            </label>
            <Input placeholder="You absolutely slayed your IELTS speaking test!" value={form.example}
              onChange={(e) => set('example', e.target.value)} className="border-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Độ khó</label>
            <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Huỷ
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
              {saving ? 'Đang lưu...' : editWord ? 'Lưu thay đổi' : 'Thêm từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Delete Confirm ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface DeleteConfirmProps {
  word: VocabItem | null;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

const DeleteConfirm = ({ word, onCancel, onConfirm, deleting }: DeleteConfirmProps) => {
  if (!word) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <HiOutlineTrash className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Xoá từ vựng</h3>
            <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Bạn có chắc muốn xoá từ{' '}
          <span className="font-semibold text-gray-900">&quot;{word.word}&quot;</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Huỷ
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
            {deleting ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Grammar Topic Modal (Add / Edit) ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface GrammarTopicModalProps {
  open: boolean;
  editTopic: GrammarTopic | null;
  levelId: string;
  onClose: () => void;
  onSaved: (topic: GrammarTopic) => void;
}

const GrammarTopicModal = ({ open, editTopic, levelId, onClose, onSaved }: GrammarTopicModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(editTopic?.name ?? '');
      setDescription(editTopic?.description ?? '');
      setError('');
    }
  }, [open, editTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Vui lòng nhập tên chủ điểm.'); return; }
    setSaving(true); setError('');
    try {
      const saved = editTopic
        ? await updateGrammarTopic(editTopic.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        })
        : await createGrammarTopic({
          name: name.trim(),
          description: description.trim() || undefined,
          level_id: levelId,
        });
      onSaved(saved);
      onClose();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editTopic ? 'Chỉnh sửa chủ điểm' : 'Thêm chủ điểm ngữ pháp'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên chủ điểm <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ví dụ: Tenses (Các thì cơ bản)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mô tả <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <Input
              placeholder="Mô tả ngắn gọn về chủ điểm ngữ pháp này"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-200"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Huỷ
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
              {saving ? 'Đang lưu...' : editTopic ? 'Lưu thay đổi' : 'Thêm chủ điểm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Grammar Level Modal (Add / Edit level) ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface GrammarLevelModalProps {
  open: boolean;
  editLevel: GrammarLevel | null;
  onClose: () => void;
  onSaved: (level: GrammarLevel) => void;
}

const GrammarLevelModal = ({ open, editLevel, onClose, onSaved }: GrammarLevelModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(editLevel?.name ?? '');
      setDescription(editLevel?.description ?? '');
      setError('');
    }
  }, [open, editLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Vui lòng nhập tên cấp độ.'); return; }
    setSaving(true); setError('');
    try {
      const saved = editLevel
        ? await updateGrammarLevel(editLevel.id, { name: name.trim(), description: description.trim() || undefined })
        : await createGrammarLevel({ name: name.trim(), description: description.trim() || undefined });
      onSaved(saved);
      onClose();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editLevel ? 'Chỉnh sửa cấp độ' : 'Thêm cấp độ mới'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên cấp độ <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Ví dụ: Advanced" value={name}
              onChange={(e) => setName(e.target.value)} className="border-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mô tả <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <Input placeholder="Mô tả ngắn gọn về cấp độ này" value={description}
              onChange={(e) => setDescription(e.target.value)} className="border-gray-200" />
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Huỷ
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
              {saving ? 'Đang lưu...' : editLevel ? 'Lưu thay đổi' : 'Thêm cấp độ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Grammar Delete Confirm ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface GrammarDeleteConfirmProps {
  item: { name: string } | null;
  type: 'topic' | 'level';
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

const GrammarDeleteConfirm = ({ item, type, onCancel, onConfirm, deleting }: GrammarDeleteConfirmProps) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <HiOutlineTrash className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Xoá {type === 'topic' ? 'chủ điểm ngữ pháp' : 'cấp độ'}
            </h3>
            <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Bạn có chắc muốn xoá{' '}
          <span className="font-semibold text-gray-900">&quot;{item.name}&quot;</span>?
          {type === 'level' && (
            <span className="block mt-1 text-red-600 text-xs font-medium">
              Tất cả chủ điểm bên trong cũng sẽ bị xoá.
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Huỷ
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
            {deleting ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Topic Management Modal (Admin) ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
type TopicAction = 'add' | 'delete' | 'edit';

interface TopicManageModalProps {
  open: boolean;
  category: string;
  categoryName: string;
  onClose: () => void;
  onTopicsChanged: () => void;
}

const TopicManageModal = ({ open, category, categoryName, onClose, onTopicsChanged }: TopicManageModalProps) => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit topic name inline
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicName, setEditTopicName] = useState('');
  const [editTopicDesc, setEditTopicDesc] = useState('');

  // Topic vocab edit modal
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [topicAction, setTopicAction] = useState<TopicAction | null>(null);
  const [topicWords, setTopicWords] = useState<VocabItem[]>([]);
  const [loadingTopicWords, setLoadingTopicWords] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  // Word modal for add/edit in topic context
  const [wordModalOpen, setWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabItem | null>(null);

  // Delete word
  const [deletingWord, setDeletingWord] = useState<VocabItem | null>(null);
  const [deletingWordLoading, setDeletingWordLoading] = useState(false);

  // Deleting topic
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopicsByCategory(category);
      setTopics(data);
    } catch { setTopics([]); }
    finally { setLoading(false); }
  }, [category]);

  useEffect(() => {
    if (open) {
      fetchTopics();
      setSelectedTopic(null);
      setTopicAction(null);
      setShowAddForm(false);
    }
  }, [open, fetchTopics]);

  const fetchTopicWords = useCallback(async (topicId: string) => {
    setLoadingTopicWords(true);
    try {
      const data = await getVocabularyByTopic(topicId);
      setTopicWords(data);
    } catch { setTopicWords([]); }
    finally { setLoadingTopicWords(false); }
  }, []);

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) return;
    setSaving(true);
    try {
      const created = await createTopic({ name: newTopicName.trim(), description: newTopicDesc.trim() || undefined, category });
      setTopics((prev) => [...prev, created]);
      setNewTopicName('');
      setNewTopicDesc('');
      setShowAddForm(false);
      onTopicsChanged();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleUpdateTopic = async (topicId: string) => {
    if (!editTopicName.trim()) return;
    setSaving(true);
    try {
      const updated = await updateTopic(topicId, { name: editTopicName.trim(), description: editTopicDesc.trim() || undefined });
      setTopics((prev) => prev.map((t) => (t.id === topicId ? updated : t)));
      setEditingTopicId(null);
      onTopicsChanged();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDeleteTopic = async (topicId: string) => {
    setDeletingTopicId(topicId);
    try {
      await deleteTopic(topicId);
      toast.success('Đã xóa chủ đề thành công!');
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(null);
        setTopicAction(null);
      }
      onTopicsChanged();
    } catch {
      toast.error('Không thể xóa chủ đề. Vui lòng thử lại.');
    }
    finally { setDeletingTopicId(null); }
  };

  // When admin selects a topic and clicks edit-vocab icon
  const openTopicEditor = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setTopicAction(null);
    setTopicWords([]);
    setTopicSearchQuery('');
    setEditingWord(null);
    setDeletingWord(null);
  };

  const handleSelectAction = (action: TopicAction) => {
    setTopicAction(action);
    if (action === 'add') {
      // Will open word modal on confirm
    } else if (selectedTopic) {
      fetchTopicWords(selectedTopic.id);
    }
    setTopicSearchQuery('');
  };

  const filteredTopicWords = topicWords.filter(
    (w) =>
      w.word.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
      w.definition_vi.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
      w.definition_en.toLowerCase().includes(topicSearchQuery.toLowerCase())
  );

  const handleDeleteWord = async () => {
    if (!deletingWord) return;
    setDeletingWordLoading(true);
    try {
      await deleteVocabulary(deletingWord.id);
      setTopicWords((prev) => prev.filter((w) => w.id !== deletingWord.id));
      setTopics((prev) =>
        prev.map((t) => (t.id === selectedTopic?.id ? { ...t, wordCount: Math.max(0, t.wordCount - 1) } : t))
      );
      setDeletingWord(null);
      onTopicsChanged();
    } catch { /* ignore */ }
    finally { setDeletingWordLoading(false); }
  };

  const handleWordSaved = (word: VocabItem) => {
    if (editingWord) {
      setTopicWords((prev) => prev.map((w) => (w.id === word.id ? word : w)));
    } else {
      setTopicWords((prev) => [...prev, word]);
      setTopics((prev) =>
        prev.map((t) => (t.id === selectedTopic?.id ? { ...t, wordCount: t.wordCount + 1 } : t))
      );
    }
    setEditingWord(null);
    setWordModalOpen(false);
    onTopicsChanged();
  };

  if (!open) return null;

  // ── Sub-modal: Topic vocabulary editor ──────────────────────────────────────
  if (selectedTopic && !wordModalOpen && !deletingWord) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chỉnh sửa: {selectedTopic.name}</h2>
              <p className="text-sm text-gray-500">{selectedTopic.wordCount} từ vựng</p>
            </div>
            <button onClick={() => { setSelectedTopic(null); setTopicAction(null); }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <HiOutlineX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Box 1: Action selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Bạn muốn:</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'add' as TopicAction, label: 'Thêm từ vựng', icon: '➕', color: 'green' },
                  { value: 'delete' as TopicAction, label: 'Xóa từ vựng', icon: '🗑️', color: 'red' },
                  { value: 'edit' as TopicAction, label: 'Chỉnh sửa từ vựng', icon: '✏️', color: 'blue' },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectAction(opt.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${topicAction === opt.value
                      ? opt.color === 'green'
                        ? 'border-green-400 bg-green-50'
                        : opt.color === 'red'
                          ? 'border-red-400 bg-red-50'
                          : 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-2xl mb-2 block">{opt.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action: Add — confirm button */}
            {topicAction === 'add' && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <p className="text-sm text-green-700 mb-3">Thêm từ vựng mới vào chủ đề &quot;{selectedTopic.name}&quot;</p>
                <button
                  onClick={() => { setEditingWord(null); setWordModalOpen(true); }}
                  className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-sm font-semibold text-white transition-colors"
                >
                  Xác nhận — Thêm từ vựng
                </button>
              </div>
            )}

            {/* Action: Delete or Edit — search box + word list */}
            {(topicAction === 'delete' || topicAction === 'edit') && (
              <div>
                <div className="relative mb-4">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={`Tìm từ vựng trong "${selectedTopic.name}"...`}
                    className="pl-10 border-gray-200"
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                  />
                </div>

                {loadingTopicWords ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : filteredTopicWords.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <HiOutlineBookOpen className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">{topicSearchQuery ? 'Không tìm thấy từ vựng' : 'Chủ đề chưa có từ vựng nào'}</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredTopicWords.map((w) => (
                      <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm truncate">{w.word}</p>
                          <p className="text-xs text-gray-500 truncate">{w.definition_vi}</p>
                        </div>
                        {topicAction === 'delete' ? (
                          <button
                            onClick={() => setDeletingWord(w)}
                            className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition-colors"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" /> Xóa
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditingWord(w); setWordModalOpen(true); }}
                            className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold transition-colors"
                          >
                            <HiOutlinePencil className="w-3.5 h-3.5" /> Sửa
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Sub-modal: Word add/edit form ───────────────────────────────────────────
  if (selectedTopic && wordModalOpen) {
    return (
      <WordModal
        open={true}
        editWord={editingWord}
        defaultCategory={category}
        defaultTopicId={selectedTopic.id}
        onClose={() => { setWordModalOpen(false); setEditingWord(null); }}
        onSaved={handleWordSaved}
      />
    );
  }

  // ── Sub-modal: Delete word confirm ──────────────────────────────────────────
  if (selectedTopic && deletingWord) {
    return (
      <DeleteConfirm
        word={deletingWord}
        onCancel={() => setDeletingWord(null)}
        onConfirm={handleDeleteWord}
        deleting={deletingWordLoading}
      />
    );
  }

  // ── Main topic list modal ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tùy chỉnh chủ đề</h2>
            <p className="text-sm text-gray-500">{categoryName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topics.length === 0 && !showAddForm ? (
            <div className="text-center py-8 text-gray-400">
              <HiOutlineFolder className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm font-medium">Chưa có chủ đề nào</p>
              <p className="text-xs">Nhấn &quot;Thêm chủ đề&quot; để tạo chủ đề mới</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {topics.map((topic) => (
                <div key={topic.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors group">
                  {editingTopicId === topic.id ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editTopicName}
                        onChange={(e) => setEditTopicName(e.target.value)}
                        placeholder="Tên chủ đề"
                        className="border-gray-200 text-sm"
                      />
                      <Input
                        value={editTopicDesc}
                        onChange={(e) => setEditTopicDesc(e.target.value)}
                        placeholder="Mô tả (tuỳ chọn)"
                        className="border-gray-200 text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateTopic(topic.id)} disabled={saving}
                          className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 disabled:opacity-60">
                          {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button onClick={() => setEditingTopicId(null)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <HiOutlineFolder className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <p className="font-semibold text-gray-900 text-sm truncate">{topic.name}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{topic.wordCount} từ</span>
                        </div>
                        {topic.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate pl-6">{topic.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openTopicEditor(topic)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa từ vựng"
                        >
                          <HiOutlinePencil className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTopicId(topic.id);
                            setEditTopicName(topic.name);
                            setEditTopicDesc(topic.description || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Đổi tên chủ đề"
                        >
                          <HiOutlineCog className="w-4 h-4 text-amber-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          disabled={deletingTopicId === topic.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Xoá chủ đề"
                        >
                          <HiOutlineTrash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {showAddForm ? (
            <div className="p-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 space-y-3">
              <Input
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Tên chủ đề mới (VD: Family, Weather, Food...)"
                className="border-gray-200"
              />
              <Input
                value={newTopicDesc}
                onChange={(e) => setNewTopicDesc(e.target.value)}
                placeholder="Mô tả (tuỳ chọn)"
                className="border-gray-200"
              />
              <div className="flex gap-2">
                <button onClick={handleAddTopic} disabled={saving || !newTopicName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-sm font-semibold text-white transition-colors">
                  {saving ? 'Đang tạo...' : 'Tạo chủ đề'}
                </button>
                <button onClick={() => { setShowAddForm(false); setNewTopicName(''); setNewTopicDesc(''); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Huỷ
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/30 transition-all flex items-center justify-center gap-2">
              <HiOutlinePlus className="w-4 h-4" />
              Thêm chủ đề
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Pagination ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <HiOutlineChevronLeft className="w-4 h-4" /> Trước
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors border ${p === currentPage
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Tiếp <HiOutlineChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Component ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const VocabularyPage = () => {
  const { isAdmin, user } = useAuth();
  console.log('VocabularyPage: Auth state', { isAdmin, user });
  const navigate = useNavigate();

  // Navigation
  const [view, setView] = useState<View>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Data
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [words, setWords] = useState<VocabItem[]>([]);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loadingWords, setLoadingWords] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Topics
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [topicManageOpen, setTopicManageOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Progress
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabItem | null>(null);

  // Delete confirm
  const [deletingWord, setDeletingWord] = useState<VocabItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Grammar
  const [grammarLevels, setGrammarLevels] = useState<GrammarLevel[]>([]);
  const [loadingGrammarLevels, setLoadingGrammarLevels] = useState(false);
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
  const [loadingGrammarTopics, setLoadingGrammarTopics] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<GrammarLevel | null>(null);
  const [grammarTopicModalOpen, setGrammarTopicModalOpen] = useState(false);
  const [editingGrammarTopic, setEditingGrammarTopic] = useState<GrammarTopic | null>(null);
  const [grammarLevelModalOpen, setGrammarLevelModalOpen] = useState(false);
  const [editingGrammarLevel, setEditingGrammarLevel] = useState<GrammarLevel | null>(null);
  const [deletingGrammarTopic, setDeletingGrammarTopic] = useState<GrammarTopic | null>(null);
  const [deletingGrammarTopicLoading, setDeletingGrammarTopicLoading] = useState(false);
  const [deletingGrammarLevel, setDeletingGrammarLevel] = useState<GrammarLevel | null>(null);
  const [deletingGrammarLevelLoading, setDeletingGrammarLevelLoading] = useState(false);
  const [expandedGrammarTopicId, setExpandedGrammarTopicId] = useState<string | null>(null);
  const [uploadingTopicId, setUploadingTopicId] = useState<string | null>(null);
  const [deletingFileTopicId, setDeletingFileTopicId] = useState<string | null>(null);
  const grammarFileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadTopicIdRef = useRef<string | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const categories: Category[] = BASE_CATEGORIES.map((c) => ({
    ...c,
    wordCount: categoryCounts[c.id] ?? 0,
  }));
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const isTopic = TOPIC_CATEGORIES.includes(selectedCategoryId);

  const filteredWords = words.filter(
    (v) =>
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.definition_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.definition_en.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / WORDS_PER_PAGE));
  const pagedWords = filteredWords.slice(
    (currentPage - 1) * WORDS_PER_PAGE,
    currentPage * WORDS_PER_PAGE,
  );

  const completedCount = words.filter((w) => completedIds.has(w.id)).length;
  const progressPct = words.length > 0 ? Math.round((completedCount / words.length) * 100) : 0;

  // ── Fetch helpers ─────────────────────────────────────────────────────────────
  const fetchCounts = useCallback(async () => {
    setLoadingCounts(true);
    try {
      const counts = await getCategoryCounts();
      setCategoryCounts(counts);
    } catch { /* silently ignore */ }
    finally { setLoadingCounts(false); }
  }, []);

  const fetchWords = useCallback(async (categoryId: string) => {
    setLoadingWords(true);
    setWords([]);
    try {
      const data = await getVocabularyByCategory(categoryId);
      setWords(data);
    } catch { setWords([]); }
    finally { setLoadingWords(false); }
  }, []);

  const fetchTopicWords = useCallback(async (topicId: string) => {
    setLoadingWords(true);
    setWords([]);
    try {
      const data = await getVocabularyByTopic(topicId);
      setWords(data);
    } catch { setWords([]); }
    finally { setLoadingWords(false); }
  }, []);

  const fetchTopicsList = useCallback(async (categoryId: string) => {
    setLoadingTopics(true);
    try {
      const data = await getTopicsByCategory(categoryId);
      setTopics(data);
    } catch { setTopics([]); }
    finally { setLoadingTopics(false); }
  }, []);

  const fetchGrammarLevels = useCallback(async () => {
    setLoadingGrammarLevels(true);
    try { const data = await getGrammarLevels(); setGrammarLevels(data); }
    catch { setGrammarLevels([]); }
    finally { setLoadingGrammarLevels(false); }
  }, []);

  const fetchGrammarTopics = useCallback(async (levelId: string) => {
    setLoadingGrammarTopics(true);
    try { const data = await getTopicsByLevel(levelId); setGrammarTopics(data); }
    catch { setGrammarTopics([]); }
    finally { setLoadingGrammarTopics(false); }
  }, []);

  const fetchProgress = useCallback(async (categoryId: string) => {
    try {
      const ids = await getMyProgress(categoryId);
      setCompletedIds(new Set(ids));
    } catch { setCompletedIds(new Set()); }
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────────────
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  useEffect(() => {
    if (view === 'vocab-list' && selectedCategoryId && !isTopic) {
      fetchWords(selectedCategoryId);
      if (user) fetchProgress(selectedCategoryId);
    }
    if (view === 'topic-list' && selectedCategoryId && isTopic) {
      fetchTopicsList(selectedCategoryId);
    }
    if (view === 'topic-vocab-list' && selectedTopic) {
      fetchTopicWords(selectedTopic.id);
      if (user) fetchProgress(selectedCategoryId);
    }
  }, [view, selectedCategoryId, selectedTopic, user, isTopic, fetchWords, fetchTopicWords, fetchTopicsList, fetchProgress]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  useEffect(() => {
    if (view === 'grammar') fetchGrammarLevels();
  }, [view, fetchGrammarLevels]);

  useEffect(() => {
    if (view === 'grammar-topic-list' && selectedLevel) fetchGrammarTopics(selectedLevel.id);
  }, [view, selectedLevel, fetchGrammarTopics]);

  // ── Navigation ────────────────────────────────────────────────────────────────
  const goHome = () => { setView('home'); setSelectedCategoryId(''); setSearchQuery(''); setCurrentPage(1); setSelectedTopic(null); };
  const goVocabulary = () => { setView('vocabulary'); setSelectedCategoryId(''); setSearchQuery(''); setCurrentPage(1); setSelectedTopic(null); };

  const openCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setSearchQuery('');
    setCurrentPage(1);
    setCompletedIds(new Set());
    setSelectedTopic(null);
    if (TOPIC_CATEGORIES.includes(catId)) {
      setView('topic-list');
    } else {
      setView('vocab-list');
    }
  };

  const openTopicVocabList = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setView('topic-vocab-list');
    setSearchQuery('');
    setCurrentPage(1);
    setCompletedIds(new Set());
  };

  const goGrammar = () => { setView('grammar'); setSelectedLevel(null); };
  const openGrammarLevel = (level: GrammarLevel) => {
    setSelectedLevel(level);
    setView('grammar-topic-list');
    setExpandedGrammarTopicId(null);
  };

  // ── Grammar CRUD handlers ──────────────────────────────────────────────────
  const handleGrammarTopicSaved = (topic: GrammarTopic) => {
    if (editingGrammarTopic) {
      setGrammarTopics((prev: GrammarTopic[]) => prev.map((t) => (t.id === topic.id ? topic : t)));
    } else {
      setGrammarTopics((prev: GrammarTopic[]) => [...prev, topic]);
      setGrammarLevels((prev: GrammarLevel[]) =>
        prev.map((l) => (l.id === topic.level_id ? { ...l, topicCount: l.topicCount + 1 } : l))
      );
    }
    setEditingGrammarTopic(null);
  };

  const handleGrammarLevelSaved = (level: GrammarLevel) => {
    if (editingGrammarLevel) {
      setGrammarLevels((prev: GrammarLevel[]) =>
        prev.map((l) => (l.id === level.id ? { ...level, topicCount: l.topicCount } : l))
      );
    } else {
      setGrammarLevels((prev: GrammarLevel[]) => [...prev, { ...level, topicCount: 0 }]);
    }
    setEditingGrammarLevel(null);
  };

  const confirmDeleteGrammarTopic = async () => {
    if (!deletingGrammarTopic) return;
    setDeletingGrammarTopicLoading(true);
    try {
      await deleteGrammarTopic(deletingGrammarTopic.id);
      toast.success('Đã xóa chủ đề ngữ pháp!');
      setGrammarTopics((prev: GrammarTopic[]) => prev.filter((t) => t.id !== deletingGrammarTopic.id));
      setGrammarLevels((prev: GrammarLevel[]) =>
        prev.map((l) =>
          l.id === selectedLevel?.id ? { ...l, topicCount: Math.max(0, l.topicCount - 1) } : l
        )
      );
      setDeletingGrammarTopic(null);
    } catch {
      toast.error('Lỗi khi xóa chủ đề ngữ pháp.');
    }
    finally { setDeletingGrammarTopicLoading(false); }
  };

  const confirmDeleteGrammarLevel = async () => {
    if (!deletingGrammarLevel) return;
    setDeletingGrammarLevelLoading(true);
    try {
      await deleteGrammarLevel(deletingGrammarLevel.id);
      toast.success('Đã xóa cấp độ ngữ pháp!');
      setGrammarLevels((prev) => prev.filter((l) => l.id !== deletingGrammarLevel.id));
      setDeletingGrammarLevel(null);
    } catch {
      toast.error('Lỗi khi xóa cấp độ ngữ pháp.');
    }
    finally { setDeletingGrammarLevelLoading(false); }
  };

  const handleGrammarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const topicId = pendingUploadTopicIdRef.current;
    if (!file || !topicId) return;
    e.target.value = '';
    setUploadingTopicId(topicId);
    try {
      const updated = await uploadGrammarTopicFile(topicId, file);
      toast.success('Đã tải tài liệu lên!');
      setGrammarTopics((prev) => prev.map((t) => (t.id === topicId ? updated : t)));
    } catch {
      toast.error('Lỗi khi tải tài liệu.');
    }
    finally { setUploadingTopicId(null); pendingUploadTopicIdRef.current = null; }
  };

  const handleDeleteGrammarTopicFile = async (topicId: string) => {
    setDeletingFileTopicId(topicId);
    try {
      const updated = await deleteGrammarTopicFile(topicId);
      toast.success('Đã xóa tài liệu!');
      setGrammarTopics((prev) => prev.map((t) => (t.id === topicId ? updated : t)));
    } catch {
      toast.error('Lỗi khi xóa tài liệu.');
    }
    finally { setDeletingFileTopicId(null); }
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────────
  const handleWordSaved = (word: VocabItem) => {
    if (editingWord) {
      toast.success('Đã cập nhật từ vựng!');
      setWords((prev: VocabItem[]) => prev.map((w) => (w.id === word.id ? word : w)));
    } else {
      toast.success('Đã thêm từ vựng mới!');
      setWords((prev: VocabItem[]) => [...prev, word]);
      setCategoryCounts((prev: Record<string, number>) => ({
        ...prev,
        [word.category]: (prev[word.category] ?? 0) + 1,
      }));
    }
    setEditingWord(null);
  };

  const confirmDelete = async () => {
    if (!deletingWord) return;
    setDeleting(true);
    try {
      await deleteVocabulary(deletingWord.id);
      toast.success('Đã xóa từ vựng thành công!');
      setWords((prev: VocabItem[]) => prev.filter((w) => w.id !== deletingWord.id));
      setCategoryCounts((prev: Record<string, number>) => ({
        ...prev,
        [deletingWord.category]: Math.max(0, (prev[deletingWord.category] ?? 1) - 1),
      }));
      setCompletedIds((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(deletingWord.id);
        return next;
      });
      setDeletingWord(null);
    } catch {
      toast.error('Lỗi khi xóa từ vựng.');
    }
    finally { setDeleting(false); }
  };

  const handleExportExcel = async () => {
    if (!isAdmin) return;
    const loadingToast = toast.loading('Đang chuẩn bị file Excel...');
    try {
      await exportVocabulary();
      toast.success('Xuất file Excel thành công!');
    } catch (err) {
      console.error('Export Excel error:', err);
      toast.error('Có lỗi xảy ra khi xuất file Excel.');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleToggleComplete = async (vocabId: string) => {
    if (!user || togglingId) return;
    setTogglingId(vocabId);
    try {
      const result = await toggleComplete(vocabId);
      setCompletedIds((prev: Set<string>) => {
        const next = new Set(prev);
        if (result.completed) next.add(vocabId);
        else next.delete(vocabId);
        return next;
      });
    } catch { /* ignore */ }
    finally { setTogglingId(null); }
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── Render: Word List (shared between slang flat list and topic vocab list) ─
  // ═══════════════════════════════════════════════════════════════════════════════
  const renderWordList = (cat: Category, breadcrumbExtra?: { label: string; onClick: () => void }) => {
    const startIdx = (currentPage - 1) * WORDS_PER_PAGE + 1;
    const endIdx = Math.min(currentPage * WORDS_PER_PAGE, filteredWords.length);

    return (
      <>
        <WordModal
          open={modalOpen}
          editWord={editingWord}
          defaultCategory={cat.id}
          defaultTopicId={selectedTopic?.id}
          onClose={() => { setModalOpen(false); setEditingWord(null); }}
          onSaved={handleWordSaved}
        />
        <DeleteConfirm
          word={deletingWord}
          onCancel={() => setDeletingWord(null)}
          onConfirm={confirmDelete}
          deleting={deleting}
        />

        <div className="space-y-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <button onClick={goHome} className="hover:text-primary-600 transition-colors">
              Từ vựng &amp; Ngữ pháp
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <button onClick={goVocabulary} className="hover:text-primary-600 transition-colors">
              Từ vựng
            </button>
            {breadcrumbExtra && (
              <>
                <HiOutlineChevronRight className="w-4 h-4" />
                <button onClick={breadcrumbExtra.onClick} className="hover:text-primary-600 transition-colors">
                  {breadcrumbExtra.label}
                </button>
              </>
            )}
            <HiOutlineChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">
              {selectedTopic ? selectedTopic.name : cat.name}
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={breadcrumbExtra ? breadcrumbExtra.onClick : goVocabulary}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedTopic ? selectedTopic.name : cat.name}
                  </h1>
                </div>
                <p className="text-gray-500 text-sm">
                  {selectedTopic ? (selectedTopic.description || cat.description) : cat.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <Button variant="ghost" className="border border-primary-200 text-primary-700 hover:bg-primary-50"
                  onClick={handleExportExcel}>
                  <HiOutlineDownload className="w-5 h-5 mr-2" />
                  Xuất Excel
                </Button>
              )}
              {isAdmin && (
                <Button className="bg-primary-600 hover:bg-primary-700"
                  onClick={() => { setEditingWord(null); setModalOpen(true); }}>
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Thêm từ mới
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          {!isAdmin && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {loadingWords ? '…' : words.length}
                </p>
                <p className="text-sm text-gray-500">Tổng từ vựng</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                <p className="text-sm text-gray-500">Đã học</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {words.length - completedCount > 0 ? words.length - completedCount : 0}
                </p>
                <p className="text-sm text-gray-500">Chưa học</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{progressPct}%</p>
                <p className="text-sm text-gray-500">Hoàn thành</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {!isAdmin && !loadingWords && words.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Tiến độ học tập</span>
                <span className="text-sm font-bold text-primary-600">
                  {completedCount}/{words.length} từ đã học
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">0%</span>
                <span className="text-xs font-medium text-primary-600">{progressPct}%</span>
                <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={`Tìm kiếm trong "${selectedTopic ? selectedTopic.name : cat.name}"...`}
                className="pl-10 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Page info */}
          {!loadingWords && filteredWords.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Hiển thị từ{' '}
                <span className="font-semibold text-gray-700">{startIdx}–{endIdx}</span>
                {' '}trong tổng{' '}
                <span className="font-semibold text-gray-700">{filteredWords.length}</span> từ
                {searchQuery && ' (kết quả tìm kiếm)'}
              </span>
              <span>
                Trang{' '}
                <span className="font-semibold text-gray-700">{currentPage}</span>
                {' '}/{' '}
                <span className="font-semibold text-gray-700">{totalPages}</span>
              </span>
            </div>
          )}

          {/* Loading skeleton */}
          {loadingWords && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-8 bg-gray-100 rounded-lg w-28" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Word list */}
          {!loadingWords && pagedWords.length > 0 && (
            <div className="space-y-3">
              {pagedWords.map((vocab, index) => {
                const diffConfig = getDifficultyConfig(vocab.difficulty);
                const isCompleted = completedIds.has(vocab.id);
                const isToggling = togglingId === vocab.id;
                const globalIndex = (currentPage - 1) * WORDS_PER_PAGE + index + 1;

                return (
                  <div
                    key={vocab.id}
                    className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${isCompleted
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-gray-200 hover:border-primary-200 hover:shadow-sm'
                      }`}
                  >
                    <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {globalIndex}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-green-700' : 'text-gray-900'
                              }`}>
                              {vocab.word}
                            </h3>
                            <button onClick={() => speakWord(vocab.word)}
                              className="p-1 rounded-full hover:bg-primary-50 transition-colors flex-shrink-0"
                              title="Phát âm">
                              <HiOutlineVolumeUp className="w-4 h-4 text-primary-500" />
                            </button>
                            {vocab.pronunciation && (
                              <span className="text-sm text-gray-400">{vocab.pronunciation}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" title="Yêu thích">
                          <HiOutlineHeart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" title="Lưu">
                          <HiOutlineBookmark className="w-4 h-4 text-gray-400 hover:text-primary-600" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              className="p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                              onClick={() => { setEditingWord(vocab); setModalOpen(true); }}
                              title="Sửa">
                              <HiOutlinePencil className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                              onClick={() => setDeletingWord(vocab)}
                              title="Xóa">
                              <HiOutlineTrash className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                        {user && (
                          <button
                            onClick={() => handleToggleComplete(vocab.id)}
                            disabled={isToggling}
                            title={isCompleted ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}
                            className={`ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 ${isCompleted
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700'
                              }`}
                          >
                            <HiOutlineCheck className={`w-3.5 h-3.5 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                            {isToggling ? '...' : isCompleted ? 'Hoàn thành' : 'Đánh dấu'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-4 space-y-2 pl-15">
                      <div className="pl-10 space-y-2">
                        <div className="flex gap-2">
                          <span className="mt-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-mono flex-shrink-0 h-fit">EN</span>
                          <p className="text-sm text-gray-700 leading-relaxed">{vocab.definition_en}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="mt-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-mono flex-shrink-0 h-fit">VI</span>
                          <p className="text-sm text-gray-700 leading-relaxed">{vocab.definition_vi}</p>
                        </div>
                        {vocab.example && (
                          <div className="flex gap-2">
                            <span className="mt-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-xs font-mono flex-shrink-0 h-fit">Ex</span>
                            <p className="text-sm text-gray-500 italic leading-relaxed">&quot;{vocab.example}&quot;</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffConfig.bg} ${diffConfig.text}`}>
                        {diffConfig.label}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <HiOutlineCheck className="w-3 h-3" />
                          Đã học
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loadingWords && totalPages > 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          )}

          {/* Empty state */}
          {!loadingWords && filteredWords.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <HiOutlineBookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              {searchQuery ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy từ vựng</h3>
                  <p className="text-gray-500">Thử điều chỉnh từ khoá tìm kiếm</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có từ vựng nào</h3>
                  <p className="text-gray-500">
                    {isAdmin ? 'Nhấn "Thêm từ mới" để bắt đầu thêm từ vựng.' : 'Danh mục này chưa có từ vựng.'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Home View ──────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'home') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Từ vựng &amp; Ngữ pháp</h1>
          <p className="text-gray-500 mt-1">Chọn lĩnh vực bạn muốn học hôm nay</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={goVocabulary}
            className="group relative bg-white rounded-2xl border-2 border-primary-100 hover:border-primary-400 shadow-sm hover:shadow-lg transition-all duration-300 text-left overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600 w-full" />
            <div className="p-8">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📚</div>
                <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
                  Khám phá <HiOutlineChevronRight className="w-4 h-4" />
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Từ vựng</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Học từ vựng theo chủ đề từ cơ bản A1 đến nâng cao C2, cùng từ vựng Slang thông dụng.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">7 danh mục</span>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">Có phát âm</span>
              </div>
            </div>
          </button>
          <button onClick={() => setView('grammar')}
            className="group relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all duration-300 text-left overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />
            <div className="p-8">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✏️</div>
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  Khám phá <HiOutlineChevronRight className="w-4 h-4" />
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ngữ pháp</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Hệ thống ngữ pháp tiếng Anh đầy đủ, từ thì cơ bản đến cấu trúc câu nâng cao.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Basic &amp; Harder</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Nội dung chi tiết</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Vocabulary Category Grid ───────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'vocabulary') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={goHome} className="hover:text-primary-600 transition-colors">
            Từ vựng &amp; Ngữ pháp
          </button>
          <HiOutlineChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Từ vựng</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Từ vựng</h1>
            <p className="text-gray-500">Chọn danh mục từ vựng bạn muốn học</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => openCategory(cat.id)}
              className={`group bg-white rounded-2xl border-2 ${cat.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden`}>
              <div className={`h-1.5 bg-gradient-to-r ${cat.gradient} w-full`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.lightBg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm leading-snug">{cat.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.badge}`}>
                    {loadingCounts ? '…' : `${cat.wordCount} từ`}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-primary-600 transition-colors font-medium">
                    Học ngay <HiOutlineChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Topic List (A1-C2 categories) ──────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'topic-list' && selectedCategory) {
    const cat = selectedCategory;
    return (
      <>
        <TopicManageModal
          open={topicManageOpen}
          category={cat.id}
          categoryName={cat.name}
          onClose={() => setTopicManageOpen(false)}
          onTopicsChanged={() => { fetchTopicsList(cat.id); fetchCounts(); }}
        />

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={goHome} className="hover:text-primary-600 transition-colors">
              Từ vựng &amp; Ngữ pháp
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <button onClick={goVocabulary} className="hover:text-primary-600 transition-colors">
              Từ vựng
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{cat.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={goVocabulary}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{cat.name}</h1>
                </div>
                <p className="text-gray-500 text-sm">{cat.description}</p>
              </div>
            </div>
            {isAdmin && (
              <Button className="bg-primary-600 hover:bg-primary-700"
                onClick={() => setTopicManageOpen(true)}>
                <HiOutlineCog className="w-5 h-5 mr-2" />
                Tùy chỉnh chủ đề
              </Button>
            )}
          </div>

          {loadingTopics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <HiOutlineFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chủ đề nào</h3>
              <p className="text-gray-500 text-sm mb-6">
                {isAdmin
                  ? 'Nhấn "Tùy chỉnh chủ đề" để tạo chủ đề mới cho danh mục này.'
                  : 'Danh mục này chưa có chủ đề nào. Hãy quay lại sau.'}
              </p>
              {isAdmin && (
                <Button className="bg-primary-600 hover:bg-primary-700"
                  onClick={() => setTopicManageOpen(true)}>
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Tạo chủ đề đầu tiên
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => openTopicVocabList(topic)}
                  className={`group bg-white rounded-2xl border-2 ${cat.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden`}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${cat.gradient} w-full`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${cat.lightBg} flex items-center justify-center`}>
                        <HiOutlineFolder className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.badge}`}>
                        {topic.wordCount} từ
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{topic.name}</h3>
                    {topic.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{topic.description}</p>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-primary-600 transition-colors font-medium">
                      Học ngay <HiOutlineChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Slang Vocabulary Word List (flat, no topics) ───────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'vocab-list' && selectedCategory) {
    return renderWordList(selectedCategory);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Topic Vocabulary Word List ─────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'topic-vocab-list' && selectedCategory && selectedTopic) {
    return renderWordList(selectedCategory, {
      label: selectedCategory.name,
      onClick: () => {
        setView('topic-list');
        setSelectedTopic(null);
        setSearchQuery('');
        setCurrentPage(1);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Grammar Levels View ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'grammar') {
    return (
      <>
        <GrammarLevelModal
          open={grammarLevelModalOpen}
          editLevel={editingGrammarLevel}
          onClose={() => { setGrammarLevelModalOpen(false); setEditingGrammarLevel(null); }}
          onSaved={handleGrammarLevelSaved}
        />
        <GrammarDeleteConfirm
          item={deletingGrammarLevel}
          type="level"
          onCancel={() => setDeletingGrammarLevel(null)}
          onConfirm={confirmDeleteGrammarLevel}
          deleting={deletingGrammarLevelLoading}
        />
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={goHome} className="hover:text-primary-600 transition-colors">
              Từ vựng &amp; Ngữ pháp
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">Ngữ pháp</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ngữ pháp</h1>
              <p className="text-gray-500">Chọn cấp độ ngữ pháp bạn muốn học</p>
            </div>
            {isAdmin && (
              <Button className="bg-primary-600 hover:bg-primary-700"
                onClick={() => { setEditingGrammarLevel(null); setGrammarLevelModalOpen(true); }}>
                <HiOutlinePlus className="w-5 h-5 mr-2" />
                Thêm cấp độ
              </Button>
            )}
          </div>

          {loadingGrammarLevels ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : grammarLevels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <span className="text-5xl mb-4 block">✏️</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có cấp độ nào</h3>
              {isAdmin && (
                <Button className="mt-4 bg-primary-600 hover:bg-primary-700"
                  onClick={() => { setEditingGrammarLevel(null); setGrammarLevelModalOpen(true); }}>
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Tạo cấp độ đầu tiên
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grammarLevels.map((level, idx) => {
                const colors = GRAMMAR_LEVEL_COLORS[idx % GRAMMAR_LEVEL_COLORS.length];
                return (
                  <div key={level.id}
                    onClick={() => openGrammarLevel(level)}
                    className={`group bg-white rounded-2xl border-2 ${colors.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer`}>
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient} w-full`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.lightBg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                          {colors.icon}
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingGrammarLevel(level); setGrammarLevelModalOpen(true); }}
                              className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Chỉnh sửa cấp độ">
                              <HiOutlinePencil className="w-4 h-4 text-amber-500" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletingGrammarLevel(level); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Xoá cấp độ">
                              <HiOutlineTrash className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">{level.name}</h3>
                      {level.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{level.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                          {level.topicCount} chủ điểm
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-primary-600 transition-colors">
                          Xem ngay <HiOutlineChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ── Grammar Topic List ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════
  if (view === 'grammar-topic-list' && selectedLevel) {
    const levelIdx = grammarLevels.findIndex((l) => l.id === selectedLevel.id);
    const colors = GRAMMAR_LEVEL_COLORS[levelIdx >= 0 ? levelIdx % GRAMMAR_LEVEL_COLORS.length : 0];
    return (
      <>
        <GrammarTopicModal
          open={grammarTopicModalOpen}
          editTopic={editingGrammarTopic}
          levelId={selectedLevel.id}
          onClose={() => { setGrammarTopicModalOpen(false); setEditingGrammarTopic(null); }}
          onSaved={handleGrammarTopicSaved}
        />
        <GrammarDeleteConfirm
          item={deletingGrammarTopic}
          type="topic"
          onCancel={() => setDeletingGrammarTopic(null)}
          onConfirm={confirmDeleteGrammarTopic}
          deleting={deletingGrammarTopicLoading}
        />
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={goHome} className="hover:text-primary-600 transition-colors">
              Từ vựng &amp; Ngữ pháp
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <button onClick={goGrammar} className="hover:text-primary-600 transition-colors">
              Ngữ pháp
            </button>
            <HiOutlineChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{selectedLevel.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={goGrammar}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{colors.icon}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedLevel.name}</h1>
                </div>
                {selectedLevel.description && (
                  <p className="text-gray-500 text-sm">{selectedLevel.description}</p>
                )}
              </div>
            </div>
            {isAdmin && (
              <Button className="bg-primary-600 hover:bg-primary-700"
                onClick={() => { setEditingGrammarTopic(null); setGrammarTopicModalOpen(true); }}>
                <HiOutlinePlus className="w-5 h-5 mr-2" />
                Thêm ngữ pháp
              </Button>
            )}
          </div>

          {loadingGrammarTopics ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : grammarTopics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <HiOutlineBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chủ điểm nào</h3>
              <p className="text-gray-500 text-sm mb-6">
                {isAdmin
                  ? 'Nhấn “Thêm ngữ pháp” để tạo chủ điểm đầu tiên.'
                  : 'Cấp độ này chưa có chủ điểm ngữ pháp.'}
              </p>
              {isAdmin && (
                <Button className="bg-primary-600 hover:bg-primary-700"
                  onClick={() => { setEditingGrammarTopic(null); setGrammarTopicModalOpen(true); }}>
                  <HiOutlinePlus className="w-5 h-5 mr-2" />
                  Thêm ngữ pháp
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Hidden file input for grammar topic uploads */}
              <input
                ref={grammarFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleGrammarFileChange}
              />
              {grammarTopics.map((topic, idx) => {
                const hasFile = !!topic.content?.startsWith('/uploads/grammar/');
                const storedFileName = hasFile ? topic.content!.split('/').pop()! : null;
                // Strip timestamp prefix (e.g. "1234567890-MyFile.pdf" → "MyFile.pdf")
                const displayFileName = storedFileName ? storedFileName.replace(/^\d+-/, '') : null;
                const fileUrl = hasFile ? `${API_BASE}${topic.content}` : null;
                const isUploading = uploadingTopicId === topic.id;
                const isDeletingFile = deletingFileTopicId === topic.id;
                return (
                  <div key={topic.id}
                    onClick={() => hasFile && navigate(`/grammar/topic/${topic.id}`)}
                    className={`bg-white rounded-xl border-2 border-gray-100 transition-all duration-200 ${hasFile ? 'hover:border-primary-300 hover:shadow-sm cursor-pointer' : 'hover:border-gray-200'
                      }`}>
                    <div className="flex items-start justify-between p-4 gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg ${colors.lightBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{topic.name}</h4>
                          {topic.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{topic.description}</p>
                          )}
                          {hasFile && isAdmin && displayFileName && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <HiOutlineDocumentText className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                              <span className="text-xs text-primary-600 font-medium truncate max-w-[200px]" title={displayFileName}>
                                {displayFileName}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteGrammarTopicFile(topic.id); }}
                                disabled={isDeletingFile}
                                className="p-0.5 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                                title="Xoá file">
                                <HiOutlineX className="w-3 h-3 text-red-400" />
                              </button>
                            </div>
                          )}
                          {hasFile && !isAdmin && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <HiOutlineDocumentText className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                              <span className="text-xs text-primary-500 font-medium">Có tài liệu</span>
                            </div>
                          )}
                          {!hasFile && (
                            <p className="text-xs text-gray-400 mt-1 italic">Chưa có tài liệu</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                pendingUploadTopicIdRef.current = topic.id;
                                grammarFileInputRef.current?.click();
                              }}
                              disabled={isUploading}
                              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                              title="Tải lên tài liệu (PDF/Word)">
                              {isUploading
                                ? <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin block" />
                                : <HiOutlineUpload className="w-4 h-4 text-green-500" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingGrammarTopic(topic); setGrammarTopicModalOpen(true); }}
                              className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa">
                              <HiOutlinePencil className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletingGrammarTopic(topic); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Xoá">
                              <HiOutlineTrash className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  }

  return null;
};

export default VocabularyPage;
