import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';
import { useAppStore, VIEW_STATES } from './stores/appStore';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import VocabularyPage from './pages/VocabularyPage';
import LessonsPage from './pages/LessonsPage';
import QuizPage from './pages/QuizPage';
import QuizPlayPage from './pages/QuizPlayPage';
import GrammarTopicPage from './pages/GrammarTopicPage';
import SettingsPage from './pages/SettingsPage';

// Components
import MainLayout from './components/layouts/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { view, setView, selectedGrammarTopic, activeQuiz } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync store view with URL on initial load and navigation
  useEffect(() => {
    const path = location.pathname;
    if (path === '/welcome') setView(VIEW_STATES.WELCOME);
    else if (path === '/login') setView(VIEW_STATES.LOGIN);
    else if (path === '/register') setView(VIEW_STATES.REGISTER);
    else if (path === '/forgot-password') setView(VIEW_STATES.FORGOT_PASSWORD);
    else if (path === '/verify-otp') setView(VIEW_STATES.VERIFY_OTP);
    else if (path === '/reset-password') setView(VIEW_STATES.RESET_PASSWORD);
    else if (path === '/dashboard') setView(VIEW_STATES.HOME);
    else if (path === '/vocabulary') setView(VIEW_STATES.VOCABULARY);
    else if (path === '/lessons') setView(VIEW_STATES.LESSONS);
    else if (path === '/quiz') setView(VIEW_STATES.QUIZ_LIST);
    else if (path === '/profile') setView(VIEW_STATES.PROFILE);
    else if (path === '/settings') setView(VIEW_STATES.SETTINGS);
    else if (path.startsWith('/grammar/topic/')) setView(VIEW_STATES.GRAMMAR_TOPIC_DETAIL);
    else if (path.startsWith('/quiz/')) setView(VIEW_STATES.QUIZ_PLAY);
  }, []);

  // Sync URL with store view
  useEffect(() => {
    const pathMap: Record<string, string> = {
      [VIEW_STATES.WELCOME]: '/welcome',
      [VIEW_STATES.HOME]: '/dashboard',
      [VIEW_STATES.LOGIN]: '/login',
      [VIEW_STATES.REGISTER]: '/register',
      [VIEW_STATES.FORGOT_PASSWORD]: '/forgot-password',
      [VIEW_STATES.VERIFY_OTP]: '/verify-otp',
      [VIEW_STATES.RESET_PASSWORD]: '/reset-password',
      [VIEW_STATES.PROFILE]: '/profile',
      [VIEW_STATES.SETTINGS]: '/settings',
      [VIEW_STATES.LESSONS]: '/lessons',
      [VIEW_STATES.VOCABULARY]: '/vocabulary',
      [VIEW_STATES.QUIZ_LIST]: '/quiz',
    };

    let targetPath = pathMap[view];

    // Handle dynamic routes
    if (view === VIEW_STATES.GRAMMAR_TOPIC_DETAIL && selectedGrammarTopic) {
      targetPath = `/grammar/topic/${selectedGrammarTopic.id}`;
    } else if (view === VIEW_STATES.QUIZ_PLAY && activeQuiz) {
      targetPath = `/quiz/${activeQuiz.id}`;
    }

    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [view, navigate, location.pathname, selectedGrammarTopic, activeQuiz]);

  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <ProtectedRoute>
            <VerifyOtpPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="vocabulary" element={<VocabularyPage />} />
        <Route path="grammar/topic/:id" element={<GrammarTopicPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/:id" element={<QuizPlayPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default App;
