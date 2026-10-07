import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';

import { config } from './config';
import { authRouter } from './routes/auth';
import { buscaRouter } from './routes/buscas';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'medlocaliza-api' });
});

app.use('/auth', authRouter);
app.use('/buscas', buscaRouter);

// Rota inexistente
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Erros não tratados (ex.: JSON malformado no body) sempre respondem em JSON
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'JSON inválido no corpo da requisição' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

// Escuta em 0.0.0.0 para aceitar conexões da rede local (celular físico com Expo Go)
app.listen(config.port, '0.0.0.0', () => {
  console.log(`medlocaliza-api rodando em http://localhost:${config.port}/`);
});
