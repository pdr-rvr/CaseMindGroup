import api from './api';
import axios from 'axios';
import { AuthResponse } from '../types/user';

export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao cadastrar usuário. Tente novamente.');
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Credenciais inválidas ou erro de conexão.');
    }
  },

  changePasswordWithEmail: async (email: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>('/auth/change-password-by-email', {
        email,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao alterar senha. Tente novamente.');
    }
  },
};

export const registerUser = authService.register;
export const loginUser = authService.login;
export const changePasswordWithEmail = authService.changePasswordWithEmail;
