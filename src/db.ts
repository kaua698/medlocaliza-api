import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import type { Busca, Usuario } from './types';

export type DBData = {
  usuarios: Usuario[];
  buscas: Busca[];
};

const adapter = new JSONFile<DBData>(path.join(process.cwd(), 'db.json'));
const db = new Low<DBData>(adapter, { usuarios: [], buscas: [] });


export const getDb = async () => {
  await db.read();

  if (!db.data) {
    db.data = { usuarios: [], buscas: [] };
  }

  if (!db.data.usuarios) db.data.usuarios = [];
  if (!db.data.buscas) db.data.buscas = [];

  return db;
};

