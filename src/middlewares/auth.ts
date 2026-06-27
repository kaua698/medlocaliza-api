import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null;

  if (!token) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { userId?: string };

    if (!payload?.userId) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Não autorizado' });
  }
};


