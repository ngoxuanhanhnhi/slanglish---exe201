import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TopicItem, GrammarLevel, GrammarTopic } from '../services/vocabulary.service';
import { QuizCategory, QuizListItem, QuizDetail } from '../services/quiz.service';
import { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

// ─── Constants ────────────────────────────────────────────────────────────────
export const VIEW_STATES = {
    WELCOME: 'welcome',
    HOME: 'home', // Dashboard
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    VERIFY_OTP: 'verify-otp',
    RESET_PASSWORD: 'reset-password',
    PROFILE: 'profile',
    SETTINGS: 'settings',
    LESSONS: 'lessons',
    VOCABULARY: 'vocabulary',
    VOCAB_CATEGORIES: 'vocab-categories',
    GRAMMAR: 'grammar',
    GRAMMAR_TOPIC_LIST: 'grammar-topic-list',
    GRAMMAR_TOPIC_DETAIL: 'grammar-topic-detail',
    VOCAB_LIST: 'vocab-list',
    TOPIC_LIST: 'topic-list',
    TOPIC_VOCAB_LIST: 'topic-vocab-list',
    QUIZ_LIST: 'quiz-list',
    QUIZ_PLAY: 'quiz-play',
} as const;

export type View = typeof VIEW_STATES[keyof typeof VIEW_STATES];

export const CATEGORIES = [
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
        name: 'Từ vựng level A1',
        description: 'Từ vựng căn bản nhất dành cho người mới bắt đầu',
        icon: '🌱',
        gradient: 'from-green-400 to-emerald-500',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-700',
    },
    {
        id: 'a2',
        name: 'Từ vựng level A2',
        description: 'Mở rộng vốn từ cho giao tiếp đời thường',
        icon: '🌿',
        gradient: 'from-teal-400 to-cyan-500',
        lightBg: 'bg-teal-50',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
    },
    {
        id: 'b1',
        name: 'Từ vựng level B1',
        description: 'Trung cấp cho xã hội, công việc',
        icon: '📘',
        gradient: 'from-blue-400 to-blue-600',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
    },
    {
        id: 'b2',
        name: 'Từ vựng level B2',
        description: 'Nâng cao cho tranh luận, ý kiến',
        icon: '💡',
        gradient: 'from-indigo-400 to-violet-500',
        lightBg: 'bg-indigo-50',
        border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-700',
    },
    {
        id: 'c1',
        name: 'Từ vựng level C1',
        description: 'Dành cho người dùng thành thạo',
        icon: '🎯',
        gradient: 'from-purple-400 to-purple-600',
        lightBg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700',
    },
    {
        id: 'c2',
        name: 'Từ vựng level C2',
        description: 'Trình độ thông thạo như người bản ngữ',
        icon: '🏆',
        gradient: 'from-rose-400 to-pink-600',
        lightBg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-700',
    },
];

