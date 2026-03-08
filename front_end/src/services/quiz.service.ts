import api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuizCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  _count: { quizzes: number };
}

export interface QuizListItem {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  time_limit: number | null;
  max_attempts: number | null;
  created_at: string;
  _count: { questions: number };
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string; // "multiple_choice" | "true_false" | "fill_in_blank"
  options: string[];
  correct_answer: string;
  explanation: string | null;
  order: number;
}

export interface QuizDetail {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  time_limit: number | null;
  max_attempts: number | null;
  category: QuizCategory | null;
  questions: QuizQuestion[];
  attemptCount: number;
}

export interface QuizResultData {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  time_spent: number | null;
  completed_at: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const getQuizCategories = async (): Promise<QuizCategory[]> => {
  const res = await api.get('/quiz/categories');
  return res.data.data;
};

export const createQuizCategory = async (data: { name: string; description?: string; icon?: string }): Promise<QuizCategory> => {
  const res = await api.post('/quiz/categories', data);
  return res.data.data;
};

export const updateQuizCategory = async (id: string, data: { name: string; description?: string; icon?: string }): Promise<QuizCategory> => {
  const res = await api.put(`/quiz/categories/${id}`, data);
  return res.data.data;
};

export const deleteQuizCategory = async (id: string): Promise<void> => {
  await api.delete(`/quiz/categories/${id}`);
};

export const getQuizzesByCategory = async (categoryId: string): Promise<QuizListItem[]> => {
  const res = await api.get(`/quiz/categories/${categoryId}/quizzes`);
  return res.data.data;
};

export const getQuiz = async (id: string): Promise<QuizDetail> => {
  const res = await api.get(`/quiz/${id}`);
  return res.data.data;
};

export const uploadQuizExcel = async (
  categoryId: string,
  file: File,
  meta?: { title?: string; description?: string; time_limit?: number; max_attempts?: number }
): Promise<QuizListItem> => {
  const formData = new FormData();
  formData.append('file', file);
  if (meta?.title) formData.append('title', meta.title);
  if (meta?.description) formData.append('description', meta.description);
  if (meta?.time_limit) formData.append('time_limit', String(meta.time_limit));
  if (meta?.max_attempts) formData.append('max_attempts', String(meta.max_attempts));
  const res = await api.post(`/quiz/categories/${categoryId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await api.delete(`/quiz/${id}`);
};

export const submitQuizResult = async (
  quizId: string,
  answers: Record<string, string>,
  timeSpent?: number
): Promise<QuizResultData> => {
  const res = await api.post(`/quiz/${quizId}/submit`, {
    answers,
    time_spent: timeSpent,
  });
  return res.data.data;
};

export const checkQuizAttempts = async (
  quizId: string
): Promise<{ attemptCount: number; maxAttempts: number | null; canAttempt: boolean }> => {
  const res = await api.get(`/quiz/${quizId}/attempts`);
  return res.data.data;
};
