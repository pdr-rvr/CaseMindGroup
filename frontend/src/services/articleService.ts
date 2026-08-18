import api from './api';
import { Article } from '../types/article';

export const articleService = {
  getAllArticles: async (search?: string, page?: number, limit?: number): Promise<Article[]> => {
    try {
      const params: Record<string, any> = {};
      if (search && search.trim()) params.search = search.trim();
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const response = await api.get<Article[]>('/articles', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os artigos:', error);
      return [];
    }
  },

  getFeaturedArticle: async (): Promise<Article | null> => {
    try {
      const response = await api.get<Article>('/articles/featured');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar artigo em destaque:', error);
      return null;
    }
  },

  getRecentArticles: async (): Promise<Article[]> => {
    try {
      const response = await api.get<Article[]>('/articles/recent');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar artigos recentes:', error);
      return [];
    }
  },

  getNewArticles: async (): Promise<Article[]> => {
    try {
      const response = await api.get<Article[]>('/articles/new');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar novos artigos:', error);
      return [];
    }
  },

  getArticleById: async (id: number): Promise<Article | null> => {
    try {
      const response = await api.get<Article>(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar artigo ${id}:`, error);
      return null;
    }
  },

  getMyArticles: async (): Promise<Article[]> => {
    try {
      const response = await api.get<Article[]>('/articles/my');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar meus artigos:', error);
      return [];
    }
  },

  createArticle: async (formData: FormData): Promise<{ message: string; article: Article }> => {
    const response = await api.post<{ message: string; article: Article }>('/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateArticle: async (id: number, formData: FormData): Promise<{ message: string; article: Article }> => {
    const response = await api.put<{ message: string; article: Article }>(`/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteArticle: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/articles/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      return false;
    }
  },
};