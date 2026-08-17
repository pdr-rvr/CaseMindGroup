import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as articlesController from '../controllers/articles.controller';

const router = Router();

// Rotas públicas de listagem e destaques
router.get('/featured', articlesController.getFeaturedArticle);
router.get('/recent', articlesController.getRecentArticles);
router.get('/new', articlesController.getNewArticles);
router.get('/', articlesController.getAllArticles);

// Rota protegida para artigos do usuário autenticado (deve vir antes de /:id)
router.get('/my', authenticate, articlesController.getMyArticles);

// Rota de imagem de artigo
router.get('/:id/image', articlesController.getArticleImage);

// Rota de leitura detalhada por ID
router.get('/:id', articlesController.getArticleById);

// Rotas de mutação protegidas
router.post(
  '/',
  authenticate,
  articlesController.upload.single('featured_image'),
  articlesController.createArticle
);

router.put(
  '/:id',
  authenticate,
  articlesController.upload.single('featured_image'),
  articlesController.updateArticle
);

router.delete(
  '/:id',
  authenticate,
  articlesController.deleteArticle
);

export default router;