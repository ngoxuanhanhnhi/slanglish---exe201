import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardList,
  HiOutlineExclamation,
} from 'react-icons/hi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getQuiz, submitQuizResult, QuizDetail, QuizQuestion } from '../services/quiz.service';

type Phase = 'quiz' | 'result' | 'blocked';

const QuizPlayPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  // Countdown timer: remaining seconds (null = no limit, counts up via elapsed)
  const [remaining, setRemaining] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!id) return;
    getQuiz(id)
      .then((data) => {
        setQuiz(data);
        // Check attempt limit
        if (data.max_attempts !== null && data.attemptCount >= data.max_attempts) {
          setPhase('blocked');
          return;
        }
        // Set countdown if time_limit exists (stored in minutes)
        if (data.time_limit) {
          setRemaining(data.time_limit * 60);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (phase !== 'quiz' || !quiz) return;
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      if (remaining !== null) {
        setRemaining((r) => {
          if (r === null) return null;
          if (r <= 1) return 0;
          return r - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, quiz, remaining !== null]);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);
  const current: QuizQuestion | undefined = questions[currentIdx];

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const res = await submitQuizResult(quiz.id, answers, elapsed);
      setResult({ score: res.score, total: res.total_questions });
      setPhase('result');
    } catch {
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [quiz, answers, elapsed]);

  // Auto-submit when countdown reaches 0
  useEffect(() => {
    if (remaining === 0 && phase === 'quiz') {
      handleSubmit();
    }
  }, [remaining, phase, handleSubmit]);

  const handleExit = () => {
    setExitConfirmOpen(true);
  };

  const confirmExit = async () => {
    setExitConfirmOpen(false);
    await handleSubmit();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <HiOutlineClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Không tìm thấy bài quiz hoặc chưa có câu hỏi.</p>
        <button onClick={() => navigate('/quiz')} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          ← Quay lại
        </button>
      </div>
    );
  }

  // ── Blocked phase (max attempts reached) ────────────────────────────────────
  if (phase === 'blocked') {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <HiOutlineExclamation className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Đã hết lượt làm bài</h2>
        <p className="text-gray-500 mb-6">
          Bạn đã sử dụng hết {quiz.max_attempts} lượt làm bài cho quiz "<strong>{quiz.title}</strong>".
        </p>
        <button onClick={() => navigate('/quiz')} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
          ← Quay lại danh mục
        </button>
      </div>
    );
  }

  // ── Result phase ────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const isGood = pct >= 70;
    const canRetry = quiz.max_attempts === null || (quiz.attemptCount + 1) < quiz.max_attempts;

    return (
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isGood ? 'bg-green-100' : 'bg-orange-100'}`}>
            {isGood ? (
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <HiOutlineXCircle className="w-10 h-10 text-orange-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isGood ? 'Tuyệt vời!' : 'Cố gắng thêm nhé!'}
          </h2>
          <p className="text-gray-500 mb-6">{quiz.title}</p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className={`text-4xl font-bold ${isGood ? 'text-green-600' : 'text-orange-600'}`}>{pct}%</p>
              <p className="text-sm text-gray-400 mt-1">Điểm số</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-bold text-gray-900">{result.score}/{result.total}</p>
              <p className="text-sm text-gray-400 mt-1">Câu đúng</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-bold text-gray-900">{formatTime(elapsed)}</p>
              <p className="text-sm text-gray-400 mt-1">Thời gian</p>
            </div>
          </div>

          {quiz.max_attempts !== null && (
            <p className="text-xs text-gray-400">
              Đã dùng {quiz.attemptCount + 1}/{quiz.max_attempts} lượt
            </p>
          )}
        </div>

        {/* Answer review */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Chi tiết đáp án</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {questions.map((q, idx) => {
              const userAns = answers[q.id] || '';
              const isCorrect = userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
              return (
                <div key={q.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{q.question_text}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          Bạn chọn: <strong>{userAns || '(Chưa trả lời)'}</strong>
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Đáp án đúng: <strong>{q.correct_answer}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            ← Quay lại danh mục
          </button>
          {canRetry && (
            <button
              onClick={() => {
                submittedRef.current = false;
                setPhase('quiz');
                setAnswers({});
                setCurrentIdx(0);
                setElapsed(0);
                setResult(null);
                if (quiz.time_limit) setRemaining(quiz.time_limit * 60);
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
              Làm lại
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Quiz phase ──────────────────────────────────────────────────────────────
  const answered = Object.keys(answers).length;
  const timerDisplay = remaining !== null ? formatTime(remaining) : formatTime(elapsed);
  const isTimeLow = remaining !== null && remaining <= 60;

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
        <button onClick={handleExit} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium">
          <HiOutlineChevronLeft className="w-4 h-4" />
          Thoát
        </button>
        <h2 className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{quiz.title}</h2>
        <div className={`flex items-center gap-1 text-sm font-medium ${isTimeLow ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
          <HiOutlineClock className="w-4 h-4" />
          {timerDisplay}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Câu {currentIdx + 1} / {questions.length}</span>
          <span>{answered} đã trả lời</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {current && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Question type badge */}
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-4 bg-gray-100 text-gray-600">
            {current.question_type === 'multiple_choice' && 'Trắc nghiệm'}
            {current.question_type === 'true_false' && 'Đúng / Sai'}
            {current.question_type === 'fill_in_blank' && 'Điền vào chỗ trống'}
          </span>

          <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
            {current.question_text}
          </h3>

          {/* Options */}
          {current.question_type === 'multiple_choice' && current.options.length > 0 && (
            <div className="space-y-3">
              {current.options.map((opt) => {
                const selected = answers[current.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswer(current.id, opt)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium ${selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {current.question_type === 'true_false' && (
            <div className="flex gap-4">
              {['True', 'False'].map((val) => {
                const selected = answers[current.id] === val;
                return (
                  <button
                    key={val}
                    onClick={() => setAnswer(current.id, val)}
                    className={`flex-1 px-4 py-4 rounded-xl border-2 transition-all text-sm font-semibold ${selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}>
                    {val}
                  </button>
                );
              })}
            </div>
          )}

          {current.question_type === 'fill_in_blank' && (
            <input
              type="text"
              value={answers[current.id] || ''}
              onChange={(e) => setAnswer(current.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              placeholder="Nhập câu trả lời..."
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-40">
          ← Trước
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-[300px]">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${idx === currentIdx
                  ? 'bg-primary-600 text-white'
                  : answers[q.id]
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {currentIdx < questions.length - 1 && (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
              Tiếp →
            </button>
          )}
          <button
            onClick={() => setConfirmSubmitOpen(true)}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50">
            {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>

      {/* Confirm submit modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nộp bài?</h3>
            <p className="text-sm text-gray-500 mb-6">
              {questions.length - answered > 0
                ? `Bạn còn ${questions.length - answered} câu chưa trả lời. Bạn có muốn nộp bài không?`
                : 'Bạn đã trả lời hết tất cả câu hỏi. Xác nhận nộp bài?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                Tiếp tục làm
              </button>
              <button
                onClick={() => { setConfirmSubmitOpen(false); handleSubmit(); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm">
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit confirm modal */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <HiOutlineExclamation className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Thoát bài làm?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Nếu bạn thoát, hệ thống sẽ ghi nhận kết quả hiện tại của bạn. Lượt làm bài này sẽ được tính.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setExitConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                Tiếp tục làm
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors text-sm">
                Thoát & Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayPage;
