import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

// Rota pública de avatar
router.get('/:id/avatar', userController.getUserAvatar);

// Rotas protegidas de perfil
router.get('/profile', authenticate, userController.getUserProfile);
router.put(
  '/profile',
  authenticate,
  userController.uploadProfileImage.single('profile_picture'),
  userController.updateProfile
);
router.put('/change-password', authenticate, userController.updatePassword);

export default router;