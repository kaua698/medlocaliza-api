import type { NextFunction, Request, Response } from 'express';

// Validações dos bodies. Em caso de erro, respondem 400 com { error } e não chamam a rota.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_DISTRITOS = 8;

const fail = (res: Response, error: string) => {
  res.status(400).json({ error });
};

const isBlank = (value: unknown) => value === undefined || value === null || String(value).trim() === '';
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export const validateCadastro = (req: Request, res: Response, next: NextFunction) => {
  const { nome, email, senha } = req.body ?? {};

  if (isBlank(nome)) return fail(res, 'Nome é obrigatório');
  if (String(nome).trim().length > 80) return fail(res, 'Nome muito longo');
  if (isBlank(email) || !EMAIL_REGEX.test(String(email).trim())) return fail(res, 'Email inválido');
  if (isBlank(senha) || String(senha).length < 6) return fail(res, 'Senha deve ter no mínimo 6 caracteres');

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, senha } = req.body ?? {};

  if (isBlank(email)) return fail(res, 'Email é obrigatório');
  if (!EMAIL_REGEX.test(String(email).trim())) return fail(res, 'Email inválido');
  if (isBlank(senha)) return fail(res, 'Senha é obrigatória');

  next();
};

export const validateBusca = (req: Request, res: Response, next: NextFunction) => {
  const { medicamento, latitude, longitude, distritoMaisProximo, quantidadeResultados } = req.body ?? {};

  if (isBlank(medicamento)) return fail(res, 'medicamento é obrigatório');
  if (String(medicamento).trim().length > 100) return fail(res, 'medicamento muito longo');

  // Localização é opcional: o app envia null quando o usuário não libera a permissão.
  // Se vier, precisa ser completa e válida.
  const hasLocation = latitude != null || longitude != null;
  if (hasLocation) {
    if (!isFiniteNumber(latitude) || latitude < -90 || latitude > 90) return fail(res, 'latitude inválida');
    if (!isFiniteNumber(longitude) || longitude < -180 || longitude > 180) return fail(res, 'longitude inválida');
  }

  if (distritoMaisProximo != null) {
    if (!Number.isInteger(distritoMaisProximo) || distritoMaisProximo < 1 || distritoMaisProximo > TOTAL_DISTRITOS) {
      return fail(res, `distritoMaisProximo deve ser um inteiro de 1 a ${TOTAL_DISTRITOS}`);
    }
  }

  if (!Number.isInteger(quantidadeResultados) || quantidadeResultados < 0) {
    return fail(res, 'quantidadeResultados deve ser um inteiro >= 0');
  }

  next();
};
