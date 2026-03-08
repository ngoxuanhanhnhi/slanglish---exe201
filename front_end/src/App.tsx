import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const { view } = useAppStore();

  if (isLoading) return null; // Wait for initialization

  if (user && view === VIEW_STATES.LOGIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { view, setView, initializeAuth, isInitialized } = useAppStore();
  const location = useLocation();

  // Initialize Auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 1. Sync URL to Store on mount and path change
  // This is the ONLY sync we need if we use standard <Link> or navigate() on clicks
  useEffect(() => {
    const path = location.pathname;
    let newView: any = null;

    if (path === '/welcome') newView = VIEW_STATES.WELCOME;
    else if (path === '/login') newView = VIEW_STATES.LOGIN;
    else if (path === '/register') newView = VIEW_STATES.REGISTER;
    else if (path === '/forgot-password') newView = VIEW_STATES.FORGOT_PASSWORD;
    else if (path === '/verify-otp') newView = VIEW_STATES.VERIFY_OTP;
    else if (path === '/reset-password') newView = VIEW_STATES.RESET_PASSWORD;
    else if (path === '/dashboard') newView = VIEW_STATES.HOME;
    else if (path === '/vocabulary') {
      if (view !== VIEW_STATES.VOCAB_CATEGORIES) {
        newView = VIEW_STATES.VOCABULARY;
      }
    }
    else if (path === '/lessons') newView = VIEW_STATES.LESSONS;
    else if (path === '/quiz') newView = VIEW_STATES.QUIZ_LIST;
    else if (path === '/profile') newView = VIEW_STATES.PROFILE;
    else if (path === '/settings') newView = VIEW_STATES.SETTINGS;
    else if (path.startsWith('/grammar/topic/')) newView = VIEW_STATES.GRAMMAR_TOPIC_DETAIL;
    else if (path.startsWith('/quiz/')) newView = VIEW_STATES.QUIZ_PLAY;

    if (newView && newView !== view) {
      setView(newView);
    }
  }, [location.pathname, setView]);

  // Handle initialization loading state at the top
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
