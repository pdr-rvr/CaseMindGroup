import axios from 'axios';
import { Article } from '../types/article';

const API_BASE_URL = 'http://localhost:3000/api'; // Altere para a URL da sua API backend

export const articleService = {
  getFeaturedArticle: async (): Promise<Article | null> => {
    try {
      const mockArticle: Article = {
        id: 1,
        title: 'Desvendando o JavaScript: Dicas e Técnicas Essenciais para Desenvolvedores',
        content: `Neste artigo, exploramos o JavaScript em profundidade, desde os fundamentos até técnicas avançadas que todo desenvolvedor precisa dominar. Aprenda sobre closures, protótipos, async/await e muito mais.`,
        featured_image: null, // Replace with actual image data if available
        image_mime_type: null,
        author_id: 1,
        author_name: 'John Doe',
        created_at: '2025-03-20T10:00:00Z',
        updated_at: '2025-03-20T10:00:00Z',
      };
      return mockArticle;
    } catch (error) {
      console.error('Error fetching featured article:', error);
      return null;
    }
  },

  getRecentArticles: async (): Promise<Article[]> => {
    try {
      // Mocking recent articles for now
      const mockArticles: Article[] = [
        {
          id: 2,
          title: '5 Gerações de Redes 5G: O Que Esperar da Próxima Revolução da Conectividade',
          content: 'Neste artigo, exploramos as cinco gerações de redes 5G e o impacto que terão no futuro da conectividade.',
          featured_image: null, // Replace with actual image data
          image_mime_type: null,
          author_id: 2,
          author_name: 'Jane Smith',
          created_at: '2025-03-19T10:00:00Z',
          updated_at: '2025-03-19T10:00:00Z',
        },
        {
          id: 3,
          title: 'Blockchain Além das Criptomoedas: Como a Tecnologia Está Transformando Indústrias Tradicionais',
          content: 'O blockchain está revolucionando diversas indústrias, muito além das criptomoedas. Descubra como essa tecnologia está sendo aplicada em logística, saúde e mais.',
          featured_image: null, // Replace with actual image data
          image_mime_type: null,
          author_id: 3,
          author_name: 'Peter Jones',
          created_at: '2025-03-20T10:00:00Z',
          updated_at: '2025-03-20T10:00:00Z',
        },
        {
          id: 4,
          title: 'Dominando TypeScript: Por que a Tipagem Estática Está Transformando o Desenvolvimento Frontend',
          content: 'TypeScript traz tipagem estática para JavaScript, melhorando a manutenibilidade e a qualidade do código. Aprenda os benefícios e como começar a usá-lo.',
          featured_image: null, // Replace with actual image data
          image_mime_type: null,
          author_id: 4,
          author_name: 'Alice Brown',
          created_at: '2025-03-16T10:00:00Z',
          updated_at: '2025-03-16T10:00:00Z',
        },
      ];
      return mockArticles;
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      return [];
    }
  },

  getNewArticles: async (): Promise<Article[]> => {
    try {
      // Mocking "New" articles for the right sidebar
      const mockNewArticles: Article[] = [
        {
          id: 5,
          title: 'Inteligência Artificial: O Futuro da Automação e da Transformação Digital',
          content: 'Neste artigo, exploramos como a inteligência artificial está moldando o futuro dos negócios e da tecnologia, impulsionando a automação e a transformação digital em diversas indústrias.',
          featured_image: null,
          image_mime_type: null,
          author_id: 5,
          author_name: 'Carlos Lima',
          created_at: '2025-03-22T10:00:00Z',
          updated_at: '2025-03-22T10:00:00Z',
        },
        {
          id: 6,
          title: 'Computação Quântica: O Próximo Grande Salto para a Tecnologia',
          content: 'A computação quântica promete revolucionar a maneira como processamos informações, superando as limitações dos computadores tradicionais. Neste artigo, mergulhamos nos fundamentos e nas aplicações potenciais dessa tecnologia disruptiva.',
          featured_image: null,
          image_mime_type: null,
          author_id: 6,
          author_name: 'Beatriz Costa',
          created_at: '2025-03-21T10:00:00Z',
          updated_at: '2025-03-21T10:00:00Z',
        },
        {
          id: 7,
          title: 'Como a Internet das Coisas (IoT) Está Moldando o Futuro das Cidades Inteligentes',
          content: 'A Internet das Coisas (IoT) é um dos pilares das cidades inteligentes, conectando dispositivos do dia a dia à internet para coletar e compartilhar dados. Nesta abordagem, discutimos o papel da IoT na criação de ambientes urbanos mais eficientes e sustentáveis, desde a gestão de tráfego até o monitoramento ambiental.',
          featured_image: null,
          image_mime_type: null,
          author_id: 7,
          author_name: 'Gabriel Silva',
          created_at: '2025-03-20T10:00:00Z',
          updated_at: '2025-03-20T10:00:00Z',
        },
        {
          id: 8,
          title: 'O Impacto da Realidade Virtual e Aumentada no Setor de Educação',
          content: 'A realidade virtual (RV) e aumentada (RA) estão ganhando destaque no setor educacional, proporcionando novas maneiras de aprender e ensinar. Este artigo explora como essas tecnologias imersivas podem transformar a experiência de aprendizagem, tornando-a mais interativa e envolvente para estudantes de todas as idades.',
          featured_image: null,
          image_mime_type: null,
          author_id: 8,
          author_name: 'Juliana Fernandes',
          created_at: '2025-03-19T10:00:00Z',
          updated_at: '2025-03-19T10:00:00Z',
        },
      ];
      return mockNewArticles;
    } catch (error) {
      console.error('Error fetching new articles:', error);
      return [];
    }
  },
};