import api from './api';
import { UserInfo } from '../types/user';

export const userService = {
  getProfile: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>('/users/profile');
    return response.data;
  },

  updateProfile: async (formData: FormData): Promise<{ message: string; user: UserInfo }> => {
    const response = await api.put<{ message: string; user: UserInfo }>('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
