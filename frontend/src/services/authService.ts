import api from './api';
import axios from 'axios';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface MessageResponse {
  message: string;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao registrar.');
    }
    throw new Error('Erro de rede ou servidor ao registrar.');
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao fazer login.');
    }
    throw new Error('Erro de rede ou servidor ao fazer login.');
  }
};

export const changePasswordWithEmail = async (email: string, newPassword: string): Promise<MessageResponse> => {
  try {
    const response = await api.post<MessageResponse>('/auth/change-password-by-email', { email, newPassword });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao alterar a senha.');
    }
    throw new Error('Erro de rede ou servidor ao alterar a senha.');
  }
};
