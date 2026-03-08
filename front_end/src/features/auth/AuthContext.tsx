import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { User } from '../../types/auth.types';
import { authService } from '../../services/auth.service';
import { useAppStore } from '../../stores/appStore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, country?: string, english_level?: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    setUser,
    setToken,
    isInitialized,
    logout: storeLogout
  } = useAppStore();

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setToken(token);
      setUser(userData);
    }
  };

  const register = async (email: string, password: string, name: string, country?: string, english_level?: string) => {
    const response = await authService.register({ email, password, name, country, english_level });
    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setToken(token);
      setUser(userData);
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    const response = await authService.googleAuth({ token: googleToken });
    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setToken(token);
      setUser(userData);
    }
  };

  const logout = async () => {
    await storeLogout();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAdmin = user?.role === 'admin';
  const isLoading = !isInitialized;

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isLoading, login, register, loginWithGoogle, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