export const GRAMMAR_LEVEL_COLORS = [
    { gradient: 'from-green-400 to-emerald-500', lightBg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '📝' },
    { gradient: 'from-orange-400 to-amber-500', lightBg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: '🔥' },
    { gradient: 'from-blue-400 to-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '🎯' },
    { gradient: 'from-purple-400 to-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '⚡' },
    { gradient: 'from-rose-400 to-pink-600', lightBg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', icon: '💪' },
];

// ─── Store State & Actions ────────────────────────────────────────────────────
interface AppState {
    // Navigation State
    view: View;
    history: View[];
    isInitialized: boolean;
    user: User | null;
    token: string | null;

    // Selection State
    searchQuery: string;
    selectedCategoryId: string;
    selectedTopic: TopicItem | null;
    selectedLevel: GrammarLevel | null;
    selectedGrammarTopic: GrammarTopic | null;

    // Navigation Actions
    setView: (view: View) => void;
    goBack: () => void;
    setCategory: (categoryId: string) => void;
    setSelectedCategoryId: (categoryId: string) => void;
    setSearchQuery: (query: string) => void;
    setTopic: (topic: TopicItem | null) => void;
    setTopicOnly: (topic: TopicItem | null) => void;
    setLevel: (level: GrammarLevel | null) => void;
    setLevelOnly: (level: GrammarLevel | null) => void;
    setGrammarTopic: (topic: GrammarTopic | null) => void;
    resetSelections: () => void;

    // Auth Core Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setInitialized: (isInitialized: boolean) => void;
    logout: () => Promise<void>;
    initializeAuth: () => Promise<void>;

    // --- Auth State ---
    authStep: 1 | 2 | 3 | 4;
    authEmail: string;
    authResetToken: string;
    authOtp: string[];
    authCountdown: number;
    authCanResend: boolean;
    authLoading: boolean;
    authShowPassword: boolean;
    authShowConfirmPassword: boolean;
    authIsGoogleLoading: boolean;
    regSelectedCountry: string;
    regSelectedLevel: string;
    otpIsVerified: boolean;

    setAuthStep: (step: 1 | 2 | 3 | 4) => void;
    setAuthEmail: (email: string) => void;
    setAuthResetToken: (token: string) => void;
    setAuthOtp: (otp: string[]) => void;
    setAuthCountdown: (seconds: number) => void;
    setAuthCanResend: (can: boolean) => void;
    setAuthLoading: (loading: boolean) => void;
    setAuthShowPassword: (show: boolean) => void;
    setAuthShowConfirmPassword: (show: boolean) => void;
    setAuthIsGoogleLoading: (loading: boolean) => void;
    setRegSelectedCountry: (country: string) => void;
    setRegSelectedLevel: (level: string) => void;
    setOtpIsVerified: (isVerified: boolean) => void;

    // --- Quiz State ---
    quizCategories: QuizCategory[];
    selectedQuizCategory: QuizCategory | null;
    quizzes: QuizListItem[];
    quizzesLoading: boolean;
    activeQuiz: QuizDetail | null;
    quizPhase: 'quiz' | 'result' | 'blocked';
    quizAnswers: Record<string, string>;
    quizCurrentIdx: number;
    quizRemaining: number | null;
    quizElapsed: number;

    setQuizCategories: (cats: QuizCategory[]) => void;
    setSelectedQuizCategory: (cat: QuizCategory | null) => void;
    setQuizzes: (quizzes: QuizListItem[]) => void;
    setQuizzesLoading: (loading: boolean) => void;
    setActiveQuiz: (quiz: QuizDetail | null) => void;
    setQuizPhase: (phase: 'quiz' | 'result' | 'blocked') => void;
    setQuizAnswer: (questionId: string, value: string) => void;
    resetQuizAnswers: () => void;
    setQuizCurrentIdx: (idx: number) => void;
    setQuizTimer: (remaining: number | null, elapsed: number) => void;

    // --- Profile & Settings ---
    profileIsEditing: boolean;
    profileIsUpdating: boolean;
    profileIsPasswordOpen: boolean;
    profileIsChangingPassword: boolean;
    profileShowCurrentPassword: boolean;
    profileShowNewPassword: boolean;
    profileSelectedCountry: string;
    profileSelectedLevel: string;
    profileAvatarPreview: string | null;
    profileAvatarFile: File | null;
    profileIsUploadingAvatar: boolean;

    setProfileIsEditing: (editing: boolean) => void;
    setProfileIsUpdating: (updating: boolean) => void;
    setProfileIsPasswordOpen: (open: boolean) => void;
    setProfileIsChangingPassword: (changing: boolean) => void;
    setProfileShowCurrentPassword: (show: boolean) => void;
    setProfileShowNewPassword: (show: boolean) => void;
    setProfileSelectedCountry: (country: string) => void;
    setProfileSelectedLevel: (level: string) => void;
    setProfileAvatarPreview: (preview: string | null) => void;
    setProfileAvatarFile: (file: File | null) => void;
    setProfileIsUploadingAvatar: (uploading: boolean) => void;

    // --- Settings ---
    settingsDarkMode: boolean;
    settingsAutoPlay: boolean;
    settingsLanguage: string;
    setSettingsDarkMode: (darkMode: boolean) => void;
    setSettingsAutoPlay: (autoPlay: boolean) => void;
    setSettingsLanguage: (language: string) => void;

    // --- Grammar Topic Detail ---
    grammarTopicDetail: any; // GrammarTopicDetail | null
    grammarLoading: boolean;
    grammarError: string;
    setGrammarTopicDetail: (topic: any) => void;
    setGrammarLoading: (loading: boolean) => void;
    setGrammarError: (error: string) => void;

    // --- Lessons ---
    lessonsDifficulty: string;
    setLessonsDifficulty: (difficulty: string) => void;

    // --- Reset Password ---
    resetPassShowPassword: boolean;
    resetPassShowConfirmPassword: boolean;
    resetPassLoading: boolean;
    resetPassSuccess: boolean;
    setResetPassShowPassword: (show: boolean) => void;
    setResetPassShowConfirmPassword: (show: boolean) => void;
    setResetPassLoading: (loading: boolean) => void;
    setResetPassSuccess: (success: boolean) => void;
}

export const useAppStore = create<AppState>()(persist((set) => ({
    // Initial UI State
    view: VIEW_STATES.WELCOME,
    history: [],
    isInitialized: false,
    user: null,
    token: null,
    searchQuery: '',
    selectedCategoryId: 'slang',
    selectedTopic: null,
    selectedLevel: null,
    selectedGrammarTopic: null,

    // Auth Initial State
    authStep: 1,
    authEmail: '',
    authResetToken: '',
    authOtp: Array(6).fill(''),
    authCountdown: 15 * 60,
    authCanResend: false,
    authLoading: false,
    authShowPassword: false,
    authShowConfirmPassword: false,
    authIsGoogleLoading: false,
    regSelectedCountry: '',
    regSelectedLevel: '',
    otpIsVerified: false,

    // Quiz Initial State
    quizCategories: [],
    selectedQuizCategory: null,
    quizzes: [],
    quizzesLoading: false,
    activeQuiz: null,
    quizPhase: 'quiz',
    quizAnswers: {},
    quizCurrentIdx: 0,
    quizRemaining: null,
    quizElapsed: 0,

    // Profile & Settings Initial State
    profileIsEditing: false,
    profileIsUpdating: false,
    profileIsPasswordOpen: false,
    profileIsChangingPassword: false,
    profileShowCurrentPassword: false,
    profileShowNewPassword: false,
    profileSelectedCountry: '',
    profileSelectedLevel: '',
    profileAvatarPreview: null,
    profileAvatarFile: null,
    profileIsUploadingAvatar: false,

    // Settings Initial State
    settingsDarkMode: false,
    settingsAutoPlay: true,
    settingsLanguage: 'vi',

    // Grammar Topic Detail Initial State
    grammarTopicDetail: null,
    grammarLoading: false,
    grammarError: '',

    // Lessons Initial State
    lessonsDifficulty: 'all',

    // Reset Password Initial State
    resetPassShowPassword: false,
    resetPassShowConfirmPassword: false,
    resetPassLoading: false,
    resetPassSuccess: false,

    // Navigation Actions
    setView: (view: View) => set((state: AppState) => ({
        history: [...state.history, state.view],
        view
    })),

    goBack: () => set((state: AppState) => {
        if (state.history.length === 0) return { view: VIEW_STATES.HOME };
        const newHistory = [...state.history];
        const prevView = newHistory.pop()!;
        return { view: prevView, history: newHistory };
    }),

    setCategory: (categoryId: string) => set({
        selectedCategoryId: categoryId,
        view: VIEW_STATES.VOCAB_LIST,
        selectedTopic: null
    }),

    setSelectedCategoryId: (categoryId: string) => set({ selectedCategoryId: categoryId }),

    setSearchQuery: (query: string) => set({ searchQuery: query }),

    setTopic: (topic: TopicItem | null) => set({
        selectedTopic: topic,
        view: topic ? VIEW_STATES.TOPIC_VOCAB_LIST : VIEW_STATES.TOPIC_LIST
    }),

    setTopicOnly: (topic: TopicItem | null) => set({ selectedTopic: topic }),

    setLevel: (level: GrammarLevel | null) => set({
        selectedLevel: level,
        view: level ? VIEW_STATES.GRAMMAR_TOPIC_LIST : VIEW_STATES.GRAMMAR
    }),

    setLevelOnly: (level: GrammarLevel | null) => set({ selectedLevel: level }),

    setGrammarTopic: (topic: GrammarTopic | null) => set({
        selectedGrammarTopic: topic,
        view: topic ? VIEW_STATES.GRAMMAR_TOPIC_DETAIL : VIEW_STATES.GRAMMAR_TOPIC_LIST
    }),

    resetSelections: () => set({
        searchQuery: '',
        selectedTopic: null,
        selectedLevel: null,
        selectedGrammarTopic: null,
        selectedCategoryId: 'slang'
    }),

    // Auth Core Actions
    setUser: (user: User | null) => set({ user }),
    setToken: (token: string | null) => set({ token }),
    setInitialized: (isInitialized: boolean) => set({ isInitialized }),
    logout: async () => {
        try {
            await authService.logout();
        } catch (e) { /* ignore */ }
        set({ user: null, token: null, view: VIEW_STATES.WELCOME, history: [] });
    },
    initializeAuth: async () => {
        const state = useAppStore.getState();

        // If no token, we're definitely unauthenticated
        if (!state.token) {
            set({ user: null, isInitialized: true });
            return;
        }

        // Optimistically treat the stored session as valid so the UI doesn't flicker
        set({ isInitialized: true });

        try {
            // Background verification: keep existing user from persist while checking
            const res = await authService.getMe();
            if (res.success && res.data) {
                set({ user: res.data }); // Silent update
            } else {
                // Token invalid or expired
                set({ user: null, token: null, view: VIEW_STATES.WELCOME });
            }
        } catch (e) {
            // On server/network error, don't kick user out immediately if we have a session
            console.error('Auth check failed:', e);
        }
    },

    // Auth Actions
    setAuthStep: (step: 1 | 2 | 3 | 4) => set({ authStep: step }),
    setAuthEmail: (email: string) => set({ authEmail: email }),
    setAuthResetToken: (token: string) => set({ authResetToken: token }),
    setAuthOtp: (otp: string[]) => set({ authOtp: otp }),
    setAuthCountdown: (seconds: number) => set({ authCountdown: seconds }),
    setAuthCanResend: (can: boolean) => set({ authCanResend: can }),
    setAuthLoading: (loading: boolean) => set({ authLoading: loading }),
    setAuthShowPassword: (show: boolean) => set({ authShowPassword: show }),
    setAuthShowConfirmPassword: (show: boolean) => set({ authShowConfirmPassword: show }),
    setAuthIsGoogleLoading: (loading: boolean) => set({ authIsGoogleLoading: loading }),
    setRegSelectedCountry: (country: string) => set({ regSelectedCountry: country }),
    setRegSelectedLevel: (level: string) => set({ regSelectedLevel: level }),
    setOtpIsVerified: (isVerified: boolean) => set({ otpIsVerified: isVerified }),

    // Quiz Actions
    setQuizCategories: (cats: QuizCategory[]) => set({ quizCategories: cats }),
    setSelectedQuizCategory: (cat: QuizCategory | null) => set({ selectedQuizCategory: cat }),
    setQuizzes: (qs: QuizListItem[]) => set({ quizzes: qs }),
    setQuizzesLoading: (loading: boolean) => set({ quizzesLoading: loading }),
    setActiveQuiz: (quiz: QuizDetail | null) => set({ activeQuiz: quiz }),
    setQuizPhase: (phase: 'quiz' | 'result' | 'blocked') => set({ quizPhase: phase }),
    setQuizAnswer: (id: string, val: string) => set((state: AppState) => ({
        quizAnswers: { ...state.quizAnswers, [id]: val }
    })),
    resetQuizAnswers: () => set({ quizAnswers: {} }),
    setQuizCurrentIdx: (idx: number) => set({ quizCurrentIdx: idx }),
    setQuizTimer: (r: number | null, e: number) => set({ quizRemaining: r, quizElapsed: e }),

    // Profile Actions
    setProfileIsEditing: (editing: boolean) => set({ profileIsEditing: editing }),
    setProfileIsUpdating: (updating: boolean) => set({ profileIsUpdating: updating }),
    setProfileIsPasswordOpen: (open: boolean) => set({ profileIsPasswordOpen: open }),
    setProfileIsChangingPassword: (changing: boolean) => set({ profileIsChangingPassword: changing }),
    setProfileShowCurrentPassword: (show: boolean) => set({ profileShowCurrentPassword: show }),
    setProfileShowNewPassword: (show: boolean) => set({ profileShowNewPassword: show }),
    setProfileSelectedCountry: (country: string) => set({ profileSelectedCountry: country }),
    setProfileSelectedLevel: (level: string) => set({ profileSelectedLevel: level }),
    setProfileAvatarPreview: (preview: string | null) => set({ profileAvatarPreview: preview }),
    setProfileAvatarFile: (file: File | null) => set({ profileAvatarFile: file }),
    setProfileIsUploadingAvatar: (uploading: boolean) => set({ profileIsUploadingAvatar: uploading }),

    // Settings Actions
    setSettingsDarkMode: (darkMode: boolean) => set({ settingsDarkMode: darkMode }),
    setSettingsAutoPlay: (autoPlay: boolean) => set({ settingsAutoPlay: autoPlay }),
    setSettingsLanguage: (language: string) => set({ settingsLanguage: language }),

    // Grammar Topic Detail Actions
    setGrammarTopicDetail: (topic: any) => set({ grammarTopicDetail: topic }),
    setGrammarLoading: (loading: boolean) => set({ grammarLoading: loading }),
    setGrammarError: (error: string) => set({ grammarError: error }),

    // Lessons Actions
    setLessonsDifficulty: (difficulty: string) => set({ lessonsDifficulty: difficulty }),

    // Reset Password Actions
    setResetPassShowPassword: (show: boolean) => set({ resetPassShowPassword: show }),
    setResetPassShowConfirmPassword: (show: boolean) => set({ resetPassShowConfirmPassword: show }),
    setResetPassLoading: (loading: boolean) => set({ resetPassLoading: loading }),
    setResetPassSuccess: (success: boolean) => set({ resetPassSuccess: success }),
}), {
    name: 'english-app-storage',
    partialize: (state: AppState) => ({
        user: state.user,
        token: state.token,
        view: state.view,
        settingsDarkMode: state.settingsDarkMode,
        settingsAutoPlay: state.settingsAutoPlay,
        settingsLanguage: state.settingsLanguage
    }),
}));
