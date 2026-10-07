import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getDb } from '../db';
import { authMiddleware } from '../middlewares/auth';
import { validateBusca } from '../middlewares/validate';
import type { Busca } from '../types';

export const buscaRouter = Router();

// Todas as rotas de busca exigem token
buscaRouter.use(authMiddleware);

buscaRouter.post('/', validateBusca, async (req, res) => {
  try {
    const { latitude, longitude, distritoMaisProximo, quantidadeResultados } = req.body;

    const registro: Busca = {
      id: uuidv4(),
      usuarioId: String(req.userId),
      medicamento: String(req.body.medicamento).trim(),
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      distritoMaisProximo: distritoMaisProximo ?? null,
      quantidadeResultados,
      timestamp: new Date().toISOString(),
    };

    const db = await getDb();
    db.data.buscas.push(registro);
    await db.write();

    res.status(201).json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

buscaRouter.get('/', async (req, res) => {
  try {
    const db = await getDb();

    const minhasBuscas = db.data.buscas
      .filter((b) => b.usuarioId === req.userId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    res.status(200).json(minhasBuscas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});
