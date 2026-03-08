export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
  audio_url?: string;
  category?: string;
  difficulty: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  difficulty: string;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  lesson_id?: string;
  time_limit?: number;
  questions: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  order: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id?: string;
  vocabulary_id?: string;
  status: string;
  score?: number;
  completed_at?: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  time_spent?: number;
  completed_at: string;
  quiz?: { title: string; max_attempts: number | null };
}

export interface DashboardStats {
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  recentQuizzes: QuizResult[];
  vocabCount: number;
  vocabCategories: { category: string; count: number }[];
  grammarLevels: { id: string; name: string; topicCount: number }[];
}
