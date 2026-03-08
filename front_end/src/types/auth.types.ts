export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role?: string; // "user" | "admin"
  country?: string | null;
  english_level?: string | null;
  is_verified?: boolean;
  auth_provider?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  country?: string;
  english_level?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetOtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface GoogleAuthData {
  token: string;
}

export interface VerifyOtpData {
  otp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}
