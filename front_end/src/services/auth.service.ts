import api from './api';
import {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  VerifyResetOtpData,
  ResetPasswordData,
  GoogleAuthData,
  VerifyOtpData,
  AuthResponse,
  ApiResponse,
  User,
} from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<{ verified: boolean }>> {
    const response = await api.post<ApiResponse<{ verified: boolean }>>('/auth/verify-otp', data);
    return response.data;
  },

  async resendOtp(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/resend-otp');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/forgot-password', data);
    return response.data;
  },

  async verifyResetOtp(data: VerifyResetOtpData): Promise<ApiResponse<{ resetToken: string }>> {
    const response = await api.post<ApiResponse<{ resetToken: string }>>('/auth/verify-reset-otp', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },
};
