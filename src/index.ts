import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth';
import { buscaRouter } from './routes/buscas';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'medlocaliza-api' }));

app.use('/auth', authRouter);
app.use('/buscas', buscaRouter);

// PORTA DO SERVIDOR — padrão 3333; altere no .env com PORT=outro_numero se necessário
// O servidor escuta em 0.0.0.0 para aceitar conexões da rede local (necessário para testes no celular físico)
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, '0.0.0.0', () => {
  const url = `http://localhost:${port}/`;
  console.log(`medlocaliza-api running at ${url}`);
});





