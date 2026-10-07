import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import type { Busca, Usuario } from './types';

export type DBData = {
  usuarios: Usuario[];
  buscas: Busca[];
};

// Banco em arquivo JSON (db.json na raiz da API). Criado automaticamente se não existir.
const adapter = new JSONFile<DBData>(path.join(process.cwd(), 'db.json'));
const db = new Low<DBData>(adapter, { usuarios: [], buscas: [] });

export const getDb = async () => {
  await db.read();

  db.data ??= { usuarios: [], buscas: [] };
  db.data.usuarios ??= [];
  db.data.buscas ??= [];

  return db;
};
