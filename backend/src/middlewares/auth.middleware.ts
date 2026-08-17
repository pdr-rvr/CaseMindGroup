import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from '../utils/AppError';

dotenv.config();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return next(new AppError('Acesso não autorizado. Nenhum token fornecido.', 401));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Configuração interna do JWT ausente.', 500));
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Token de autenticação inválido ou expirado.', 401));
  }
};