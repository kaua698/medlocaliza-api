import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { authMiddleware } from '../middlewares/auth';
import { validateBusca } from '../middlewares/validate';
import { getDb } from '../db';

export const buscaRouter = Router();

buscaRouter.post('/', authMiddleware, validateBusca, async (req, res) => {
  try {
    const {
      medicamento,
      latitude,
      longitude,
      distritoMaisProximo,
      quantidadeResultados,
    } = req.body;

    const db = await getDb();

    const registro = {
      id: uuidv4(),
      usuarioId: String(req.userId),
      medicamento: String(medicamento),
      latitude,
      longitude,
      distritoMaisProximo,
      quantidadeResultados,
      timestamp: new Date().toISOString(),
    };

    db.data.buscas.push(registro);
    await db.write();

    res.status(201).json(registro);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});

buscaRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();

    const usuarioId = String(req.userId);

    const minhasBuscas = (db.data.buscas ?? [])
      .filter((b) => String(b.usuarioId) === usuarioId)
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

    res.status(200).json(minhasBuscas);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});



