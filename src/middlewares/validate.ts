// MIDDLEWARES DE VALIDAÇÃO — verificam os campos do body antes de chegar nas rotas
// Para adicionar novos campos obrigatórios, siga o mesmo padrão de verificação e retorne 400 com { error: "mensagem" }
export const validateCadastro = (
  req: any,
  res: any,
  next: any,
): void => {
  const { nome, email, senha } = req.body ?? {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nome || String(nome).trim().length === 0) {
    res.status(400).json({ error: 'Nome é obrigatório' });
    return;
  }

  if (!email || !emailRegex.test(String(email))) {
    res.status(400).json({ error: 'Email inválido' });
    return;
  }

  if (!senha || String(senha).length < 6) {
    res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    return;
  }

  next();
};

export const validateLogin = (
  req: any,
  res: any,
  next: any,
): void => {
  const { email, senha } = req.body ?? {};

  if (!email || String(email).trim().length === 0) {
    res.status(400).json({ error: 'Email é obrigatório' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email))) {
    res.status(400).json({ error: 'Email inválido' });
    return;
  }

  if (!senha || String(senha).trim().length === 0) {
    res.status(400).json({ error: 'Senha é obrigatória' });
    return;
  }

  next();
};

export const validateBusca = (
  req: any,
  res: any,
  next: any,
): void => {
  const {
    medicamento,
    latitude,
    longitude,
    distritoMaisProximo,
    quantidadeResultados,
  } = req.body ?? {};

  if (!medicamento || String(medicamento).trim().length === 0) {
    res.status(400).json({ error: 'medicamento é obrigatório' });
    return;
  }

  if (typeof latitude !== 'number' || Number.isNaN(latitude)) {
    res.status(400).json({ error: 'latitude deve ser um número' });
    return;
  }

  if (latitude < -90 || latitude > 90) {
    res.status(400).json({ error: 'latitude fora do intervalo válido' });
    return;
  }

  if (typeof longitude !== 'number' || Number.isNaN(longitude)) {
    res.status(400).json({ error: 'longitude deve ser um número' });
    return;
  }

  if (longitude < -180 || longitude > 180) {
    res.status(400).json({ error: 'longitude fora do intervalo válido' });
    return;
  }

  if (
    typeof distritoMaisProximo !== 'number' ||
    !Number.isInteger(distritoMaisProximo)
  ) {
    res.status(400).json({ error: 'distritoMaisProximo deve ser um inteiro' });
    return;
  }

  if (distritoMaisProximo < 1 || distritoMaisProximo > 8) {
    res.status(400).json({ error: 'distritoMaisProximo fora do intervalo válido' });
    return;
  }

  if (typeof quantidadeResultados !== 'number' || Number.isNaN(quantidadeResultados)) {
    res.status(400).json({ error: 'quantidadeResultados deve ser um número' });
    return;
  }

  if (quantidadeResultados < 0) {
    res.status(400).json({ error: 'quantidadeResultados deve ser >= 0' });
    return;
  }

  next();
};




