import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { validateCadastro, validateLogin } from '../middlewares/validate';
import { getDb } from '../db';
import { comparePassword, hashPassword } from '../utils/hash';
import type { UsuarioPublico } from '../types';

export const authRouter = Router();

authRouter.post('/cadastro', validateCadastro, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const db = await getDb();
    const existing = db.data?.usuarios?.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

    if (existing) {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }

    const id = uuidv4();
    const senhaHash = await hashPassword(String(senha));

    const usuario = {
      id,
      nome: String(nome),
      email: String(email),
      senhaHash,
    };

    db.data?.usuarios?.push(usuario);
    await db.write();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Configuração do servidor inválida' });
      return;
    }

    // JWT: payload contém { userId: id } para identificar o usuário nas rotas autenticadas
    const token = jwt.sign({ userId: id }, secret, { expiresIn: '30d' });


    const usuarioPublico: UsuarioPublico = { id, nome: usuario.nome, email: usuario.email };
    res.status(201).json({ token, usuario: usuarioPublico });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});

authRouter.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, senha } = req.body;

    const db = await getDb();
    const usuario = db.data?.usuarios?.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

    if (!usuario) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    const ok = await comparePassword(String(senha), usuario.senhaHash);
    if (!ok) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Configuração do servidor inválida' });
      return;
    }

    const token = jwt.sign({ userId: usuario.id }, secret, { expiresIn: '30d' });

    const usuarioPublico: UsuarioPublico = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    res.status(200).json({ token, usuario: usuarioPublico });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});


