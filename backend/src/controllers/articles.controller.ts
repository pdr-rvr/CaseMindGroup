import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import ArticleModel from '../models/article.model';
import { AppError } from '../utils/AppError';

// Configuração do multer em memória para evitar arquivos órfãos em disco
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Apenas arquivos de imagem são permitidos.', 400));
    }
  },
});

/**
 * Retorna todos os artigos, com suporte opcional a busca (?search=...) e paginação.
 */
export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const offset = limit && page > 1 ? (page - 1) * limit : undefined;

    const articles = await ArticleModel.findAll(search, limit, offset);
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna o artigo em destaque.
 */
export const getFeaturedArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await ArticleModel.findFeatured();
    if (!article) {
      res.status(404).json({ message: 'Nenhum artigo em destaque encontrado.' });
      return;
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna os 3 artigos mais recentes.
 */
export const getRecentArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await ArticleModel.findRecent(3);
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna os 6 novos artigos.
 */
export const getNewArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await ArticleModel.findRecent(6);
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna um artigo específico por ID.
 */
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = Number(req.params.id);
    if (isNaN(articleId)) {
      throw new AppError('ID do artigo inválido.', 400);
    }

    const article = await ArticleModel.findById(articleId);
    if (!article) {
      throw new AppError('Artigo não encontrado.', 404);
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna os artigos do usuário autenticado.
 */
export const getMyArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    const articles = await ArticleModel.findByAuthorId(authorId);
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

/**
 * Serve a imagem binária com cabeçalhos de cache otimizados.
 */
export const getArticleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = Number(req.params.id);
    if (isNaN(articleId)) {
      throw new AppError('ID inválido.', 400);
    }

    const imageData = await ArticleModel.findRawImageById(articleId);
    if (!imageData || !imageData.featured_image) {
      throw new AppError('Imagem não encontrada.', 404);
    }

    res.set({
      'Content-Type': imageData.image_mime_type,
      'Cache-Control': 'public, max-age=86400', // Cache de 1 dia no navegador
    });
    res.send(imageData.featured_image);
  } catch (error) {
    next(error);
  }
};

/**
 * Cria um novo artigo com autor vinculado.
 */
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new AppError('O título do artigo é obrigatório.', 400);
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new AppError('O conteúdo do artigo é obrigatório.', 400);
    }

    let featuredImage: Buffer | null = null;
    let imageMimeType: string | null = null;

    if (req.file) {
      featuredImage = req.file.buffer;
      imageMimeType = req.file.mimetype;
    }

    const articleId = await ArticleModel.create({
      title: title.trim(),
      content: content.trim(),
      featured_image: featuredImage,
      image_mime_type: imageMimeType,
      author_id: authorId,
    });

    const createdArticle = await ArticleModel.findById(articleId);

    res.status(201).json({
      message: 'Artigo publicado com sucesso!',
      article: createdArticle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um artigo existente (somente o autor).
 */
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = Number(req.params.id);
    const authorId = req.user?.id;
    const { title, content } = req.body;

    if (!authorId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    if (isNaN(articleId)) {
      throw new AppError('ID do artigo inválido.', 400);
    }

    const existingArticle = await ArticleModel.findById(articleId);
    if (!existingArticle) {
      throw new AppError('Artigo não encontrado.', 404);
    }

    if (existingArticle.author_id !== authorId) {
      throw new AppError('Você não tem permissão para editar este artigo.', 403);
    }

    const updateData: {
      title?: string;
      content?: string;
      featured_image?: Buffer | null;
      image_mime_type?: string | null;
    } = {};

    if (title && typeof title === 'string' && title.trim()) {
      updateData.title = title.trim();
    }
    if (content && typeof content === 'string' && content.trim()) {
      updateData.content = content.trim();
    }

    if (req.file) {
      updateData.featured_image = req.file.buffer;
      updateData.image_mime_type = req.file.mimetype;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('Nenhum dado informado para atualização.', 400);
    }

    const updated = await ArticleModel.update(articleId, updateData);
    if (!updated) {
      throw new AppError('Nenhuma alteração foi realizada.', 400);
    }

    const updatedArticle = await ArticleModel.findById(articleId);

    res.json({
      message: 'Artigo atualizado com sucesso!',
      article: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deleta um artigo (somente o autor).
 */
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = Number(req.params.id);
    const authorId = req.user?.id;

    if (!authorId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    if (isNaN(articleId)) {
      throw new AppError('ID do artigo inválido.', 400);
    }

    const existingArticle = await ArticleModel.findById(articleId);
    if (!existingArticle) {
      throw new AppError('Artigo não encontrado.', 404);
    }

    if (existingArticle.author_id !== authorId) {
      throw new AppError('Você não tem permissão para excluir este artigo.', 403);
    }

    await ArticleModel.delete(articleId);

    res.json({ message: 'Artigo excluído com sucesso!' });
  } catch (error) {
    next(error);
  }
};