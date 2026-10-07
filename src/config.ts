import dotenv from 'dotenv';

dotenv.config();

// Configuração lida do .env. O servidor não sobe sem JWT_SECRET,
// para evitar tokens assinados com uma chave vazia.
const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret) {
  console.error('JWT_SECRET não definido. Copie .env.example para .env e defina uma chave.');
  process.exit(1);
}

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
  jwtSecret,
  jwtExpiresIn: '30d',
} as const;
