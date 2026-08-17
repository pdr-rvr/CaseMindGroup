import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { AppError } from '../utils/AppError';

// Multer em memória para avatar
const storage = multer.memoryStorage();
export const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // Limite de 3MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Apenas arquivos de imagem são permitidos para o avatar.', 400));
    }
  },
});

/**
 * Retorna o perfil do usuário autenticado.
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    const user = await UserModel.findByIdWithProfileImage(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna o avatar do usuário como stream binário.
 */
export const getUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      throw new AppError('ID de usuário inválido.', 400);
    }

    const avatarData = await UserModel.findRawAvatarById(userId);
    if (!avatarData || !avatarData.profile_picture_data) {
      throw new AppError('Avatar não encontrado.', 404);
    }

    res.set({
      'Content-Type': avatarData.profile_picture_mime_type,
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(avatarData.profile_picture_data);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza os dados do perfil do usuário (nome, avatar).
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    const { name, lastName } = req.body;
    let hasUpdates = false;

    // Se veio nome completo ou nome + sobrenome
    let fullName = name;
    if (lastName && typeof lastName === 'string' && lastName.trim()) {
      fullName = name ? `${name.trim()} ${lastName.trim()}` : lastName.trim();
    }

    if (fullName && typeof fullName === 'string' && fullName.trim()) {
      await UserModel.updateProfile(userId, { name: fullName.trim() });
      hasUpdates = true;
    }

    if (req.file) {
      await UserModel.updateProfilePicture(userId, req.file.buffer, req.file.mimetype);
      hasUpdates = true;
    }

    if (!hasUpdates) {
      throw new AppError('Nenhum dado válido para atualização foi fornecido.', 400);
    }

    const updatedUser = await UserModel.findByIdWithProfileImage(userId);

    res.json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Altera a senha do usuário autenticado validando a senha atual.
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new AppError('Acesso não autorizado.', 401);
    }

    if (!currentPassword || !newPassword) {
      throw new AppError('Senha atual e nova senha são obrigatórias.', 400);
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new AppError('A nova senha deve ter no mínimo 6 caracteres.', 400);
    }

    const userWithPassword = await UserModel.findByEmail(req.user?.email || '');
    if (!userWithPassword) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!passwordMatch) {
      throw new AppError('A senha atual informada está incorreta.', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(userId, hashedNewPassword);

    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};