import api from './api';
import { ApiResponse, User } from '../types/auth.types';
import { DashboardStats } from '../types';

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; avatar?: string | null; country?: string | null; english_level?: string | null }): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post<ApiResponse<User>>('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/users/change-password', data);
    return response.data;
  },

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get<ApiResponse<DashboardStats>>('/users/dashboard');
    return response.data;
  },
};
