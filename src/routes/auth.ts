import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config';
import { getDb } from '../db';
import { validateCadastro, validateLogin } from '../middlewares/validate';
import { comparePassword, hashPassword } from '../utils/hash';
import type { Usuario, UsuarioPublico } from '../types';

export const authRouter = Router();

const normalizeEmail = (email: unknown) => String(email).trim().toLowerCase();

// O token carrega só o id do usuário; o middleware de auth usa esse id nas rotas protegidas
const signToken = (userId: string) =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const toPublic = ({ id, nome, email }: Usuario): UsuarioPublico => ({ id, nome, email });

authRouter.post('/cadastro', validateCadastro, async (req, res) => {
  try {
    const nome = String(req.body.nome).trim();
    const email = normalizeEmail(req.body.email);
    const senha = String(req.body.senha);

    const db = await getDb();

    if (db.data.usuarios.some((u) => normalizeEmail(u.email) === email)) {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }

    const usuario: Usuario = {
      id: uuidv4(),
      nome,
      email,
      senhaHash: await hashPassword(senha),
    };

    db.data.usuarios.push(usuario);
    await db.write();

    res.status(201).json({ token: signToken(usuario.id), usuario: toPublic(usuario) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

authRouter.post('/login', validateLogin, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const senha = String(req.body.senha);

    const db = await getDb();
    const usuario = db.data.usuarios.find((u) => normalizeEmail(u.email) === email);

    // Mesma mensagem para email inexistente e senha errada, para não revelar quais emails existem
    if (!usuario || !(await comparePassword(senha, usuario.senhaHash))) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    res.status(200).json({ token: signToken(usuario.id), usuario: toPublic(usuario) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});
