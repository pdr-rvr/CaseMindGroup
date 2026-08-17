import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { AppError } from '../utils/AppError';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET não está configurado no ambiente.', 500);
  }
  return secret;
};

const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

/**
 * Registra um novo usuário.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new AppError('O nome deve ter pelo menos 2 caracteres.', 400);
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new AppError('Informe um endereço de e-mail válido.', 400);
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new AppError('A senha deve conter no mínimo 6 caracteres.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError('Este e-mail já está em uso.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: userId, email: normalizedEmail },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() } as jwt.SignOptions
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Autentica o usuário e gera o token JWT.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('E-mail e senha são obrigatórios.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() } as jwt.SignOptions
    );

    const userProfile = await UserModel.findByIdWithProfileImage(user.id);

    res.json({
      token,
      user: userProfile || {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Recuperação / Alteração de senha por email.
 */
export const changePasswordByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      throw new AppError('E-mail e nova senha são obrigatórios.', 400);
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new AppError('A nova senha deve ter pelo menos 6 caracteres.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      // Mensagem genérica por segurança
      throw new AppError('Não foi possível alterar a senha. Verifique o e-mail informado.', 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const success = await UserModel.updatePasswordByEmail(normalizedEmail, hashedPassword);

    if (!success) {
      throw new AppError('Falha ao atualizar a senha. Tente novamente mais tarde.', 500);
    }

    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    next(error);
  }
};