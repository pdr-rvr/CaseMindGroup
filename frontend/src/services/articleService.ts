import api from './api';
import { Article } from '../types/article';

export const articleService = {
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

  getAllArticles: async (): Promise<Article[]> => {
    try {
      const response = await api.get<Article[]>('/articles');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os artigos:', error);
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

  createArticle: async (articleData: FormData, token: string): Promise<Article | null> => {
    try {
      const response = await api.post<Article>('/articles', articleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      return null;
    }
  },

  updateArticle: async (id: number, articleData: FormData, token: string): Promise<Article | null> => {
    try {
      const response = await api.put<Article>(`/articles/${id}`, articleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      return null;
    }
  },

  deleteArticle: async (id: number, token: string): Promise<boolean> => {
    try {
      await api.delete(`/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      return false;
    }
  },
};

export const getNewestArticles = async (): Promise<Article[]> => {
  try {
    const response = await api.get<Article[]>('/articles/new');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os novos artigos:', error);
    throw error;
  }
};