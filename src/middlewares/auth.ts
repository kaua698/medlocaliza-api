import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Lê o header "Authorization: Bearer <token>", valida o JWT e coloca o id do usuário em req.userId
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId?: string };

    if (!payload.userId) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Sessão expirada ou inválida' });
  }
};
