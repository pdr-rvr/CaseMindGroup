import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se for erro operacional customizado (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? 'error' : 'fail',
      message: err.message,
    });
    return;
  }

  // Trata erro de chave duplicada no MySQL (ex: email já cadastrado)
  if (err?.code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      status: 'fail',
      message: 'Este registro ou e-mail já está cadastrado no sistema.',
    });
    return;
  }

  // Trata erro de JWT inválido ou expirado
  if (err?.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'fail',
      message: 'Token de autenticação inválido.',
    });
    return;
  }
  if (err?.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'fail',
      message: 'Sua sessão expirou. Faça login novamente.',
    });
    return;
  }

  // Log de erros não previstos para monitoramento
  console.error('[ERRO NÃO TRATADO]:', err);

  res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
};